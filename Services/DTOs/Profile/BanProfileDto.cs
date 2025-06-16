using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Profile;

public class BanProfileDto
{
    [Required]
    public int ProfileId { get; set; }
    
    [Required]
    [StringLength(20)]
    public string ProfileType { get; set; } = null!; // "User" or "Helper"
    
    [StringLength(500)]
    public string? Reason { get; set; }
    
    [Required]
    public int AdminId { get; set; }
}