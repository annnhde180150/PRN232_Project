using Services.DTOs.Chat;

namespace Services.Interfaces;

public interface IChatService
{
    Task<ChatMessageDto> SendMessageAsync(SendMessageDto sendMessageDto, int? currentUserId, int? currentHelperId);
    Task<IEnumerable<ChatMessageDto>> GetConversationMessagesAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId);
    Task<IEnumerable<ChatConversationDto>> GetUserConversationsAsync(int userId);
    Task<IEnumerable<ChatConversationDto>> GetHelperConversationsAsync(int helperId);
    Task<IEnumerable<ChatMessageDto>> GetUnreadMessagesAsync(int? userId, int? helperId);
    Task<int> GetUnreadCountAsync(int? userId, int? helperId);
    Task<bool> MarkMessagesAsReadAsync(MarkAsReadDto markAsReadDto, int? currentUserId, int? currentHelperId);
    Task<IEnumerable<ChatMessageDto>> GetBookingChatAsync(int bookingId);
} 