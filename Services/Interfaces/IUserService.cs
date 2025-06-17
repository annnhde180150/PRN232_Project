using Services.DTOs.User;

namespace Services.Interfaces;

public interface IUserService : IBaseService<UserDetailsDto, UserCreateDto, UserUpdateDto>
{
    Task<bool> IsEmailExistsAsync(string email);
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<UserDetailsDto?> ValidateUserCredentialsAsync(string email, string password);
    Task UpdateLastLoginDateAsync(int userId);
}