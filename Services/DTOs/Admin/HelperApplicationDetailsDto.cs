using Services.DTOs.Helper;

namespace Services.DTOs.Admin;

public class HelperApplicationDetailsDto
{
    public int HelperId { get; set; }
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
    
    // Related data
    public List<HelperDocumentDto> Documents { get; set; } = new();
    public List<HelperSkillDto> Skills { get; set; } = new();
    public List<HelperWorkAreaDto> WorkAreas { get; set; } = new();
    
    // Summary information
    public int TotalDocuments { get; set; }
    public int VerifiedDocuments { get; set; }
    public int PendingDocuments { get; set; }
}
