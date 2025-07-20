namespace Services.DTOs.Review;

public class ReviewReportDto
{
    public int Id { get; set; } // For GET operations
    public int ReviewId { get; set; }
    public int HelperId { get; set; } // The helper who reports
    public string Reason { get; set; } = string.Empty;
    public DateTime ReportedAt { get; set; } // For GET operations
    // Optionally, include navigation properties for display
    public string? HelperName { get; set; }
    public string? ReviewComment { get; set; }
} 