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
}