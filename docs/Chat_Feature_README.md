# Chat Feature Implementation

## Overview

The chat feature has been successfully implemented for the HomeHelperFinder project, providing real-time messaging capabilities between Users and Helpers. The implementation integrates seamlessly with the existing SignalR infrastructure and follows the established architectural patterns.

## Architecture Components

### 1. Database Layer

#### Chat Entity
- **File**: `BussinessObjects/Models/Chat.cs`
- **Primary Key**: `ChatId` (long/bigint)
- **Features**:
  - Support for User-to-Helper, User-to-User, and Helper-to-Helper conversations
  - Booking-specific conversations (optional `BookingId`)
  - Read status tracking with timestamps
  - Moderation support for admin oversight

#### Key Properties
```csharp
public class Chat
{
    public long ChatId { get; set; }
    public int? BookingId { get; set; }           // Optional: Chat related to specific booking
    public int? SenderUserId { get; set; }        // User sending message
    public int? SenderHelperId { get; set; }      // Helper sending message
    public int? ReceiverUserId { get; set; }      // User receiving message
    public int? ReceiverHelperId { get; set; }    // Helper receiving message
    public string MessageContent { get; set; }   // Message text
    public DateTime? Timestamp { get; set; }     // Message timestamp
    public bool? IsReadByReceiver { get; set; }  // Read status
    public DateTime? ReadTimestamp { get; set; } // When message was read
    public bool? IsModerated { get; set; }       // Admin moderation flag
    public int? ModeratorAdminId { get; set; }   // Admin who moderated
}
```

### 2. Repository Layer

#### Chat Repository
- **Interface**: `Repositories/Interfaces/IChatRepository.cs`
- **Implementation**: `Repositories/Implements/ChatRepository.cs`

#### Key Methods
```csharp
// Get conversation messages between specific participants
Task<IEnumerable<Chat>> GetConversationMessagesAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId);

// Get all conversations for a user/helper
Task<IEnumerable<Chat>> GetUserConversationsAsync(int userId);
Task<IEnumerable<Chat>> GetHelperConversationsAsync(int helperId);

// Unread message management
Task<IEnumerable<Chat>> GetUnreadMessagesAsync(int? userId, int? helperId);
Task<int> GetUnreadCountAsync(int? userId, int? helperId);

// Mark messages as read
Task MarkMessagesAsReadAsync(List<long> chatIds, int? currentUserId, int? currentHelperId);

// Booking-specific chat
Task<IEnumerable<Chat>> GetBookingChatAsync(int bookingId);
```

### 3. Service Layer

#### Data Transfer Objects (DTOs)
- **Location**: `Services/DTOs/Chat/`

##### ChatMessageDto
```csharp
public class ChatMessageDto
{
    public long ChatId { get; set; }
    public string MessageContent { get; set; }
    public DateTime? Timestamp { get; set; }
    public bool? IsReadByReceiver { get; set; }
    public string? SenderName { get; set; }
    public string? SenderProfilePicture { get; set; }
    public string? SenderType { get; set; } // "User" or "Helper"
    // ... other properties
}
```

##### SendMessageDto
```csharp
public class SendMessageDto
{
    public int? BookingId { get; set; }
    public int? ReceiverUserId { get; set; }
    public int? ReceiverHelperId { get; set; }
    
    [Required]
    [StringLength(2000)]
    public string MessageContent { get; set; }
}
```

##### ChatConversationDto
```csharp
public class ChatConversationDto
{
    public string ConversationId { get; set; }
    public string? ParticipantName { get; set; }
    public string? ParticipantType { get; set; }
    public ChatMessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public DateTime? LastActivity { get; set; }
    // ... other properties
}
```

#### Chat Service
- **Interface**: `Services/Interfaces/IChatService.cs`
- **Implementation**: `Services/Implements/ChatService.cs`

#### Key Features
- Real-time message delivery via SignalR
- Automatic conversation grouping
- Unread message tracking
- Booking-specific chat support
- Comprehensive error handling and logging

### 4. API Layer

#### Chat Controller
- **File**: `HomeHelperFinderAPI/Controllers/ChatController.cs`
- **Authorization**: Required (`[Authorize]` attribute)
- **Base Route**: `/api/chat`

#### API Endpoints

##### Send Message
```http
POST /api/chat/send
Content-Type: application/json

{
    "receiverUserId": 123,          // OR receiverHelperId
    "receiverHelperId": null,
    "bookingId": 456,               // Optional
    "messageContent": "Hello there!"
}
```

##### Get Conversation Messages
```http
GET /api/chat/conversation?otherUserId=123&bookingId=456
```

##### Get All Conversations
```http
GET /api/chat/conversations
```

##### Get Unread Messages
```http
GET /api/chat/unread
```

##### Get Unread Count
```http
GET /api/chat/unread/count
```

##### Mark Messages as Read
```http
POST /api/chat/mark-as-read
Content-Type: application/json

{
    "chatIds": [1, 2, 3, 4, 5]
}
```

##### Get Booking Chat
```http
GET /api/chat/booking/123
```

### 5. Real-time Features (SignalR)

#### SignalR Hub Updates
- **File**: `HomeHelperFinderAPI/Hubs/NotificationHub.cs`
- **New Methods**:
  - `SendChatMessage`: Send chat messages to specific users
  - `NotifyMessageRead`: Notify about read status changes
  - `JoinConversation`: Join conversation groups
  - `LeaveConversation`: Leave conversation groups

#### Client Events

##### Receiving Messages
```javascript
connection.on("ReceiveChatMessage", (message) => {
    console.log("New chat message:", message);
    // Update UI with new message
});
```

##### Message Read Status
```javascript
connection.on("MessagesMarkedAsRead", (chatIds) => {
    console.log("Messages marked as read:", chatIds);
    // Update UI to show read status
});
```

##### Conversation Management
```javascript
// Join a conversation room
await connection.invoke("JoinConversation", conversationId);

// Leave a conversation room
await connection.invoke("LeaveConversation", conversationId);
```

#### SignalR Service Updates
- **File**: `HomeHelperFinderAPI/Services/SignalRNotificationService.cs`
- **New Methods**:
  - `SendChatMessageAsync`: Send chat messages via SignalR
  - `SendReadStatusAsync`: Send read status updates
  - `SendToConversationAsync`: Send messages to conversation groups

## Usage Examples

### Sending a Message (C# Client)
```csharp
var sendMessageDto = new SendMessageDto
{
    ReceiverHelperId = 123,
    BookingId = 456,
    MessageContent = "Hello, I need help with my booking."
};

var response = await httpClient.PostAsJsonAsync("/api/chat/send", sendMessageDto);
var message = await response.Content.ReadFromJsonAsync<ChatMessageDto>();
```

### Getting Conversations (C# Client)
```csharp
var response = await httpClient.GetAsync("/api/chat/conversations");
var conversations = await response.Content.ReadFromJsonAsync<List<ChatConversationDto>>();

foreach (var conversation in conversations)
{
    Console.WriteLine($"Chat with {conversation.ParticipantName}: {conversation.UnreadCount} unread");
}
```

### Real-time Chat Implementation (JavaScript)
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/notificationHub", {
        accessTokenFactory: () => yourJWTToken
    })
    .build();

// Handle incoming messages
connection.on("ReceiveChatMessage", (message) => {
    addMessageToUI(message);
    
    // Auto-mark as read if conversation is open
    if (isConversationOpen(message.conversationId)) {
        markAsRead([message.chatId]);
    }
});

// Handle read status updates
connection.on("MessagesMarkedAsRead", (chatIds) => {
    updateReadStatus(chatIds);
});

// Start connection
await connection.start();
```

## Configuration

### Dependency Injection (Program.cs)
```csharp
// Repository
builder.Services.AddScoped<IChatRepository, ChatRepository>();

// Service
builder.Services.AddScoped<IChatService, ChatService>();

// AutoMapper Profile
builder.Services.AddAutoMapper(typeof(ChatProfile));
```

### AutoMapper Configuration
- **File**: `Services/Mappers/ChatProfile.cs`
- **Mappings**:
  - `Chat` → `ChatMessageDto` (with sender information)
  - `SendMessageDto` → `Chat` (for creating messages)

## Security Considerations

### Authentication & Authorization
- All chat endpoints require authentication
- Users can only send/receive messages to/from authorized participants
- Messages are only marked as read by the actual receiver
- Booking-specific chats are validated against user permissions

### Data Validation
- Message content is limited to 2000 characters
- Required fields are validated using data annotations
- Input sanitization is handled by the framework

### Moderation Support
- Admin users can moderate messages
- Moderated messages are flagged in the database
- Moderation tracking with admin ID and timestamps

## Performance Considerations

### Database Optimization
- Proper indexing on foreign keys and frequently queried fields
- Efficient LINQ queries with proper includes
- Pagination support for large conversation histories

### SignalR Efficiency
- Connection grouping for targeted message delivery
- Efficient unread count calculations
- Minimal data transfer in real-time updates

### Caching Opportunities
- Conversation lists can be cached
- Unread counts can be cached with cache invalidation
- User/Helper profile information caching

## Testing

### Unit Testing Recommendations
```csharp
[Test]
public async Task SendMessage_ValidInput_ReturnsMessage()
{
    // Arrange
    var sendDto = new SendMessageDto { /* test data */ };
    
    // Act
    var result = await chatService.SendMessageAsync(sendDto, userId: 1, helperId: null);
    
    // Assert
    Assert.IsNotNull(result);
    Assert.AreEqual(sendDto.MessageContent, result.MessageContent);
}
```

### Integration Testing
- Test full message flow from API to SignalR delivery
- Test conversation grouping logic
- Test read status synchronization

### SignalR Testing
- Use SignalR test client for hub method testing
- Test connection management and group assignments
- Verify real-time message delivery

## Troubleshooting

### Common Issues

1. **Messages not delivering in real-time**
   - Check SignalR connection status
   - Verify user authentication in hub
   - Check connection manager for active connections

2. **Read status not updating**
   - Ensure correct chatIds are being sent
   - Verify user permissions to mark messages as read
   - Check SignalR read status events

3. **Conversation grouping issues**
   - Verify conversation key generation logic
   - Check participant identification in BuildConversationsFromMessages

### Logging
- Comprehensive logging at service level
- SignalR connection and message delivery logging
- Error logging with proper exception handling

## Future Enhancements

### Potential Features
1. **File Attachments**: Support for images and documents
2. **Message Reactions**: Like/dislike functionality
3. **Message Editing**: Allow editing of sent messages
4. **Message Deletion**: Soft delete with admin oversight
5. **Typing Indicators**: Real-time typing status
6. **Push Notifications**: Mobile push notifications for offline users
7. **Message Search**: Full-text search across conversations
8. **Voice Messages**: Audio message support
9. **Chat Backup**: Export conversation history
10. **Advanced Moderation**: Automated content filtering

### Scalability Improvements
1. **Redis Backplane**: For multi-server SignalR deployment
2. **Message Pagination**: Implement cursor-based pagination
3. **Connection Pooling**: Optimize database connections
4. **Message Archiving**: Move old messages to archive storage
5. **CDN Integration**: For file attachments and media

## API Documentation

Complete API documentation is available through Swagger UI at `/swagger` when running in development mode.

## Support

For technical support or questions about the chat feature implementation, refer to:
- Project documentation in the repository
- SignalR_README.md for real-time communication details
- Existing notification patterns for integration examples 