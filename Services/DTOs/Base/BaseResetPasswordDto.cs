using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Base;

public class BaseResetPasswordDto
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be exactly 6 characters")]
    public string OtpCode { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "New password must be at least 6 characters long")]
    public string NewPassword { get; set; } = null!;

    [Required]
    [Compare("NewPassword", ErrorMessage = "Confirm password must match the new password")]
    public string ConfirmPassword { get; set; } = null!;
} 