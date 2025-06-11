using Services.DTOs.Notification;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Extensions;

public static class RealtimeNotificationExtensions
{
    public static async Task SendToUserAsync(
        this IRealtimeNotificationService service,
        int userId,
        NotificationDetailsDto notification)
    {
        await service.SendToUserAsync(userId.ToString(), "User", notification);
    }

    public static async Task SendToHelperAsync(
        this IRealtimeNotificationService service,
        int helperId,
        NotificationDetailsDto notification)
    {
        await service.SendToUserAsync(helperId.ToString(), "Helper", notification);
    }

    public static async Task BroadcastToUsersAsync(
        this IRealtimeNotificationService service,
        NotificationDetailsDto notification)
    {
        await service.SendToAllUsersAsync(notification);
    }

    public static async Task BroadcastToHelpersAsync(
        this IRealtimeNotificationService service,
        NotificationDetailsDto notification)
    {
        await service.SendToAllHelpersAsync(notification);
    }

    public static async Task SendToServiceTypeGroupAsync(
        this IRealtimeNotificationService service,
        string serviceType,
        NotificationDetailsDto notification)
    {
        await service.SendToGroupAsync($"ServiceType_{serviceType}", notification);
    }

    public static async Task SendToLocationGroupAsync(
        this IRealtimeNotificationService service,
        string cityOrDistrict,
        NotificationDetailsDto notification)
    {
        await service.SendToGroupAsync($"Location_{cityOrDistrict}", notification);
    }
}