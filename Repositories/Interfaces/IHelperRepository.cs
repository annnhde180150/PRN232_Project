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
}