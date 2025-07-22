using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Chat;

public class SearchUsersRequestDto
{
    [StringLength(100, ErrorMessage = "Search term cannot exceed 100 characters")]
    public string? SearchTerm { get; set; }
    
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }
    
    public bool? IsActive { get; set; } = true;
    
    [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
    public int PageSize { get; set; } = 20;
    
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int PageNumber { get; set; } = 1;
    
    // Search type: "users", "helpers", or "all"
    [Required]
    public string SearchType { get; set; } = "all";
    
    // For helpers only - filter by availability status
    public string? AvailabilityStatus { get; set; }
    
    // For helpers only - filter by minimum rating
    [Range(0, 5, ErrorMessage = "Minimum rating must be between 0 and 5")]
    public decimal? MinimumRating { get; set; }
}
