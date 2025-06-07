using AutoMapper;
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

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation($"Deleting user with ID: {id}");
        await _unitOfWork.Users.DeleteByIdAsync(id);
    }
}