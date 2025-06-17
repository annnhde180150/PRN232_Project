using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.User;
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

    public async Task<UserDetailsDto> GetByIdAsync(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        return _mapper.Map<UserDetailsDto>(user);
    }

    public async Task<UserDetailsDto> CreateAsync(UserCreateDto dto)
    {
        _logger.LogInformation($"Creating new user with email: {dto.Email}");

        var user = _mapper.Map<User>(dto);
        user.RegistrationDate = DateTime.UtcNow;
        user.IsActive = true;

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

        user.LastLoginDate = DateTime.UtcNow;
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

    public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
    {
        var user = await _unitOfWork.Users.GetUserByPhoneAsync(phoneNumber);
        return user != null;
    }

 
}