# Android Real-time Messaging Integration Documentation

## Overview
This document provides the API specifications for integrating real-time messaging functionality into Android Java applications using REST APIs and SignalR WebSocket connections.

## Base Configuration
- **Base URL**: `https://your-api-domain.com/api`
- **SignalR Hub URL**: `https://your-api-domain.com/notificationHub`
- **Authentication**: Bearer Token (JWT) required for all endpoints
- **Content-Type**: `application/json`

## Authentication
All API calls require JWT authentication token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## REST API Endpoints

### 1. Send Message
**Endpoint**: `POST /api/chat/send`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "bookingId": 123,
  "receiverUserId": 456,
  "receiverHelperId": null,
  "messageContent": "Hello, how are you?"
}
```

**Request Parameters**:
- `bookingId` (integer, optional): ID of the booking if message is related to a specific booking
- `receiverUserId` (integer, optional): ID of the user receiving the message
- `receiverHelperId` (integer, optional): ID of the helper receiving the message
- `messageContent` (string, required): Message content (max 2000 characters)

**Response** (200 OK):
```json
{
  "chatId": 789,
  "bookingId": 123,
  "senderUserId": 101,
  "senderHelperId": null,
  "receiverUserId": 456,
  "receiverHelperId": null,
  "messageContent": "Hello, how are you?",
  "timestamp": "2024-01-15T10:30:00Z",
  "isReadByReceiver": false,
  "readTimestamp": null,
  "isModerated": false,
  "moderatorAdminId": null,
  "senderName": "John Doe",
  "senderProfilePicture": "https://example.com/profile.jpg",
  "senderType": "User"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data or missing required fields
- `401 Unauthorized`: Invalid or missing authentication token
- `500 Internal Server Error`: Server error

### 2. Get Conversation Messages
**Endpoint**: `GET /api/chat/conversation`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Query Parameters**:
- `bookingId` (integer, optional): Filter messages by booking ID
- `otherUserId` (integer, optional): ID of the other user in conversation
- `otherHelperId` (integer, optional): ID of the other helper in conversation

**Example URL**:
```
GET /api/chat/conversation?bookingId=123&otherUserId=456
```

**Response** (200 OK):
```json
[
  {
    "chatId": 789,
    "bookingId": 123,
    "senderUserId": 101,
    "senderHelperId": null,
    "receiverUserId": 456,
    "receiverHelperId": null,
    "messageContent": "Hello, how are you?",
    "timestamp": "2024-01-15T10:30:00Z",
    "isReadByReceiver": true,
    "readTimestamp": "2024-01-15T10:35:00Z",
    "isModerated": false,
    "moderatorAdminId": null,
    "senderName": "John Doe",
    "senderProfilePicture": "https://example.com/profile.jpg",
    "senderType": "User"
  }
]
```

### 3. Get All Conversations
**Endpoint**: `GET /api/chat/conversations`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200 OK):
```json
[
  {
    "conversationId": "user_101_helper_202",
    "bookingId": 123,
    "participantUserId": 456,
    "participantHelperId": null,
    "participantName": "Jane Smith",
    "participantProfilePicture": "https://example.com/jane.jpg",
    "participantType": "User",
    "lastMessage": {
      "chatId": 789,
      "messageContent": "Thank you for your help!",
      "timestamp": "2024-01-15T14:20:00Z",
      "senderName": "Jane Smith",
      "senderType": "User"
    },
    "unreadCount": 2,
    "lastActivity": "2024-01-15T14:20:00Z"
  }
]
```

### 4. Get Unread Messages
**Endpoint**: `GET /api/chat/unread`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200 OK):
```json
[
  {
    "chatId": 790,
    "bookingId": 124,
    "senderUserId": 456,
    "senderHelperId": null,
    "receiverUserId": 101,
    "receiverHelperId": null,
    "messageContent": "Are you available tomorrow?",
    "timestamp": "2024-01-15T15:00:00Z",
    "isReadByReceiver": false,
    "readTimestamp": null,
    "isModerated": false,
    "moderatorAdminId": null,
    "senderName": "Jane Smith",
    "senderProfilePicture": "https://example.com/jane.jpg",
    "senderType": "User"
  }
]
```

### 5. Get Unread Count
**Endpoint**: `GET /api/chat/unread-count`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (200 OK):
```json
{
  "unreadCount": 5
}
```

### 6. Mark Messages as Read
**Endpoint**: `POST /api/chat/mark-read`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "chatIds": [789, 790, 791]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "markedCount": 3
}
```

### 7. Get Booking Chat
**Endpoint**: `GET /api/chat/booking/{bookingId}`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Path Parameters**:
- `bookingId` (integer, required): ID of the booking

**Example URL**:
```
GET /api/chat/booking/123
```

**Response** (200 OK):
```json
[
  {
    "chatId": 789,
    "bookingId": 123,
    "senderUserId": 101,
    "senderHelperId": null,
    "receiverUserId": 456,
    "receiverHelperId": null,
    "messageContent": "Service completed successfully!",
    "timestamp": "2024-01-15T16:00:00Z",
    "isReadByReceiver": true,
    "readTimestamp": "2024-01-15T16:05:00Z",
    "isModerated": false,
    "moderatorAdminId": null,
    "senderName": "John Doe",
    "senderProfilePicture": "https://example.com/profile.jpg",
    "senderType": "User"
  }
]
```

## SignalR Real-time Connection

### Connection Setup
**Hub URL**: `/notificationHub`

**Authentication**: JWT token must be included in connection headers

### Connection Events

#### 1. Connection Established
**Event**: `Connected`
**Payload**: Welcome message string

#### 2. Receive Chat Message
**Event**: `ReceiveChatMessage`
**Payload**:
```json
{
  "chatId": 792,
  "bookingId": 125,
  "senderUserId": 456,
  "senderHelperId": null,
  "receiverUserId": 101,
  "receiverHelperId": null,
  "messageContent": "New message received!",
  "timestamp": "2024-01-15T17:00:00Z",
  "isReadByReceiver": false,
  "readTimestamp": null,
  "isModerated": false,
  "moderatorAdminId": null,
  "senderName": "Jane Smith",
  "senderProfilePicture": "https://example.com/jane.jpg",
  "senderType": "User"
}
```

#### 3. Receive Notification
**Event**: `ReceiveNotification`
**Payload**:
```json
{
  "title": "New Message",
  "message": "You have a new message from Jane Smith",
  "notificationType": "ChatMessage",
  "referenceId": "792"
}
```

#### 4. Connection Error
**Event**: `Error`
**Payload**: Error message string

### Hub Methods

#### 1. Join Conversation
**Method**: `JoinConversation`
**Parameters**: 
- `conversationId` (string): Unique conversation identifier

**Response Event**: `JoinedConversation`
**Response Payload**: Conversation ID string

#### 2. Leave Conversation
**Method**: `LeaveConversation`
**Parameters**:
- `conversationId` (string): Unique conversation identifier

## Error Handling

### Common HTTP Status Codes
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters or body
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Message content cannot be empty",
    "details": "Additional error details if available"
  }
}
```

## Data Models

### ChatMessageDto
```json
{
  "chatId": "number (long)",
  "bookingId": "number (optional)",
  "senderUserId": "number (optional)",
  "senderHelperId": "number (optional)", 
  "receiverUserId": "number (optional)",
  "receiverHelperId": "number (optional)",
  "messageContent": "string (required, max 2000 chars)",
  "timestamp": "string (ISO 8601 datetime)",
  "isReadByReceiver": "boolean",
  "readTimestamp": "string (ISO 8601 datetime, optional)",
  "isModerated": "boolean",
  "moderatorAdminId": "number (optional)",
  "senderName": "string",
  "senderProfilePicture": "string (URL)",
  "senderType": "string (User|Helper)"
}
```

### SendMessageDto
```json
{
  "bookingId": "number (optional)",
  "receiverUserId": "number (optional)",
  "receiverHelperId": "number (optional)",
  "messageContent": "string (required, max 2000 chars)"
}
```

### ChatConversationDto
```json
{
  "conversationId": "string",
  "bookingId": "number (optional)",
  "participantUserId": "number (optional)",
  "participantHelperId": "number (optional)",
  "participantName": "string",
  "participantProfilePicture": "string (URL)",
  "participantType": "string (User|Helper)",
  "lastMessage": "ChatMessageDto (optional)",
  "unreadCount": "number",
  "lastActivity": "string (ISO 8601 datetime)"
}
```

## Implementation Notes

1. **Authentication**: All endpoints require valid JWT token
2. **User Types**: System supports both "User" and "Helper" user types
3. **Message Recipients**: Either `receiverUserId` OR `receiverHelperId` must be provided when sending messages
4. **Real-time Updates**: Use SignalR connection for instant message delivery
5. **Offline Support**: Messages are stored in database for offline users
6. **Conversation Management**: Join specific conversations using `JoinConversation` method for targeted message delivery
7. **Error Handling**: Implement proper error handling for network failures and authentication issues
