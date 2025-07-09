using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Helper;

public class HelperRegisterDto
{
    [Required(ErrorMessage = "Phone number is required")]
    [Phone(ErrorMessage = "Invalid phone number format")]
    [StringLength(10)]
    public string PhoneNumber { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(200)]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 50 characters")]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string FullName { get; set; } = null!;

    [StringLength(1000)]
    public string? Bio { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    public List<HelperSkillCreateDto>? Skills { get; set; }
    public List<HelperWorkAreaCreateDto>? WorkAreas { get; set; }
    public List<HelperDocumentCreateDto>? Documents { get; set; }
} 