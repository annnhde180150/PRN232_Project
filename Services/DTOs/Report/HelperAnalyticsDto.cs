namespace Services.DTOs.Report;

public class HelperAnalyticsDto
{
    public int HelperId { get; set; }
    public string HelperName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TotalBookings { get; set; }
    public int CompletedBookings { get; set; }
    public int CancelledBookings { get; set; }
    public decimal CompletionRate { get; set; }
    public decimal AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public decimal TotalEarnings { get; set; }
    public decimal AverageBookingValue { get; set; }
    public decimal AverageResponseTime { get; set; }
    public decimal TotalHoursWorked { get; set; }
    public List<MonthlyEarningsDto> EarningsTrend { get; set; } = new();
    public List<ServicePerformanceDto> ServiceBreakdown { get; set; } = new();
    public List<DailyBookingDto> BookingTrend { get; set; } = new();
    public DateTime AnalyticsPeriodStart { get; set; }
    public DateTime AnalyticsPeriodEnd { get; set; }
}

public class MonthlyEarningsDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Earnings { get; set; }
    public int BookingsCount { get; set; }
}

public class ServicePerformanceDto
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int BookingsCount { get; set; }
    public decimal TotalEarnings { get; set; }
    public decimal AverageRating { get; set; }
    public decimal CompletionRate { get; set; }
}

public class DailyBookingDto
{
    public DateTime Date { get; set; }
    public int BookingsCount { get; set; }
    public decimal EarningsAmount { get; set; }
} 