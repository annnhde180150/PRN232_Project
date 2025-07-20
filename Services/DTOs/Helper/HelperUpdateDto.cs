using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Helper;

public class HelperUpdateDto
{
    [Phone]
    public string? PhoneNumber { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [StringLength(100)]
    public string? FullName { get; set; }

    [Url]
    public string? ProfilePictureUrl { get; set; }

    [StringLength(1000)]
    public string? Bio { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsEmailVerified { get; set; }


    public List<HelperSkillCreateDto>? Skills { get; set; }
    public List<HelperWorkAreaCreateDto>? WorkAreas { get; set; }
    public List<HelperDocumentCreateDto>? Documents { get; set; }
}