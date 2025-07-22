using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IChatRepository : IBaseRepository<Chat>
{
    Task<Chat?> GetByLongIdAsync(long chatId);
    Task<IEnumerable<Chat>> GetConversationMessagesAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId);
    Task<IEnumerable<Chat>> GetUserConversationsAsync(int userId);
    Task<IEnumerable<Chat>> GetHelperConversationsAsync(int helperId);
    Task<IEnumerable<Chat>> GetUnreadMessagesAsync(int? userId, int? helperId);
    Task<int> GetUnreadCountAsync(int? userId, int? helperId);
    Task<int> GetUnreadCountForConversationAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId);
    Task MarkMessagesAsReadAsync(List<long> chatIds, int? currentUserId, int? currentHelperId);
    Task<Chat?> GetLatestMessageBetweenUsersAsync(int? userId, int? helperId, int? otherUserId, int? otherHelperId);
    Task<IEnumerable<Chat>> GetBookingChatAsync(int bookingId);

    // Methods for search functionality
    Task<bool> HasConversationBetweenUsersAsync(int? currentUserId, int? currentHelperId, int? targetUserId, int? targetHelperId);
    Task<DateTime?> GetLastConversationDateAsync(int? currentUserId, int? currentHelperId, int? targetUserId, int? targetHelperId);
}