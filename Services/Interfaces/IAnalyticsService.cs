using Services.DTOs.Report;

namespace Services.Interfaces;

public interface IAnalyticsService
{
    // System-wide analytics
    Task<SystemOverviewDto> GetSystemOverviewAsync();
    Task<PerformanceMetricsDto> GetPerformanceMetricsAsync();
    
    // User analytics
    Task<UserAnalyticsDto> GetUserAnalyticsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<UserAnalyticsDto> GetUserActivityAnalyticsAsync(int userId, string period = "month");
    
    // Helper analytics
    Task<HelperAnalyticsDto> GetHelperAnalyticsAsync(int helperId, string period = "month");
    Task<List<HelperAnalyticsDto>> GetTopPerformingHelpersAsync(int count = 10, string period = "month");
    
    // Booking analytics
    Task<BookingAnalyticsDto> GetBookingAnalyticsAsync(int? serviceId = null, string period = "month");
    Task<List<ServicePopularityDto>> GetServicePopularityAnalyticsAsync(string period = "month");
    
    // Revenue analytics
    Task<RevenueReportDto> GetRevenueReportAsync(string period = "month");
    Task<List<MonthlyRevenueDto>> GetMonthlyRevenueTrendAsync(int months = 12);
    
    // Export functionality
    Task<byte[]> ExportSystemReportToCsvAsync(DateTime startDate, DateTime endDate);
    Task<byte[]> ExportHelperReportToCsvAsync(int helperId, DateTime startDate, DateTime endDate);
    Task<byte[]> ExportBookingReportToCsvAsync(DateTime startDate, DateTime endDate);
} 