using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.User;
using Services.DTOs.Chat;
using Services.Interfaces;

namespace Services.Implements;

public class UserService : IUserService
{
    private readonly ILogger<UserService> _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<UserService> logger, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _passwordHasher = passwordHasher;
    }

    public async Task<IEnumerable<UserDetailsDto>> GetAllAsync()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDetailsDto>>(users);
    }

    public async Task<UserDetailsDto> GetByIdAsync(int id, bool asNoTracking = false)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        return _mapper.Map<UserDetailsDto>(user);
    }

    public async Task<UserDetailsDto> CreateAsync(UserCreateDto dto)
    {
        _logger.LogInformation($"Creating new user with email: {dto.Email}");

        var user = _mapper.Map<User>(dto);
        user.RegistrationDate = DateTime.Now;
        user.IsActive = false;

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<UserDetailsDto>(user);
    }

    public async Task<UserDetailsDto> UpdateAsync(int id, UserUpdateDto dto)
    {
        _logger.LogInformation($"Updating user with ID: {id}");

        var existingUser = await _unitOfWork.Users.GetByIdAsync(id);
        if (existingUser == null) throw new ArgumentException($"User with ID {id} not found");

        // Map DTO to existing entity, excluding navigation properties
        _mapper.Map(dto, existingUser);

        _unitOfWork.Users.Update(existingUser);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<UserDetailsDto>(existingUser);
    }

    public async Task<UserDetailsDto?> ValidateUserCredentialsAsync(string email, string password)
    {
        var user = await _unitOfWork.Users.GetUserByEmailAsync(email);
        if (user == null) return null;

        if (!user.IsActive == true) return null;

        if (!_passwordHasher.VerifyPassword(password, user.PasswordHash!))
        {
            return null;
        }

        return _mapper.Map<UserDetailsDto>(user);
    }

    public async Task UpdateLastLoginDateAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) throw new ArgumentException($"User with ID {userId} not found");

        user.LastLoginDate = DateTime.Now;
        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        return user != null;
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation($"Deleting user with ID: {id}");
        await _unitOfWork.Users.DeleteByIdAsync(id);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        var user = await _unitOfWork.Users.GetUserByEmailAsync(email);
        return user != null;
    }

    public async Task<bool> IsEmailUniqueAsync(string email, int exceptUserId)
    {
        return await _unitOfWork.Users.IsEmailUniqueAsync(email, exceptUserId);
    }

    public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
    {
        var user = await _unitOfWork.Users.GetUserByPhoneAsync(phoneNumber);
        return user != null;
    }

    public async Task<bool> IsPhoneUniqueAsync(string phoneNumber, int exceptUserId)
    {
        return await _unitOfWork.Users.IsPhoneUniqueAsync(phoneNumber, exceptUserId);
    }

    public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        _logger.LogInformation($"Changing password for user ID: {userId}");

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning($"User with ID {userId} not found");
            return false;
        }

        // Verify current password
        if (!_passwordHasher.VerifyPassword(currentPassword, user.PasswordHash))
        {
            _logger.LogWarning($"Invalid current password for user ID: {userId}");
            return false;
        }

        // Hash new password
        var newPasswordHash = _passwordHasher.HashPassword(newPassword);
        user.PasswordHash = newPasswordHash;

        // Update user
        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation($"Password changed successfully for user ID: {userId}");
        return true;
    }

    public async Task<UserDetailsDto?> GetUserByEmailAsync(string email)
    {
        var user = await _unitOfWork.Users.GetUserByEmailAsync(email);
        if (user == null) return null;
        return _mapper.Map<UserDetailsDto>(user);
    }

    public async Task<(IEnumerable<UserSearchDto> users, int totalCount)> SearchUsersForChatAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        int? excludeUserId = null,
        int? currentUserId = null,
        int? currentHelperId = null,
        int page = 1,
        int pageSize = 20)
    {
        _logger.LogInformation($"Searching users for chat - SearchTerm: {searchTerm}, Email: {email}, IsActive: {isActive}");

        // Get users from repository
        var (users, totalCount) = await _unitOfWork.Users.SearchUsersAsync(
            searchTerm, email, isActive, excludeUserId, page, pageSize);

        // Map to search DTOs
        var userSearchDtos = new List<UserSearchDto>();

        foreach (var user in users)
        {
            var userDto = _mapper.Map<UserSearchDto>(user);

            // Check if there's an existing conversation
            if (currentUserId.HasValue || currentHelperId.HasValue)
            {
                userDto.HasExistingConversation = await _unitOfWork.Chats.HasConversationBetweenUsersAsync(
                    currentUserId, currentHelperId, user.UserId, null);

                if (userDto.HasExistingConversation)
                {
                    userDto.LastConversationDate = await _unitOfWork.Chats.GetLastConversationDateAsync(
                        currentUserId, currentHelperId, user.UserId, null);
                }
            }

            userSearchDtos.Add(userDto);
        }

        return (userSearchDtos, totalCount);
    }

    public async Task<bool> ResetPasswordAsync(string email, string newPassword)
    {
        _logger.LogInformation($"Resetting password for user with email: {email}");

        var user = await _unitOfWork.Users.GetUserByEmailAsync(email);
        if (user == null)
        {
            _logger.LogWarning($"User with email {email} not found");
            return false;
        }

        // Hash new password
        var newPasswordHash = _passwordHasher.HashPassword(newPassword);
        user.PasswordHash = newPasswordHash;

        // Update user
        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation($"Password reset successfully for user with email: {email}");
        return true;
    }
}