using Services.DTOs.User;
using Services.DTOs.Chat;

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
    Task<bool> ResetPasswordAsync(string email, string newPassword);
    Task<UserDetailsDto?> GetUserByEmailAsync(string email);

    // Search methods for chat functionality
    Task<(IEnumerable<UserSearchDto> users, int totalCount)> SearchUsersForChatAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        int? excludeUserId = null,
        int? currentUserId = null,
        int? currentHelperId = null,
        int page = 1,
        int pageSize = 20);
}