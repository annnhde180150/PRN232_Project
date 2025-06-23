using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Helper;
using Services.DTOs.User;
using Services.Interfaces;

namespace Services.Implements;

public class HelperService : IHelperService
{
    private readonly ILogger<HelperService> _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public HelperService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<HelperService> logger, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _passwordHasher = passwordHasher;
    }

    public async Task<IEnumerable<HelperDetailsDto>> GetAllAsync()
    {
        var helpers = await _unitOfWork.Helpers.GetAllAsync();
        return _mapper.Map<IEnumerable<HelperDetailsDto>>(helpers);
    }

    public async Task<HelperDetailsDto> GetByIdAsync(int id)
    {
        var helper = await _unitOfWork.Helpers.GetByIdAsync(id);
        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<HelperDetailsDto> CreateAsync(HelperCreateDto dto)
    {
        _logger.LogInformation($"Creating new helper with email: {dto.Email}");

        var helper = _mapper.Map<Helper>(dto);
        helper.RegistrationDate = DateTime.UtcNow;
        helper.ApprovalStatus = "Pending";
        helper.IsActive = false; // Helpers start as inactive until approved

        await _unitOfWork.Helpers.AddAsync(helper);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<HelperDetailsDto> UpdateAsync(int id, HelperUpdateDto dto)
    {
        _logger.LogInformation($"Updating helper with ID: {id}");

        var existingHelper = await _unitOfWork.Helpers.GetByIdAsync(id);
        if (existingHelper == null) throw new ArgumentException($"Helper with ID {id} not found");

        // Map DTO to existing entity, excluding navigation properties
        _mapper.Map(dto, existingHelper);

        _unitOfWork.Helpers.Update(existingHelper);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<HelperDetailsDto>(existingHelper);
    }
    public async Task<HelperDetailsDto?> ValidateHelperCredentialsAsync(string email, string password)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        if (helper == null) return null;

        if (!helper.IsActive == true) return null;

        if (!_passwordHasher.VerifyPassword(password, helper.PasswordHash!))
        {
            return null;
        }

        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task UpdateLastLoginDateAsync(int helperId)
    {
        var helper = await _unitOfWork.Helpers.GetByIdAsync(helperId);
        if (helper == null) throw new ArgumentException($"User with ID {helperId} not found");

        helper.LastLoginDate = DateTime.UtcNow;
        _unitOfWork.Helpers.Update(helper);
        await _unitOfWork.CompleteAsync();
    }
    public async Task<bool> ExistsAsync(int id)
    {
        var helper = await _unitOfWork.Helpers.GetByIdAsync(id);
        return helper != null;
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation($"Deleting helper with ID: {id}");
        await _unitOfWork.Helpers.DeleteByIdAsync(id);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<HelperDetailsDto?> GetHelperByEmailAsync(string email)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<HelperDetailsDto?> GetHelperByPhoneAsync(string phoneNumber)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByPhoneAsync(phoneNumber);
        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        return helper != null;
    }

    public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByPhoneAsync(phoneNumber);
        return helper != null;
    }
    public async Task<bool> SetHelperStatusOnlineAsync(int helperId)
    {
        return await _unitOfWork.Helpers.SetHelperStatusOnlineAsync(helperId);
    }
    public async Task<bool> SetHelperStatusOfflineAsync(int helperId)
    {
        return await _unitOfWork.Helpers.SetHelperStatusOfflineAsync(helperId);
    }
    public async Task<bool> SetHelperStatusBusyAsync(int helperId)
    {
        return await _unitOfWork.Helpers.SetHelperStatusBusyAsync(helperId);
    }
}