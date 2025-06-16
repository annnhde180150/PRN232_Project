namespace Services.DTOs.Report;

public class PerformanceMetricsDto
{
    public decimal PlatformUtilizationRate { get; set; }
    public decimal HelperEfficiencyScore { get; set; }
    public decimal CustomerSatisfactionScore { get; set; }
    public decimal AverageResponseTime { get; set; }
    public decimal AverageCompletionTime { get; set; }
    public decimal ServiceQualityIndex { get; set; }
    public decimal RetentionRate { get; set; }
    public decimal ChurnRate { get; set; }
    public List<KpiTrendDto> KpiTrends { get; set; } = new();
    public List<RegionalPerformanceDto> RegionalMetrics { get; set; } = new();
    public OperationalHealthDto OperationalHealth { get; set; } = new();
    public DateTime LastCalculated { get; set; }
}

public class KpiTrendDto
{
    public string KpiName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal Value { get; set; }
    public decimal PreviousValue { get; set; }
    public decimal ChangePercentage { get; set; }
    public string Trend { get; set; } = string.Empty; // "Up", "Down", "Stable"
}

public class RegionalPerformanceDto
{
    public string Region { get; set; } = string.Empty;
    public int ActiveHelpers { get; set; }
    public int ActiveUsers { get; set; }
    public decimal AverageRating { get; set; }
    public decimal CompletionRate { get; set; }
    public decimal ResponseTime { get; set; }
    public decimal Revenue { get; set; }
}

public class OperationalHealthDto
{
    public int SystemUptime { get; set; }
    public int ApiResponseTime { get; set; }
    public decimal ErrorRate { get; set; }
    public int ActiveConnections { get; set; }
    public int PendingNotifications { get; set; }
    public string OverallHealth { get; set; } = string.Empty; // "Excellent", "Good", "Fair", "Poor"
} 