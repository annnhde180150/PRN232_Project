namespace Services.DTOs.Review;

public class ReviewCreateDto
{
    public int BookingId { get; set; }
    public int HelperId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
} 