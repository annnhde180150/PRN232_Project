using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Admin;

public class HelperApplicationDecisionDto
{
    [Required]
    [RegularExpression("^(approved|rejected|revision_requested)$", 
        ErrorMessage = "Status must be one of: approved, rejected, revision_requested")]
    public string Status { get; set; } = null!;
    
    [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
    public string? Comment { get; set; }
}
