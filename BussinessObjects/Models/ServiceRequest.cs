using System.ComponentModel.DataAnnotations.Schema;

namespace BussinessObjects.Models;

public class ServiceRequest
{
    public int RequestId { get; set; }

    public int UserId { get; set; }

    public int ServiceId { get; set; }

    public int AddressId { get; set; }

    public DateTime RequestedStartTime { get; set; }

    public decimal? RequestedDurationHours { get; set; }

    public string? SpecialNotes { get; set; }

    public string? Status { get; set; }

    public DateTime? RequestCreationTime { get; set; }

    /// Location coordinates for real-time tracking and mapping purposes
    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public int? HelperId { get; set; }
    public virtual UserAddress Address { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Service Service { get; set; } = null!;

    public virtual User User { get; set; } = null!;
    public enum AvailableStatus
    {
        Pending,
        Accepted,
        Cancelled 
    }
    public virtual Helper? Helper { get; set; }
}