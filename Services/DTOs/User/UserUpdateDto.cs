using Services.DTOs.UserAddress;

namespace Services.DTOs.User;

public class UserUpdateDto
{
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public bool? IsActive { get; set; }
    public int? DefaultAddressId { get; set; }
    public UserAddressUpdateDto? DefaultAddress { get; set; }
}