namespace BussinessObjects.Models;

public class ReviewReport
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public int HelperId { get; set; } // The helper who reported
    public string Reason { get; set; } = string.Empty;
    public DateTime ReportedAt { get; set; } = DateTime.Now;

    public virtual Review Review { get; set; } = null!;
    public virtual Helper Helper { get; set; } = null!;
} 