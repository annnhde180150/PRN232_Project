namespace Services.DTOs.Profile;

public class ProfileStatusDto
{
    public int ProfileId { get; set; }
    public string ProfileType { get; set; } = null!; // "User" or "Helper"
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
}