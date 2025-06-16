namespace Services.DTOs.Report;

public class BookingAnalyticsDto
{
    public int TotalBookings { get; set; }
    public int PendingBookings { get; set; }
    public int ConfirmedBookings { get; set; }
    public int InProgressBookings { get; set; }
    public int CompletedBookings { get; set; }
    public int CancelledBookings { get; set; }
    public decimal AverageBookingValue { get; set; }
    public decimal TotalBookingValue { get; set; }
    public decimal CompletionRate { get; set; }
    public decimal CancellationRate { get; set; }
    public List<DailyBookingDto> BookingTrend { get; set; } = new();
    public List<ServicePopularityDto> PopularServices { get; set; } = new();
    public List<PeakHourDto> PeakHours { get; set; } = new();
    public List<BookingStatusDto> StatusBreakdown { get; set; } = new();
    public DateTime AnalyticsPeriodStart { get; set; }
    public DateTime AnalyticsPeriodEnd { get; set; }
}

public class ServicePopularityDto
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int BookingsCount { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageRating { get; set; }
    public decimal MarketShare { get; set; }
}

public class PeakHourDto
{
    public int Hour { get; set; }
    public string TimeRange { get; set; } = string.Empty;
    public int BookingsCount { get; set; }
    public decimal Percentage { get; set; }
}

public class BookingStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
    public decimal TotalValue { get; set; }
} 