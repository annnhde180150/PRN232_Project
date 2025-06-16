namespace Services.DTOs.Report;

public class RevenueReportDto
{
    public decimal TotalRevenue { get; set; }
    public decimal NetRevenue { get; set; }
    public decimal PlatformFees { get; set; }
    public decimal HelperEarnings { get; set; }
    public decimal AverageTransactionValue { get; set; }
    public int TotalTransactions { get; set; }
    public int SuccessfulPayments { get; set; }
    public int FailedPayments { get; set; }
    public decimal PaymentSuccessRate { get; set; }
    public List<MonthlyRevenueDto> MonthlyTrend { get; set; } = new();
    public List<PaymentMethodDto> PaymentMethods { get; set; } = new();
    public List<ServiceRevenueDto> RevenueByService { get; set; } = new();
    public DateTime AnalyticsPeriodStart { get; set; }
    public DateTime AnalyticsPeriodEnd { get; set; }
}

public class MonthlyRevenueDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public decimal PlatformFees { get; set; }
    public decimal HelperEarnings { get; set; }
    public int TransactionCount { get; set; }
    public decimal GrowthRate { get; set; }
}

public class PaymentMethodDto
{
    public string Method { get; set; } = string.Empty;
    public int TransactionCount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Percentage { get; set; }
    public decimal SuccessRate { get; set; }
}

public class ServiceRevenueDto
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int BookingsCount { get; set; }
    public decimal AveragePrice { get; set; }
    public decimal MarketShare { get; set; }
} 