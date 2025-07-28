import { useEffect, useRef, useState } from 'react';
import { signalRService, SignalRCallbacks } from '../lib/signalr-service';
import { useAuth } from '../contexts/AuthContext';

export interface UseSignalROptions {
    autoConnect?: boolean;
    callbacks?: SignalRCallbacks;
}

export const useSignalR = (options: UseSignalROptions = {}) => {
    const { autoConnect = true, callbacks = {} } = options;
    const { isAuthenticated } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [connectionState, setConnectionState] = useState<string>('Disconnected');
    const [error, setError] = useState<string | null>(null);
    const callbacksRef = useRef(callbacks);

    // Check if we're on the client side
    const isClientSide = typeof window !== 'undefined';

    // Update callbacks ref when they change and update SignalR service
    useEffect(() => {
        callbacksRef.current = callbacks;

        const signalRCallbacks: SignalRCallbacks = {
            onConnected: (message) => {
                setIsConnected(true);
                setConnectionState('Connected');
                setError(null);
                callbacksRef.current.onConnected?.(message);
            },
            onDisconnected: () => {
                setIsConnected(false);
                setConnectionState('Disconnected');
                callbacksRef.current.onDisconnected?.();
            },
            onReconnected: () => {
                setIsConnected(true);
                setConnectionState('Connected');
                setError(null);
                callbacksRef.current.onReconnected?.();
            },
            onError: (error) => {
                setError(error);
                callbacksRef.current.onError?.(error);
            },
            onChatMessage: (message) => {
                console.log('useSignalR onChatMessage called:', message);
                console.log('Current callback:', callbacksRef.current.onChatMessage);
                callbacksRef.current.onChatMessage?.(message);
            },
            onNotification: (notification) => {
                callbacksRef.current.onNotification?.(notification);
            },
            onUserStatusChanged: (userId, userType, isOnline) => {
                callbacksRef.current.onUserStatusChanged?.(userId, userType, isOnline);
            },
        };

        signalRService.setCallbacks(signalRCallbacks);
    }, [callbacks]);

    // Handle connection based on authentication status
    useEffect(() => {
        if (!isClientSide) return;

        if (isAuthenticated && autoConnect) {
            connect();
        } else if (!isAuthenticated) {
            disconnect();
        }

        return () => {
            if (!isAuthenticated) {
                disconnect();
            }
        };
    }, [isAuthenticated, autoConnect, isClientSide]);

    // Update connection state periodically
    useEffect(() => {
        if (!isClientSide) return;

        const interval = setInterval(() => {
            const state = signalRService.getConnectionState();
            const connected = signalRService.isConnected();

            setIsConnected(connected);
            setConnectionState(state?.toString() || 'Unknown');
        }, 1000);

        return () => clearInterval(interval);
    }, [isClientSide]);

    const connect = async (): Promise<boolean> => {
        if (!isClientSide) {
            setError('Cannot connect: Not on client side');
            return false;
        }

        if (!isAuthenticated) {
            setError('Cannot connect: User not authenticated');
            return false;
        }

        try {
            setError(null);
            const success = await signalRService.connect();
            return success;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Connection failed';
            setError(errorMessage);
            return false;
        }
    };

    const disconnect = async (): Promise<void> => {
        try {
            await signalRService.disconnect();
            setIsConnected(false);
            setConnectionState('Disconnected');
            setError(null);
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    };

    const joinConversation = async (conversationId: string): Promise<boolean> => {
        if (!isConnected) {
            setError('Cannot join conversation: Not connected');
            return false;
        }

        try {
            const success = await signalRService.joinConversation(conversationId);
            if (!success) {
                setError('Failed to join conversation');
            }
            return success;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to join conversation';
            setError(errorMessage);
            return false;
        }
    };

    const leaveConversation = async (conversationId: string): Promise<boolean> => {
        if (!isConnected) {
            return true; // Already disconnected, consider it as "left"
        }

        try {
            const success = await signalRService.leaveConversation(conversationId);
            if (!success) {
                setError('Failed to leave conversation');
            }
            return success;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to leave conversation';
            setError(errorMessage);
            return false;
        }
    };

    const sendChatMessageToConversation = async (conversationId: string, message: any): Promise<boolean> => {
        if (!isConnected) {
            setError('Cannot send message: Not connected');
            return false;
        }

        try {
            const success = await signalRService.sendChatMessageToConversation(conversationId, message);
            if (!success) {
                setError('Failed to send message');
            }
            return success;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            setError(errorMessage);
            return false;
        }
    };

    const refreshConnection = async (): Promise<boolean> => {
        try {
            setError(null);
            const success = await signalRService.refreshConnection();
            return success;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to refresh connection';
            setError(errorMessage);
            return false;
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        isConnected,
        connectionState,
        error,
        connect,
        disconnect,
        joinConversation,
        leaveConversation,
        sendChatMessageToConversation,
        refreshConnection,
        clearError,
    };
};
