using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Base;

public class BaseChangePasswordWithOtpDto : BaseChangePasswordDto
{
    [Required]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be exactly 6 characters")]
    public string OtpCode { get; set; } = null!;
} 