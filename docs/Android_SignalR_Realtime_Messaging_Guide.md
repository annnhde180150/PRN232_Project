# Android SignalR Real-time Messaging Integration Guide

## Overview
This document provides detailed specifications for integrating SignalR real-time messaging functionality into Android Java applications. This guide assumes you have already integrated the REST API endpoints for basic messaging operations.

## Prerequisites
- REST API integration completed
- Valid JWT authentication token
- SignalR client library for Android

## SignalR Hub Configuration

### Hub Connection Details
- **Hub URL**: `https://your-api-domain.com/notificationHub`
- **Protocol**: WebSocket with fallback to Server-Sent Events
- **Authentication**: JWT Bearer Token required
- **Connection Type**: Persistent connection

### Authentication Setup
SignalR connection requires JWT token in the connection headers:

**Connection Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Connection Query Parameters** (Alternative):
```
access_token=<your-jwt-token>
```

## Connection Lifecycle Management

### 1. Establishing Connection

**Connection URL**: `/notificationHub`

**Connection Process**:
1. Include JWT token in connection headers or query parameters
2. Establish WebSocket connection
3. Wait for `Connected` event
4. Handle authentication errors if token is invalid

**Expected Flow**:
```
Client -> Connect to /notificationHub with JWT
Server -> Validates JWT token
Server -> Adds user to appropriate groups (Users/Helpers)
Server -> Sends "Connected" event with welcome message
```

### 2. Connection Events

#### Connected Event
**Event Name**: `Connected`
**Trigger**: When connection is successfully established
**Payload Type**: String
**Example Payload**: `"Welcome User 123"` or `"Welcome Helper 456"`

#### Connection Error Event
**Event Name**: `Error`
**Trigger**: When connection fails or authentication error occurs
**Payload Type**: String
**Example Payloads**:
- `"Authentication required"`
- `"Connection failed"`
- `"Invalid token"`

### 3. Connection Termination

**Automatic Disconnection Scenarios**:
- JWT token expires
- Network connectivity lost
- Server maintenance
- Client application closed

**Manual Disconnection**:
- Call disconnect method when user logs out
- Clean up event listeners

## Real-time Message Handling

### 1. Receiving Chat Messages

#### ReceiveChatMessage Event
**Event Name**: `ReceiveChatMessage`
**Trigger**: When a new message is sent to the current user
**Payload Type**: ChatMessageDto JSON object

**Payload Structure**:
```json
{
  "chatId": 792,
  "bookingId": 125,
  "senderUserId": 456,
  "senderHelperId": null,
  "receiverUserId": 101,
  "receiverHelperId": null,
  "messageContent": "Hello! Are you available for the service?",
  "timestamp": "2024-01-15T17:00:00Z",
  "isReadByReceiver": false,
  "readTimestamp": null,
  "isModerated": false,
  "moderatorAdminId": null,
  "senderName": "Jane Smith",
  "senderProfilePicture": "https://example.com/profiles/jane.jpg",
  "senderType": "User"
}
```

**Handling Logic**:
1. Parse the incoming ChatMessageDto
2. Update local message list/database
3. Update conversation list with new message
4. Show notification to user
5. Update unread message count
6. Refresh UI if conversation is currently open

### 2. Receiving Notifications

#### ReceiveNotification Event
**Event Name**: `ReceiveNotification`
**Trigger**: When a notification is sent to the current user
**Payload Type**: NotificationDetailsDto JSON object

**Payload Structure**:
```json
{
  "title": "New Message",
  "message": "You have a new message from Jane Smith",
  "notificationType": "ChatMessage",
  "referenceId": "792",
  "timestamp": "2024-01-15T17:00:00Z"
}
```

**Notification Types**:
- `"ChatMessage"`: New chat message received
- `"BookingUpdate"`: Booking status changed
- `"ServiceRequest"`: New service request
- `"SystemAlert"`: System-wide notifications

## Conversation Management

### 1. Joining Conversations

#### JoinConversation Method
**Method Name**: `JoinConversation`
**Purpose**: Join a specific conversation room for targeted message delivery
**Parameters**: 
- `conversationId` (String): Unique conversation identifier

**Conversation ID Format**:
- get from api conversation

**Method Call Example**:
```
hubConnection.invoke("JoinConversation", "user_123_helper_456")
```

**Response Event**: `JoinedConversation`
**Response Payload**: Conversation ID string
**Example Response**: `"user_123_helper_456"`

### 2. Leaving Conversations

#### LeaveConversation Method
**Method Name**: `LeaveConversation`
**Purpose**: Leave a specific conversation room
**Parameters**:
- `conversationId` (String): Conversation identifier to leave

**Method Call Example**:
```
hubConnection.invoke("LeaveConversation", "user_123_helper_456")
```

**Response Event**: `LeftConversation`
**Response Payload**: Conversation ID string

### 3. Conversation-based Message Delivery

When joined to a conversation, messages sent to that conversation will be delivered via:
**Event Name**: `ReceiveChatMessage`
**Delivery Method**: Group-based delivery to all participants in the conversation

## User Status Management

### 1. Online Status Tracking

**Automatic Status Updates**:
- User comes online: Automatically tracked when connection established
- User goes offline: Automatically tracked when connection lost

### 2. User Status Events

#### UserStatusChanged Event
**Event Name**: `UserStatusChanged`
**Trigger**: When a user's online status changes
**Payload Structure**:
```json
{
  "userId": "123",
  "userType": "User",
  "isOnline": true,
  "timestamp": "2024-01-15T17:00:00Z"
}
```

## Error Handling and Reconnection

### 1. Connection Errors

**Common Error Scenarios**:
- Invalid JWT token
- Token expiration
- Network connectivity issues
- Server unavailability

**Error Event Handling**:
```json
{
  "event": "Error",
  "message": "Authentication required",
  "code": "AUTH_FAILED"
}
```

### 2. Automatic Reconnection

**Reconnection Strategy**:
1. Detect connection loss
2. Wait for network availability
3. Refresh JWT token if expired
4. Attempt reconnection with exponential backoff
5. Re-join previously joined conversations
6. Sync missed messages via REST API

**Reconnection Parameters**:
- Initial delay: 1 second
- Maximum delay: 30 seconds
- Maximum attempts: 10
- Backoff multiplier: 2

### 3. Message Synchronization

**On Reconnection**:
1. Call REST API to get missed messages
2. Update local message store
3. Reconcile with any messages received via SignalR
4. Update UI with synchronized data

## Implementation Flow

### 1. Application Startup
```
1. Initialize SignalR client
2. Configure connection with JWT token
3. Set up event listeners
4. Establish connection
5. Wait for Connected event
6. Join relevant conversations
```

### 2. Message Sending Flow
```
1. Send message via REST API
2. Wait for API response
3. Update local UI optimistically
4. Receive confirmation via SignalR (ReceiveChatMessage)
5. Update message status to confirmed
```

### 3. Message Receiving Flow
```
1. Receive ReceiveChatMessage event
2. Parse message data
3. Update local message store
4. Show notification if app in background
5. Update conversation list
6. Refresh UI if conversation is open
7. Send read receipt if message is viewed
```

### 4. Conversation Management Flow
```
1. User opens conversation
2. Call JoinConversation with conversation ID
3. Wait for JoinedConversation confirmation
4. Load message history via REST API
5. Listen for real-time messages
6. On conversation close, call LeaveConversation
```

## Security Considerations

### 1. Token Management
- Refresh JWT token before expiration
- Handle token refresh during active SignalR connection
- Secure token storage on device

### 2. Message Validation
- Validate incoming message format
- Sanitize message content before display
- Verify sender identity matches token claims

### 3. Connection Security
- Use HTTPS/WSS for all connections
- Validate server certificates
- Implement connection timeout limits

## Performance Optimization

### 1. Connection Management
- Maintain single SignalR connection per app instance
- Reuse connection across different screens
- Properly dispose connection on app termination

### 2. Message Handling
- Batch message updates for UI performance
- Implement message pagination for large conversations
- Cache frequently accessed conversations

### 3. Network Efficiency
- Only join conversations that are actively viewed
- Leave conversations when not needed
- Implement message compression if supported

