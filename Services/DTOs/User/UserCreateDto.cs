namespace Services.DTOs.User;

public class UserCreateDto
{
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? FullName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? ExternalAuthProvider { get; set; }
    public string? ExternalAuthId { get; set; }
    public bool? IsActive { get; set; } = true;
    public int? DefaultAddressId { get; set; }
}