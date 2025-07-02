using Services.DTOs.Notification;

namespace Services.Interfaces;

public interface
    INotificationService : IBaseService<NotificationDetailsDto, NotificationCreateDto, NotificationUpdateDto>
{
    // Methods bổ sung specific cho Notification
    Task<IEnumerable<NotificationDetailsDto>> GetByUserIdAsync(int userId);
    Task<IEnumerable<NotificationDetailsDto>> GetByHelperIdAsync(int helperId);
    Task<IEnumerable<NotificationDetailsDto>> GetUnreadByUserIdAsync(int userId);
    Task<IEnumerable<NotificationDetailsDto>> GetUnreadByHelperIdAsync(int helperId);
    Task<int> GetUnreadCountByUserIdAsync(int userId);
    Task<int> GetUnreadCountByHelperIdAsync(int helperId);

    // Methods specific cho notification operations
    Task<bool> MarkAsReadAsync(int id);
    Task MarkAllAsReadByUserIdAsync(int userId);
    Task MarkAllAsReadByHelperIdAsync(int helperId);

    // Method to create notification without sending real-time notification
    Task<NotificationDetailsDto> CreateWithoutRealtimeAsync(NotificationCreateDto createDto);
}