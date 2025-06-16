namespace Services.DTOs.Report;

public class SystemOverviewDto
{
    public int TotalUsers { get; set; }
    public int TotalHelpers { get; set; }
    public int TotalBookings { get; set; }
    public int ActiveBookings { get; set; }
    public int CompletedBookings { get; set; }
    public int CancelledBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageRating { get; set; }
    public int TotalServices { get; set; }
    public int TotalReviews { get; set; }
    public DateTime LastUpdated { get; set; }
    public GrowthMetricsDto GrowthMetrics { get; set; } = new();
}

public class GrowthMetricsDto
{
    public decimal UserGrowthRate { get; set; }
    public decimal HelperGrowthRate { get; set; }
    public decimal BookingGrowthRate { get; set; }
    public decimal RevenueGrowthRate { get; set; }
    public string GrowthPeriod { get; set; } = "Month";
} 