namespace Services.DTOs.Report;

public class UserAnalyticsDto
{
    public int NewRegistrations { get; set; }
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
    public int TotalUsers { get; set; }
    public decimal ActivityRate { get; set; }
    public List<DailyRegistrationDto> RegistrationTrend { get; set; } = new();
    public List<UserLocationDto> UsersByLocation { get; set; } = new();
    public AgeDistributionDto AgeDistribution { get; set; } = new();
    public UserEngagementDto Engagement { get; set; } = new();
    public DateTime AnalyticsPeriodStart { get; set; }
    public DateTime AnalyticsPeriodEnd { get; set; }
}

public class DailyRegistrationDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}

public class UserLocationDto
{
    public string Location { get; set; } = string.Empty;
    public int UserCount { get; set; }
    public decimal Percentage { get; set; }
}

public class AgeDistributionDto
{
    public int Under25 { get; set; }
    public int Age25To35 { get; set; }
    public int Age36To50 { get; set; }
    public int Over50 { get; set; }
}

public class UserEngagementDto
{
    public int UsersWithBookings { get; set; }
    public decimal AverageBookingsPerUser { get; set; }
    public int UsersWithReviews { get; set; }
    public decimal AverageSessionDuration { get; set; }
    public int RetentionRate { get; set; }
} 