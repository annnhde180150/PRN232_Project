using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<bool> IsEmailUniqueAsync(string email, int exceptUserId);
    Task<User?> GetUserByPhoneAsync(string phoneNumber);
    Task<bool> IsPhoneUniqueAsync(string phoneNumber, int exceptUserId);
    Task<IEnumerable<User>> GetActiveUsersAsync();
    Task<IEnumerable<User>> GetInactiveUsersAsync();
}