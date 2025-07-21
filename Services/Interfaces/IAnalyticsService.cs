using Services.DTOs.Report;

namespace Services.Interfaces;

public interface IAnalyticsService
{
    // System-wide analytics (Admin)
    Task<SystemOverviewDto> GetSystemOverviewAsync();
    Task<PerformanceMetricsDto> GetPerformanceMetricsAsync();

    // User analytics (Admin)
    Task<UserAnalyticsDto> GetUserAnalyticsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<UserAnalyticsDto> GetUserActivityAnalyticsAsync(int userId, string period = "month");

    // Helper analytics (Admin & Helper)
    Task<HelperAnalyticsDto> GetHelperAnalyticsAsync(int helperId, string period = "month");
    Task<List<HelperAnalyticsDto>> GetTopPerformingHelpersAsync(int count = 10, string period = "month");

    // Booking analytics (Admin)
    Task<BookingAnalyticsDto> GetBookingAnalyticsAsync(int? serviceId = null, string period = "month");
    Task<List<ServicePopularityDto>> GetServicePopularityAnalyticsAsync(string period = "month");

    // Revenue analytics (Admin)
    Task<RevenueReportDto> GetRevenueReportAsync(string period = "month");
    Task<List<MonthlyRevenueDto>> GetMonthlyRevenueTrendAsync(int months = 12);

    // Customer-specific analytics
    Task<BookingAnalyticsDto> GetCustomerBookingAnalyticsAsync(int userId, string period = "month");
    Task<object> GetCustomerSpendingAnalyticsAsync(int userId, string period = "month");
    Task<List<HelperAnalyticsDto>> GetCustomerFavoriteHelpersAsync(int userId);

    // Helper-specific analytics
    Task<object> GetHelperPerformanceAnalyticsAsync(int helperId, string period = "month");
    Task<object> GetHelperScheduleAnalyticsAsync(int helperId, string period = "month");

    // Export functionality
    Task<byte[]> ExportSystemReportToCsvAsync(DateTime startDate, DateTime endDate);
    Task<byte[]> ExportHelperReportToCsvAsync(int helperId, DateTime startDate, DateTime endDate);
    Task<byte[]> ExportBookingReportToCsvAsync(DateTime startDate, DateTime endDate);
}