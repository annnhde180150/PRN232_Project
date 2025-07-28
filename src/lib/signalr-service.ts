import * as signalR from "@microsoft/signalr";
import { ChatMessage } from "../types/chat";
import { Notification } from "../types/notification";

export interface SignalRNotification {
  title: string;
  message: string;
  notificationType: string;
  referenceId: string;
  timestamp?: string;
}

export interface SignalRCallbacks {
  onChatMessage?: (message: ChatMessage) => void;
  onNotification?: (notification: SignalRNotification) => void;
  onUserStatusChanged?: (
    userId: string,
    userType: string,
    isOnline: boolean
  ) => void;
  onConnected?: (message: string) => void;
  onError?: (error: string) => void;
  onReconnected?: () => void;
  onDisconnected?: () => void;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private callbacks: SignalRCallbacks = {};
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private joinedConversations = new Set<string>();
  private isInitialized = false;

  constructor() {
    // Don't initialize connection in constructor to avoid SSR issues
  }

  private isClientSide(): boolean {
    return typeof window !== "undefined";
  }

  private setupConnection() {
    if (!this.isClientSide()) {
      console.warn("SignalR: Cannot setup connection on server side");
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7192";
    const hubUrl = `${baseUrl}/notificationHub`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          const token = localStorage.getItem("auth_token");
          return token || "";
        },
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff with jitter
          const delay = Math.min(
            this.reconnectDelay * Math.pow(2, retryContext.previousRetryCount),
            this.maxReconnectDelay
          );
          return delay + Math.random() * 1000; // Add jitter
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
    this.isInitialized = true;
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    // Connection events
    this.connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      this.callbacks.onDisconnected?.();
    });

    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting:", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      this.reconnectAttempts = 0;
      this.callbacks.onReconnected?.();

      // Rejoin all conversations after reconnection
      this.rejoinConversations();
    });

    // Hub events
    this.connection.on("Connected", (message: string) => {
      console.log("SignalR Connected:", message);
      this.callbacks.onConnected?.(message);
    });

    this.connection.on("ReceiveChatMessage", (message: ChatMessage) => {
      console.log("Received chat message:", message);
      this.callbacks.onChatMessage?.(message);
    });

    this.connection.on(
      "ReceiveNotification",
      (notification: SignalRNotification) => {
        console.log("Received notification:", notification);
        this.callbacks.onNotification?.(notification);
      }
    );

    this.connection.on(
      "UserStatusChanged",
      (userId: string, userType: string, isOnline: boolean) => {
        console.log("User status changed:", { userId, userType, isOnline });
        this.callbacks.onUserStatusChanged?.(userId, userType, isOnline);
      }
    );

    this.connection.on("JoinedConversation", (conversationId: string) => {
      console.log("Joined conversation:", conversationId);
      this.joinedConversations.add(conversationId);
    });

    this.connection.on("LeftConversation", (conversationId: string) => {
      console.log("Left conversation:", conversationId);
      this.joinedConversations.delete(conversationId);
    });

    this.connection.on("Error", (error: string) => {
      console.error("SignalR Error:", error);
      this.callbacks.onError?.(error);
    });
  }

  public setCallbacks(callbacks: SignalRCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public async connect(): Promise<boolean> {
    if (!this.isClientSide()) {
      console.warn("SignalR: Cannot connect on server side");
      return false;
    }

    // Initialize connection if not already done
    if (!this.isInitialized) {
      this.setupConnection();
    }

    if (!this.connection || this.isConnecting) {
      return false;
    }

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return true;
    }

    this.isConnecting = true;

    try {
      await this.connection.start();
      console.log("SignalR connection established");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      return true;
    } catch (error) {
      console.error("Error connecting to SignalR:", error);
      this.isConnecting = false;
      this.callbacks.onError?.(`Connection failed: ${error}`);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isClientSide()) {
      return;
    }

    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR connection stopped");
      } catch (error) {
        console.error("Error stopping SignalR connection:", error);
      }
    }
  }

  public async joinConversation(conversationId: string): Promise<boolean> {
    if (!this.isClientSide()) {
      return false;
    }

    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("Cannot join conversation: SignalR not connected");
      return false;
    }

    try {
      await this.connection.invoke("JoinConversation", conversationId);
      return true;
    } catch (error) {
      console.error("Error joining conversation:", error);
      this.callbacks.onError?.(`Failed to join conversation: ${error}`);
      return false;
    }
  }

  private async invoke(method: string, ...args: any[]): Promise<boolean> {
    if (!this.isClientSide()) {
      return false;
    }

    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn(`Cannot invoke method ${method}: SignalR not connected`);
      this.callbacks.onError?.(`Cannot invoke method ${method}: Not connected`);
      return false;
    }

    try {
      await this.connection.invoke(method, ...args);
      return true;
    } catch (error) {
      console.error(`Error invoking method ${method}:`, error);
      this.callbacks.onError?.(`Failed to invoke method ${method}: ${error}`);
      return false;
    }
  }

  public async leaveConversation(conversationId: string): Promise<boolean> {
    return this.invoke("LeaveConversation", conversationId);
  }

  public async sendChatMessageToConversation(
    conversationId: string,
    message: ChatMessage
  ): Promise<boolean> {
    return this.invoke(
      "SendChatMessageToConversation",
      conversationId,
      message
    );
  }

  private async rejoinConversations(): Promise<void> {
    const conversationsToRejoin = Array.from(this.joinedConversations);

    for (const conversationId of conversationsToRejoin) {
      try {
        await this.joinConversation(conversationId);
      } catch (error) {
        console.error(
          `Failed to rejoin conversation ${conversationId}:`,
          error
        );
      }
    }
  }

  public isConnected(): boolean {
    if (!this.isClientSide()) {
      return false;
    }
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    if (!this.isClientSide()) {
      return null;
    }
    return this.connection?.state || null;
  }

  public async refreshConnection(): Promise<boolean> {
    if (!this.isClientSide()) {
      return false;
    }

    if (this.connection) {
      await this.disconnect();
      this.isInitialized = false;
    }
    return await this.connect();
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
