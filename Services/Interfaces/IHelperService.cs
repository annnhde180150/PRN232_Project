using BussinessObjects.Models;
using Services.DTOs.Helper;
using Services.DTOs.User;

namespace Services.Interfaces;

public interface IHelperService : IBaseService<HelperDetailsDto, HelperCreateDto, HelperUpdateDto>
{
    Task<HelperDetailsDto?> GetHelperByEmailAsync(string email);
    Task<HelperDetailsDto?> GetHelperByPhoneAsync(string phoneNumber);
    Task<bool> IsEmailExistsAsync(string email);
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<HelperDetailsDto?> ValidateHelperCredentialsAsync(string email, string password);
    Task UpdateLastLoginDateAsync(int userId);
    Task<int> GetAvailableHelper(ServiceRequest request);
    Task<bool> SetHelperStatusOnlineAsync(int helperId);
    Task<bool> SetHelperStatusOfflineAsync(int helperId);
    Task<bool> SetHelperStatusBusyAsync(int helperId);
    Task<HelperViewIncomeDto> HelperViewIncomeAsync(int helperId);
}