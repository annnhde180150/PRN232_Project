using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IHelperRepository : IBaseRepository<Helper>
{
    Task<Helper?> GetHelperByEmailAsync(string email);
    Task<Helper?> GetHelperByPhoneAsync(string phoneNumber);
    Task<IEnumerable<Helper>> GetActiveHelpersAsync();
    Task<IEnumerable<Helper>> GetInactiveHelpersAsync();
    Task<bool> SetHelperStatusOnlineAsync(int helperId);
    Task<bool> SetHelperStatusOfflineAsync(int helperId);
    Task<bool> SetHelperStatusBusyAsync(int helperId);

    // Admin helper application methods
    Task<(IEnumerable<Helper> applications, int totalCount)> GetHelperApplicationsAsync(
        string? status = null,
        int page = 1,
        int pageSize = 20);
    Task<Helper?> GetHelperApplicationByIdAsync(int helperId);

    // Search methods for chat functionality
    Task<(IEnumerable<Helper> helpers, int totalCount)> SearchHelpersAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        string? availabilityStatus = null,
        decimal? minimumRating = null,
        int? excludeHelperId = null,
        int page = 1,
        int pageSize = 20);
}