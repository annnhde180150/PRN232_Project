using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Review;

public class ReviewUpdateDto
{
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }
    
    [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
    public string? Comment { get; set; }
}
