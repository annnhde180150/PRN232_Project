using Services.DTOs.Authentication;
using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Helper;

public class HelperDetailsDto : IAppUser
{
    public int Id { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string? Email { get; set; }
    public string FullName { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public string? ApprovalStatus { get; set; }
    public int? ApprovedByAdminId { get; set; }
    public DateTime? ApprovalDate { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsEmailVerified { get; set; }
    public decimal? TotalHoursWorked { get; set; }
    public decimal? AverageRating { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public string Role => "Helper";

    public List<HelperSkillDto>? Skills { get; set; }
    public List<HelperWorkAreaDto>? WorkAreas { get; set; }
    public List<HelperDocumentDto>? Documents { get; set; }
}