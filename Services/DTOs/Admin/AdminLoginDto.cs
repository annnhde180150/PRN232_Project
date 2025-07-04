using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Admin;

public class AdminLoginDto
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 50 characters")]
    public string Password { get; set; } = null!;
} 