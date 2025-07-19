using Services.DTOs.User;

namespace Services.Interfaces;

public interface IUserService : IBaseService<UserDetailsDto, UserCreateDto, UserUpdateDto>
{
    Task<bool> IsEmailExistsAsync(string email);
    Task<bool> IsEmailUniqueAsync(string email, int exceptUserId);
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<bool> IsPhoneUniqueAsync(string phoneNumber, int exceptUserId);
    Task<UserDetailsDto?> ValidateUserCredentialsAsync(string email, string password);
    Task UpdateLastLoginDateAsync(int userId);
    Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    Task<UserDetailsDto?> GetUserByEmailAsync(string email);
}