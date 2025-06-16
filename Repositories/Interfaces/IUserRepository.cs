using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User>> GetActiveHelpersAsync();
    Task<IEnumerable<User>> GetInactiveHelpersAsync();
}