using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Base;

public class BaseChangePasswordDto
{
    [Required]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
    public string CurrentPassword { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "New password must be at least 6 characters long")]
    public string NewPassword { get; set; } = null!;

    [Required]
    [Compare("NewPassword", ErrorMessage = "Confirm password must match the new password")]
    public string ConfirmPassword { get; set; } = null!;
} 