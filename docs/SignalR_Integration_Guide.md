# SignalR Real-time Integration Guide

## Overview

This document describes the SignalR real-time messaging integration implemented in the Find Helper frontend application. The integration provides real-time chat messaging and notifications using Microsoft SignalR.

## Architecture

### Components

1. **SignalR Service** (`src/lib/signalr-service.ts`) - Core SignalR connection management
2. **useSignalR Hook** (`src/hooks/useSignalR.ts`) - React hook for SignalR integration
3. **Updated ChatContext** (`src/contexts/ChatContext.tsx`) - Real-time chat functionality
4. **Updated NotificationContext** (`src/contexts/NotificationContext.tsx`) - Real-time notifications
5. **Chat Demo** (`src/app/chat-demo/page.tsx`) - Testing interface

### Key Features

- ✅ Real-time message delivery
- ✅ Automatic reconnection with exponential backoff
- ✅ Conversation management (join/leave)
- ✅ JWT authentication
- ✅ Error handling and recovery
- ✅ Browser notification support
- ✅ Connection state management
- ✅ Fallback to polling when disconnected

## Installation

The SignalR client library is already installed:

```bash
npm install @microsoft/signalr
```

## Configuration

### Hub URL

The SignalR hub is configured to connect to:

```
https://helper-finder.azurewebsites.net/notificationHub
```

### Authentication

JWT token is automatically included from localStorage:

```javascript
accessTokenFactory: () => {
  const token = localStorage.getItem("auth_token");
  return token || "";
};
```

## Usage

### 1. Basic Setup

The SignalR integration is automatically initialized when using the ChatProvider and NotificationProvider:

```tsx
import { ChatProvider } from "../contexts/ChatContext";
import { NotificationProvider } from "../contexts/NotificationContext";

function App() {
  return (
    <ChatProvider>
      <NotificationProvider>{/* Your app components */}</NotificationProvider>
    </ChatProvider>
  );
}
```

### 2. Using the Chat Context

```tsx
import { useChat } from "../contexts/ChatContext";

function ChatComponent() {
  const {
    conversations,
    activeConversation,
    messages,
    unreadCount,
    selectConversation,
    sendMessage,
  } = useChat();

  // Messages are automatically updated in real-time
  // No need for manual polling
}
```

### 3. Using the Notification Context

```tsx
import { useNotifications } from "../contexts/NotificationContext";

function NotificationComponent() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  // Notifications are received in real-time
  // Browser notifications are shown automatically
}
```

### 4. Direct SignalR Hook Usage

```tsx
import { useSignalR } from "../hooks/useSignalR";

function CustomComponent() {
  const signalR = useSignalR({
    autoConnect: true,
    callbacks: {
      onChatMessage: (message) => {
        console.log("New message:", message);
      },
      onNotification: (notification) => {
        console.log("New notification:", notification);
      },
    },
  });

  return (
    <div>
      <p>Connection: {signalR.isConnected ? "Connected" : "Disconnected"}</p>
      <button onClick={() => signalR.joinConversation("conversation_id")}>
        Join Conversation
      </button>
    </div>
  );
}
```

## SignalR Events

### Incoming Events (from server)

#### 1. Connected

Fired when connection is established:

```javascript
onConnected: (message: string) => {
  console.log("Connected:", message); // "Welcome User 123"
};
```

#### 2. ReceiveChatMessage

Fired when a new chat message is received:

```javascript
onChatMessage: (message: ChatMessage) => {
  // Handle real-time message
};
```

#### 3. ReceiveNotification

Fired when a new notification is received:

```javascript
onNotification: (notification: SignalRNotification) => {
  // Handle real-time notification
};
```

#### 4. UserStatusChanged

Fired when a user's online status changes:

```javascript
onUserStatusChanged: (userId: string, userType: string, isOnline: boolean) => {
  // Handle user status change
};
```

### Outgoing Methods (to server)

#### 1. JoinConversation

Join a specific conversation for targeted message delivery:

```javascript
await signalR.joinConversation("user_123_helper_456");
```

#### 2. LeaveConversation

Leave a conversation:

```javascript
await signalR.leaveConversation("user_123_helper_456");
```

## Connection Management

### Automatic Reconnection

The service implements automatic reconnection with:

- Exponential backoff (1s → 2s → 4s → ... → 30s max)
- Maximum 10 retry attempts
- Automatic conversation rejoining after reconnection

### Connection States

- `Disconnected` - Not connected
- `Connecting` - Attempting to connect
- `Connected` - Successfully connected
- `Reconnecting` - Attempting to reconnect

### Manual Connection Control

```javascript
const signalR = useSignalR();

// Manual connect
await signalR.connect();

// Manual disconnect
await signalR.disconnect();

// Refresh connection (disconnect + reconnect)
await signalR.refreshConnection();
```

## Error Handling

### Connection Errors

```javascript
onError: (error: string) => {
  console.error("SignalR Error:", error);
  // Handle connection errors
};
```

### Common Error Scenarios

1. **Authentication Failed** - Invalid or expired JWT token
2. **Network Issues** - Connection timeout or network unavailable
3. **Server Unavailable** - Hub endpoint not responding

### Error Recovery

- Automatic reconnection for network issues
- Token refresh handling for authentication errors
- Fallback to REST API polling when SignalR is unavailable

## Testing

### Chat Demo Page

Visit `/chat-demo` to test the SignalR integration:

1. **Connection Status** - View real-time connection state
2. **Send Messages** - Test real-time message delivery
3. **Conversations** - Test conversation management
4. **Notifications** - View real-time notifications

### Testing Scenarios

1. **Real-time Messaging**

   - Open chat demo in two browser tabs
   - Login as different users
   - Send messages and verify real-time delivery

2. **Connection Recovery**

   - Disconnect network
   - Reconnect network
   - Verify automatic reconnection

3. **Conversation Management**
   - Join/leave conversations
   - Verify targeted message delivery

## Performance Considerations

### Optimizations Implemented

1. **Single Connection** - One SignalR connection per app instance
2. **Selective Joining** - Only join active conversations
3. **Automatic Cleanup** - Leave conversations when not needed
4. **Fallback Polling** - Only when SignalR is disconnected
5. **Message Batching** - Efficient UI updates

### Memory Management

- Automatic cleanup on component unmount
- Connection disposal on logout
- Event listener cleanup

## Browser Notifications

### Setup

Browser notification permission is requested automatically:

```javascript
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}
```

### Notification Display

Real-time notifications automatically show browser notifications when:

- Permission is granted
- App is in background or not focused
- Notification contains title and message

## Troubleshooting

### Common Issues

1. **Connection Fails**

   - Check JWT token validity
   - Verify hub URL accessibility
   - Check network connectivity

2. **Messages Not Received**

   - Verify SignalR connection status
   - Check conversation joining
   - Verify user authentication

3. **Reconnection Issues**
   - Check token expiration
   - Verify network stability
   - Review error logs

### Debug Information

Enable detailed logging:

```javascript
// In signalr-service.ts
.configureLogging(signalR.LogLevel.Debug) // Change from Information
```

### Testing Connection

```javascript
// Check connection status
console.log("Connected:", signalR.isConnected());
console.log("State:", signalR.getConnectionState());

// Test connection
await signalR.connect();
```

## Security Considerations

1. **JWT Authentication** - All connections require valid JWT token
2. **Token Refresh** - Handle token expiration gracefully
3. **Message Validation** - Validate incoming message format
4. **HTTPS/WSS** - Secure connection protocols only
5. **User Authorization** - Server-side conversation access control

## Future Enhancements

1. **Typing Indicators** - Show when users are typing
2. **Message Status** - Delivery and read receipts
3. **File Sharing** - Real-time file upload notifications
4. **Group Conversations** - Multi-user chat support
5. **Message Reactions** - Real-time reaction updates
6. **Voice/Video Calls** - WebRTC integration

## API Compatibility

This implementation is compatible with the Android SignalR integration documented in:

- `docs/Android_Realtime_Messaging_Integration.md`
- `docs/Android_SignalR_Realtime_Messaging_Guide.md`

Both web and mobile clients can communicate seamlessly through the same SignalR hub.
