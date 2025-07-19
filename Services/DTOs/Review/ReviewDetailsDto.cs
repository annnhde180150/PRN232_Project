namespace Services.DTOs.Review;

public class ReviewDetailsDto
{
    public int ReviewId { get; set; }
    public int BookingId { get; set; }
    public int HelperId { get; set; }
    public int UserId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime? ReviewDate { get; set; }
} 