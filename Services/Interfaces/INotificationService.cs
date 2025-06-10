using Services.DTOs.Notification;

namespace Services.Interfaces;

public interface INotificationService : IBaseService<NotificationDetailsDto>
{
    // Methods bổ sung specific cho Notification
    Task<IEnumerable<NotificationDetailsDto>> GetByUserIdAsync(int userId);
    Task<IEnumerable<NotificationDetailsDto>> GetByHelperIdAsync(int helperId);
    Task<IEnumerable<NotificationDetailsDto>> GetUnreadByUserIdAsync(int userId);
    Task<IEnumerable<NotificationDetailsDto>> GetUnreadByHelperIdAsync(int helperId);
    Task<int> GetUnreadCountByUserIdAsync(int userId);
    Task<int> GetUnreadCountByHelperIdAsync(int helperId);
    
    // Override methods để sử dụng long type cho NotificationId
    Task<NotificationDetailsDto> GetByIdAsync(long id);
    Task<NotificationDetailsDto> CreateAsync(NotificationCreateDto createDto);
    Task<NotificationDetailsDto> UpdateAsync(long id, NotificationUpdateDto updateDto);
    Task<bool> ExistsAsync(long id);
    Task DeleteAsync(long id);
    
    // Methods specific cho notification operations
    Task<bool> MarkAsReadAsync(long id);
    Task MarkAllAsReadByUserIdAsync(int userId);
    Task MarkAllAsReadByHelperIdAsync(int helperId);
}