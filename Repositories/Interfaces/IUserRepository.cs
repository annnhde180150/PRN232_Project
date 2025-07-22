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

    // Search methods for chat functionality
    Task<(IEnumerable<User> users, int totalCount)> SearchUsersAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        int? excludeUserId = null,
        int page = 1,
        int pageSize = 20);
}