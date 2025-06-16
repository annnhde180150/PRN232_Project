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

    public UserService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<UserService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
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
}