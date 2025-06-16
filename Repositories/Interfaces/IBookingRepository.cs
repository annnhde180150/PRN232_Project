using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IBookingRepository : IBaseRepository<Booking>
{
    Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId);
    Task<IEnumerable<Booking>> GetBookingsByHelperIdAsync(int helperId);
    Task<IEnumerable<Booking>> GetBookingsByStatusAsync(string status);
    Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Booking>> GetBookingsByServiceIdAsync(int serviceId);
    Task<decimal> GetTotalRevenueAsync();
    Task<decimal> GetRevenueByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<int> GetBookingCountByStatusAsync(string status);
    Task<Dictionary<string, int>> GetBookingStatusBreakdownAsync();
    Task<Dictionary<int, int>> GetBookingCountByHourAsync();
} 