using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class BookingRepository : BaseRepository<Booking>, IBookingRepository
{
    public BookingRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId)
    {
        return await _context.Bookings
            .Where(b => b.UserId == userId)
            .Include(b => b.Helper)
            .Include(b => b.Service)
            .Include(b => b.User)
            .Include(b => b.Request)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByHelperIdAsync(int helperId)
    {
        return await _context.Bookings
            .Where(b => b.HelperId == helperId)
            .Include(b => b.Helper)
            .Include(b => b.Request)
            .Include(b => b.Service)
            .Include(b => b.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByStatusAsync(string status)
    {
        return await _context.Bookings
            .Where(b => b.Status == status)
            .Include(b => b.Helper)
            .Include(b => b.Service)
            .Include(b => b.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Bookings
            .Where(b => b.BookingCreationTime >= startDate && b.BookingCreationTime <= endDate)
            .Include(b => b.Helper)
            .Include(b => b.Service)
            .Include(b => b.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByServiceIdAsync(int serviceId)
    {
        return await _context.Bookings
            .Where(b => b.ServiceId == serviceId)
            .Include(b => b.Helper)
            .Include(b => b.Service)
            .Include(b => b.User)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Bookings
            .Where(b => b.FinalPrice.HasValue && b.Status == "Completed")
            .SumAsync(b => b.FinalPrice.Value);
    }

    public async Task<decimal> GetRevenueByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Bookings
            .Where(b => b.FinalPrice.HasValue && 
                       b.Status == "Completed" &&
                       b.BookingCreationTime >= startDate && 
                       b.BookingCreationTime <= endDate)
            .SumAsync(b => b.FinalPrice.Value);
    }

    public async Task<int> GetBookingCountByStatusAsync(string status)
    {
        return await _context.Bookings
            .CountAsync(b => b.Status == status);
    }

    public async Task<Dictionary<string, int>> GetBookingStatusBreakdownAsync()
    {
        return await _context.Bookings
            .GroupBy(b => b.Status)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }

    public async Task<Dictionary<int, int>> GetBookingCountByHourAsync()
    {
        return await _context.Bookings
            .GroupBy(b => b.ScheduledStartTime.Hour)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
} 