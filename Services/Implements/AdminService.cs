using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Admin;
using Services.Interfaces;

namespace Services.Implements;

public class AdminService : IAdminService
{
    private readonly ILogger<AdminService> _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public AdminService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<AdminService> logger, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _passwordHasher = passwordHasher;
    }

    public async Task<IEnumerable<AdminDetailsDto>> GetAllAsync()
    {
        var admins = await _unitOfWork.Admins.GetAllAsync();
        return _mapper.Map<IEnumerable<AdminDetailsDto>>(admins);
    }

    public async Task<AdminDetailsDto> GetByIdAsync(int id, bool asNoTracking = false)
    {
        var admin = await _unitOfWork.Admins.GetByIdAsync(id);
        return _mapper.Map<AdminDetailsDto>(admin);
    }

    public async Task<AdminDetailsDto> CreateAsync(AdminCreateDto dto)
    {
        _logger.LogInformation($"Creating new admin with username: {dto.Username}");

        var admin = _mapper.Map<AdminUser>(dto);
        admin.CreationDate = DateTime.Now;
        admin.IsActive = true;

        await _unitOfWork.Admins.AddAsync(admin);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<AdminDetailsDto>(admin);
    }

    public async Task<AdminDetailsDto> UpdateAsync(int id, AdminUpdateDto dto)
    {
        _logger.LogInformation($"Updating admin with ID: {id}");

        var existingAdmin = await _unitOfWork.Admins.GetByIdAsync(id);
        if (existingAdmin == null) throw new ArgumentException($"Admin with ID {id} not found");

        // Map DTO to existing entity, excluding navigation properties
        _mapper.Map(dto, existingAdmin);

        _unitOfWork.Admins.Update(existingAdmin);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<AdminDetailsDto>(existingAdmin);
    }

    public async Task<AdminDetailsDto?> ValidateAdminCredentialsAsync(string email, string password)
    {
        var admin = await _unitOfWork.Admins.GetAdminByEmailAsync(email);
        if (admin == null) return null;

        if (!admin.IsActive == true) return null;

        if (!_passwordHasher.VerifyPassword(password, admin.PasswordHash))
        {
            return null;
        }

        return _mapper.Map<AdminDetailsDto>(admin);
    }

    public async Task UpdateLastLoginDateAsync(int adminId)
    {
        var admin = await _unitOfWork.Admins.GetByIdAsync(adminId);
        if (admin == null) throw new ArgumentException($"Admin with ID {adminId} not found");

        admin.LastLoginDate = DateTime.Now;
        _unitOfWork.Admins.Update(admin);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        var admin = await _unitOfWork.Admins.GetByIdAsync(id);
        return admin != null;
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation($"Deleting admin with ID: {id}");
        await _unitOfWork.Admins.DeleteByIdAsync(id);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<AdminDetailsDto?> GetAdminByUsernameAsync(string username)
    {
        var admin = await _unitOfWork.Admins.GetAdminByUsernameAsync(username);
        return _mapper.Map<AdminDetailsDto>(admin);
    }

    public async Task<AdminDetailsDto?> GetAdminByEmailAsync(string email)
    {
        var admin = await _unitOfWork.Admins.GetAdminByEmailAsync(email);
        return _mapper.Map<AdminDetailsDto>(admin);
    }

    public async Task<bool> IsUsernameExistsAsync(string username)
    {
        var admin = await _unitOfWork.Admins.GetAdminByUsernameAsync(username);
        return admin != null;
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        var admin = await _unitOfWork.Admins.GetAdminByEmailAsync(email);
        return admin != null;
    }

    public async Task<bool> ChangePasswordAsync(int adminId, string currentPassword, string newPassword)
    {
        var admin = await _unitOfWork.Admins.GetByIdAsync(adminId);
        if (admin == null)
        {
            _logger.LogWarning($"Admin with ID {adminId} not found");
            return false;
        }

        // Verify current password
        if (!_passwordHasher.VerifyPassword(currentPassword, admin.PasswordHash))
        {
            _logger.LogWarning($"Invalid current password for admin ID: {adminId}");
            return false;
        }

        // Hash new password
        var newPasswordHash = _passwordHasher.HashPassword(newPassword);
        admin.PasswordHash = newPasswordHash;

        // Update admin
        _unitOfWork.Admins.Update(admin);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation($"Password changed successfully for admin ID: {adminId}");
        return true;
    }

    public async Task<bool> ResetPasswordAsync(string email, string newPassword)
    {
        _logger.LogInformation($"Resetting password for admin with email: {email}");

        var admin = await _unitOfWork.Admins.GetAdminByEmailAsync(email);
        if (admin == null)
        {
            _logger.LogWarning($"Admin with email {email} not found");
            return false;
        }

        // Hash new password
        var newPasswordHash = _passwordHasher.HashPassword(newPassword);
        admin.PasswordHash = newPasswordHash;

        // Update admin
        _unitOfWork.Admins.Update(admin);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation($"Password reset successfully for admin with email: {email}");
        return true;
    }
} 