using BussinessObjects.Models;
using Services.DTOs.Helper;
using Services.DTOs.Admin;
using Services.DTOs.Chat;

namespace Services.Interfaces;

public interface IHelperService : IBaseService<HelperDetailsDto, HelperCreateDto, HelperUpdateDto>
{
    Task<HelperDetailsDto?> GetHelperByEmailAsync(string email);
    Task<HelperDetailsDto?> GetHelperByPhoneAsync(string phoneNumber);
    Task<bool> IsEmailExistsAsync(string email);
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<HelperDetailsDto?> ValidateHelperCredentialsAsync(string email, string password);
    Task UpdateLastLoginDateAsync(int userId);
    Task UpdateEmailVerificationStatusAsync(int helperId, bool isEmailVerified);
    Task<int> GetAvailableHelper(ServiceRequest request);
    Task<bool> SetHelperStatusOnlineAsync(int helperId);
    Task<bool> SetHelperStatusOfflineAsync(int helperId);
    Task<bool> SetHelperStatusBusyAsync(int helperId);
    Task<HelperViewIncomeDto> HelperViewIncomeAsync(int helperId);
    Task<bool> ChangePasswordAsync(int helperId, string currentPassword, string newPassword);
    Task<bool> ResetPasswordAsync(string email, string newPassword);
    Task<bool> isAvailalble(int helperId, DateTime startTime, DateTime endTime);

    // Admin helper application methods
    Task<(IEnumerable<HelperApplicationListDto> applications, int totalCount)> GetHelperApplicationsAsync(
        string? status = null,
        int page = 1,
        int pageSize = 20);
    Task<HelperApplicationDetailsDto?> GetHelperApplicationByIdAsync(int helperId);
    Task<bool> ProcessHelperApplicationDecisionAsync(int helperId, HelperApplicationDecisionDto decision, int adminId);
    Task<List<Service>> GetHelperAvailableService(int helperId);
    Task<IEnumerable<SearchHelperDto>> GetHelpersByServiceAsync(int serviceId,string? page, string? pageSize);
    Task<HelperAddMoneyToWalletResponseDto> AddMoneyToWalletAsync(HelperAddMoneyToWalletDto helperAddMoneyToWalletDto);

    // Search methods for chat functionality
    Task<(IEnumerable<HelperSearchDto> helpers, int totalCount)> SearchHelpersForChatAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        string? availabilityStatus = null,
        decimal? minimumRating = null,
        int? excludeHelperId = null,
        int? currentUserId = null,
        int? currentHelperId = null,
        int page = 1,
        int pageSize = 20);
}