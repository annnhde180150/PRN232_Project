using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Helper;

public class HelperCreateDto
{
    [Required]
    [Phone]
    public string PhoneNumber { get; set; } = null!;

    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [StringLength(200)]
    public string PasswordHash { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = null!;

    [Url]
    public string? ProfilePictureUrl { get; set; }

    [StringLength(1000)]
    public string? Bio { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    public bool? IsActive { get; set; } = false;

    public bool? IsEmailVerified { get; set; } = false;

    public List<HelperSkillCreateDto>? Skills { get; set; }
    public List<HelperWorkAreaCreateDto>? WorkAreas { get; set; }
    public List<HelperDocumentCreateDto>? Documents { get; set; }
}