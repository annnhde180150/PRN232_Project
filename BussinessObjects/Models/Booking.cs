namespace BussinessObjects.Models;

public class Booking
{
    public int BookingId { get; set; }

    public int? RequestId { get; set; }

    public int UserId { get; set; }

    public int HelperId { get; set; }

    public int ServiceId { get; set; }

    public DateTime ScheduledStartTime { get; set; }

    public DateTime ScheduledEndTime { get; set; }

    public DateTime? ActualStartTime { get; set; }

    public DateTime? ActualEndTime { get; set; }

    public string Status { get; set; } = null!;

    public string? CancellationReason { get; set; }

    public string? CancelledBy { get; set; }

    public DateTime? CancellationTime { get; set; }

    public DateTime? FreeCancellationDeadline { get; set; }

    public decimal? EstimatedPrice { get; set; }

    public decimal? FinalPrice { get; set; }

    public DateTime? BookingCreationTime { get; set; }

    public virtual ICollection<Chat> Chats { get; set; } = new List<Chat>();

    public virtual Helper Helper { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ServiceRequest? Request { get; set; }

    public virtual Review? Review { get; set; }

    public virtual Service Service { get; set; } = null!;

    public virtual ICollection<SupportTicket> SupportTickets { get; set; } = new List<SupportTicket>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
    public enum AvailableStatus
    {
        Pending,
        Accepted,
        InProgress,
        Completed,
        Cancelled,
        TemporaryAccepted
    }
}