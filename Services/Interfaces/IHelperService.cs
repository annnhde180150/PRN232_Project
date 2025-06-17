using Services.DTOs.Helper;

namespace Services.Interfaces;

public interface IHelperService : IBaseService<HelperDetailsDto, HelperCreateDto, HelperUpdateDto>
{
    Task<HelperDetailsDto?> GetHelperByEmailAsync(string email);
    Task<HelperDetailsDto?> GetHelperByPhoneAsync(string phoneNumber);
    Task<bool> IsEmailExistsAsync(string email);
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
}