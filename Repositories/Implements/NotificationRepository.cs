using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class NotificationRepository(Prn232HomeHelperFinderSystemContext context)
    : BaseRepository<Notification>(context), INotificationRepository
{
    public async Task<Notification?> GetByIdAsync(long id)
    {
        return await _context.Notifications.FindAsync(id);
    }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId)
    {
        return await _context.Notifications
            .Where(n => n.RecipientUserId == userId)
            .OrderByDescending(n => n.CreationTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetByHelperIdAsync(int helperId)
    {
        return await _context.Notifications
            .Where(n => n.RecipientHelperId == helperId)
            .OrderByDescending(n => n.CreationTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(int userId)
    {
        return await _context.Notifications
            .Where(n => n.RecipientUserId == userId && n.IsRead != true)
            .OrderByDescending(n => n.CreationTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadByHelperIdAsync(int helperId)
    {
        return await _context.Notifications
            .Where(n => n.RecipientHelperId == helperId && n.IsRead != true)
            .OrderByDescending(n => n.CreationTime)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountByUserIdAsync(int userId)
    {
        return await _context.Notifications
            .CountAsync(n => n.RecipientUserId == userId && n.IsRead != true);
    }

    public async Task<int> GetUnreadCountByHelperIdAsync(int helperId)
    {
        return await _context.Notifications
            .CountAsync(n => n.RecipientHelperId == helperId && n.IsRead != true);
    }

    public async Task MarkAsReadAsync(int notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            notification.IsRead = true;
            notification.ReadTime = DateTime.Now;
            _context.Entry(notification).State = EntityState.Modified;
        }
    }

    public async Task MarkAllAsReadByUserIdAsync(int userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.RecipientUserId == userId && n.IsRead != true)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadTime = DateTime.Now;
        }

        if (notifications.Any()) _context.UpdateRange(notifications);
    }

    public async Task MarkAllAsReadByHelperIdAsync(int helperId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.RecipientHelperId == helperId && n.IsRead != true)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadTime = DateTime.Now;
        }

        if (notifications.Any()) _context.UpdateRange(notifications);
    }
}