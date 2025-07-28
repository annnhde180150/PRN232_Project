using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class ChatRepository : BaseRepository<Chat>, IChatRepository
{
    public ChatRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
    {
    }

    public async Task<Chat?> GetByLongIdAsync(long chatId)
    {
        return await _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .Include(c => c.Booking)
            .FirstOrDefaultAsync(c => c.ChatId == chatId);
    }

    public async Task<IEnumerable<Chat>> GetConversationMessagesAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId)
    {
        var query = _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .Include(c => c.Booking)
            .AsQueryable();

        // Filter by booking if specified
        if (bookingId.HasValue)
        {
            query = query.Where(c => c.BookingId == bookingId);
        }

        // Filter for conversation between specific users/helpers
        if (userId.HasValue && otherHelperId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderUserId == userId && c.ReceiverHelperId == otherHelperId) ||
                (c.SenderHelperId == otherHelperId && c.ReceiverUserId == userId));
        }
        else if (helperId.HasValue && otherUserId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderHelperId == helperId && c.ReceiverUserId == otherUserId) ||
                (c.SenderUserId == otherUserId && c.ReceiverHelperId == helperId));
        }
        else if (userId.HasValue && otherUserId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderUserId == userId && c.ReceiverUserId == otherUserId) ||
                (c.SenderUserId == otherUserId && c.ReceiverUserId == userId));
        }
        else if (helperId.HasValue && otherHelperId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderHelperId == helperId && c.ReceiverHelperId == otherHelperId) ||
                (c.SenderHelperId == otherHelperId && c.ReceiverHelperId == helperId));
        }

        return await query
            .OrderBy(c => c.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Chat>> GetUserConversationsAsync(int userId)
    {
        return await _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .Include(c => c.Booking)
            .Where(c => c.SenderUserId == userId || c.ReceiverUserId == userId)
            .OrderByDescending(c => c.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Chat>> GetHelperConversationsAsync(int helperId)
    {
        return await _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .Include(c => c.Booking)
            .Where(c => c.SenderHelperId == helperId || c.ReceiverHelperId == helperId)
            .OrderByDescending(c => c.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Chat>> GetUnreadMessagesAsync(int? userId, int? helperId)
    {
        var query = _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .Where(c => c.IsReadByReceiver != true);

        if (userId.HasValue)
        {
            query = query.Where(c => c.ReceiverUserId == userId);
        }
        else if (helperId.HasValue)
        {
            query = query.Where(c => c.ReceiverHelperId == helperId);
        }

        return await query
            .OrderByDescending(c => c.Timestamp)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int? userId, int? helperId)
    {
        var query = _context.Chats
            .Where(c => c.IsReadByReceiver != true);

        if (userId.HasValue)
        {
            query = query.Where(c => c.ReceiverUserId == userId);
        }
        else if (helperId.HasValue)
        {
            query = query.Where(c => c.ReceiverHelperId == helperId);
        }

        return await query.CountAsync();
    }

    public async Task<int> GetUnreadCountForConversationAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId)
    {
        var query = _context.Chats
            .Where(c => c.IsReadByReceiver != true);

        // Filter by booking if specified
        if (bookingId.HasValue)
        {
            query = query.Where(c => c.BookingId == bookingId);
        }

        // Filter for specific conversation and current user as receiver
        if (userId.HasValue && otherHelperId.HasValue)
        {
            query = query.Where(c => c.ReceiverUserId == userId && c.SenderHelperId == otherHelperId);
        }
        else if (helperId.HasValue && otherUserId.HasValue)
        {
            query = query.Where(c => c.ReceiverHelperId == helperId && c.SenderUserId == otherUserId);
        }
        else if (userId.HasValue && otherUserId.HasValue)
        {
            query = query.Where(c => c.ReceiverUserId == userId && c.SenderUserId == otherUserId);
        }
        else if (helperId.HasValue && otherHelperId.HasValue)
        {
            query = query.Where(c => c.ReceiverHelperId == helperId && c.SenderHelperId == otherHelperId);
        }

        return await query.CountAsync();
    }

    public async Task MarkMessagesAsReadAsync(List<long> chatIds, int? currentUserId, int? currentHelperId)
    {
        var messages = await _context.Chats
            .Where(c => chatIds.Contains(c.ChatId))
            .ToListAsync();

        foreach (var message in messages)
        {
            // Only mark as read if current user is the receiver
            bool isReceiver = false;
            if (currentUserId.HasValue && message.ReceiverUserId == currentUserId)
            {
                isReceiver = true;
            }
            else if (currentHelperId.HasValue && message.ReceiverHelperId == currentHelperId)
            {
                isReceiver = true;
            }

            if (isReceiver && message.IsReadByReceiver != true)
            {
                message.IsReadByReceiver = true;
                message.ReadTimestamp = DateTime.Now;
            }
        }

        if (messages.Any())
        {
            _context.UpdateRange(messages);
        }
    }

    public async Task<Chat?> GetLatestMessageBetweenUsersAsync(int? userId, int? helperId, int? otherUserId, int? otherHelperId)
    {
        var query = _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .AsQueryable();

        // Filter for conversation between specific users/helpers
        if (userId.HasValue && otherHelperId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderUserId == userId && c.ReceiverHelperId == otherHelperId) ||
                (c.SenderHelperId == otherHelperId && c.ReceiverUserId == userId));
        }
        else if (helperId.HasValue && otherUserId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderHelperId == helperId && c.ReceiverUserId == otherUserId) ||
                (c.SenderUserId == otherUserId && c.ReceiverHelperId == helperId));
        }
        else if (userId.HasValue && otherUserId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderUserId == userId && c.ReceiverUserId == otherUserId) ||
                (c.SenderUserId == otherUserId && c.ReceiverUserId == userId));
        }
        else if (helperId.HasValue && otherHelperId.HasValue)
        {
            query = query.Where(c => 
                (c.SenderHelperId == helperId && c.ReceiverHelperId == otherHelperId) ||
                (c.SenderHelperId == otherHelperId && c.ReceiverHelperId == helperId));
        }

        return await query
            .OrderByDescending(c => c.Timestamp)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Chat>> GetBookingChatAsync(int bookingId)
    {
        return await _context.Chats
            .Include(c => c.SenderUser)
            .Include(c => c.SenderHelper)
            .Include(c => c.ReceiverUser)
            .Include(c => c.ReceiverHelper)
            .Include(c => c.Booking)
            .Where(c => c.BookingId == bookingId)
            .OrderBy(c => c.Timestamp)
            .ToListAsync();
    }

    public async Task<bool> HasConversationBetweenUsersAsync(int? currentUserId, int? currentHelperId, int? targetUserId, int? targetHelperId)
    {
        var query = _context.Chats.AsQueryable();

        // Filter for conversation between current user and target
        if (currentUserId.HasValue && targetHelperId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderUserId == currentUserId && c.ReceiverHelperId == targetHelperId) ||
                (c.SenderHelperId == targetHelperId && c.ReceiverUserId == currentUserId));
        }
        else if (currentHelperId.HasValue && targetUserId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderHelperId == currentHelperId && c.ReceiverUserId == targetUserId) ||
                (c.SenderUserId == targetUserId && c.ReceiverHelperId == currentHelperId));
        }
        else if (currentUserId.HasValue && targetUserId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderUserId == currentUserId && c.ReceiverUserId == targetUserId) ||
                (c.SenderUserId == targetUserId && c.ReceiverUserId == currentUserId));
        }
        else if (currentHelperId.HasValue && targetHelperId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderHelperId == currentHelperId && c.ReceiverHelperId == targetHelperId) ||
                (c.SenderHelperId == targetHelperId && c.ReceiverHelperId == currentHelperId));
        }
        else
        {
            return false;
        }

        return await query.AnyAsync();
    }

    public async Task<DateTime?> GetLastConversationDateAsync(int? currentUserId, int? currentHelperId, int? targetUserId, int? targetHelperId)
    {
        var query = _context.Chats.AsQueryable();

        // Filter for conversation between current user and target
        if (currentUserId.HasValue && targetHelperId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderUserId == currentUserId && c.ReceiverHelperId == targetHelperId) ||
                (c.SenderHelperId == targetHelperId && c.ReceiverUserId == currentUserId));
        }
        else if (currentHelperId.HasValue && targetUserId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderHelperId == currentHelperId && c.ReceiverUserId == targetUserId) ||
                (c.SenderUserId == targetUserId && c.ReceiverHelperId == currentHelperId));
        }
        else if (currentUserId.HasValue && targetUserId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderUserId == currentUserId && c.ReceiverUserId == targetUserId) ||
                (c.SenderUserId == targetUserId && c.ReceiverUserId == currentUserId));
        }
        else if (currentHelperId.HasValue && targetHelperId.HasValue)
        {
            query = query.Where(c =>
                (c.SenderHelperId == currentHelperId && c.ReceiverHelperId == targetHelperId) ||
                (c.SenderHelperId == targetHelperId && c.ReceiverHelperId == currentHelperId));
        }
        else
        {
            return null;
        }

        var latestMessage = await query
            .OrderByDescending(c => c.Timestamp)
            .FirstOrDefaultAsync();

        return latestMessage?.Timestamp;
    }
}