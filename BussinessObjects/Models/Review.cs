namespace BussinessObjects.Models;

public class Review
{
    public int ReviewId { get; set; }

    public int BookingId { get; set; }

    public int UserId { get; set; }

    public int HelperId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? ReviewDate { get; set; }

    public bool? IsEdited { get; set; }

    public DateTime? LastEditedDate { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Helper Helper { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}