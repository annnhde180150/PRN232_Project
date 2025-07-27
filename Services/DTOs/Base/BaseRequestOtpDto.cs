using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Base;

public class BaseRequestOtpDto
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;
} 