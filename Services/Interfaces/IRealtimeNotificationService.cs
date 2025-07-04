using Services.DTOs.Notification;

namespace Services.Interfaces;

public interface IRealtimeNotificationService
{
    Task SendToUserAsync(string userId, string userType, NotificationDetailsDto notification);

    Task SendToGroupAsync(string groupName, NotificationDetailsDto notification);

    Task SendToAllUsersAsync(NotificationDetailsDto notification);

    Task SendToAllHelpersAsync(NotificationDetailsDto notification);

    Task NotifyUserStatusAsync(string userId, string userType, bool isOnline);

    Task<bool> IsUserOnlineAsync(string userId);

    // Chat-specific methods
    Task SendChatMessageAsync(string userId, string userType, object message);

    Task SendReadStatusAsync(string userId, string userType, object readStatus);

    Task SendToConversationAsync(string conversationId, object message);
}