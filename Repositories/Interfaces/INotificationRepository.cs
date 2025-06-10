using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface INotificationRepository : IBaseRepository<Notification>
{
    Task<Notification?> GetByIdAsync(long id);
    Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Notification>> GetByHelperIdAsync(int helperId);
    Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(int userId);
    Task<IEnumerable<Notification>> GetUnreadByHelperIdAsync(int helperId);
    Task<int> GetUnreadCountByUserIdAsync(int userId);
    Task<int> GetUnreadCountByHelperIdAsync(int helperId);
    Task MarkAsReadAsync(int notificationId);
    Task MarkAllAsReadByUserIdAsync(int userId);
    Task MarkAllAsReadByHelperIdAsync(int helperId);
}