using Services.DTOs.Authentication;

namespace Services.DTOs.User;

public class UserDetailsDto : IAppUser
{
    public int Id { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public string? ExternalAuthProvider { get; set; }
    public string? ExternalAuthId { get; set; }
    public bool? IsActive { get; set; }
    public int? DefaultAddressId { get; set; }
    public string Role => "User";
}