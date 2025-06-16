using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IHelperRepository : IBaseRepository<Helper>
{
    Task<Helper?> GetHelperByEmailAsync(string email);
    Task<Helper?> GetHelperByPhoneAsync(string phoneNumber);
    Task<IEnumerable<Helper>> GetActiveHelpersAsync();
    Task<IEnumerable<Helper>> GetInactiveHelpersAsync();
}