namespace BussinessObjects.Models;

public class SupportTicket
{
    public int TicketId { get; set; }

    public int? ReporterUserId { get; set; }

    public int? ReporterHelperId { get; set; }

    public int? BookingId { get; set; }

    public string Subject { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? Status { get; set; }

    public string? Priority { get; set; }

    public DateTime? CreationTime { get; set; }

    public DateTime? LastUpdateTime { get; set; }

    public DateTime? ResolvedTime { get; set; }

    public int? AssignedToAdminId { get; set; }

    public string? ResolutionNotes { get; set; }

    public virtual AdminUser? AssignedToAdmin { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual Helper? ReporterHelper { get; set; }

    public virtual User? ReporterUser { get; set; }
}