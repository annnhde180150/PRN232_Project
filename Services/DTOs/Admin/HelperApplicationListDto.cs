namespace Services.DTOs.Admin;

public class HelperApplicationListDto
{
    public int HelperId { get; set; }
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public DateTime? RegistrationDate { get; set; }
    public string? ApprovalStatus { get; set; }
    public int DocumentCount { get; set; }
    public int SkillCount { get; set; }
    public int WorkAreaCount { get; set; }
    public string? PrimaryService { get; set; }
}
