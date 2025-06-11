using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IConnectionRepository : IBaseRepository<Connection>
{
    Task<Connection?> GetByConnectionIdAsync(string connectionId);
    Task<List<Connection>> GetActiveConnectionsByUserIdAsync(string userId);
    Task<List<Connection>> GetActiveConnectionsByUserTypeAsync(string userType);
    Task<bool> IsUserOnlineAsync(string userId);
    Task DeactivateAllConnectionsForUserAsync(string userId);
    Task CleanupInactiveConnectionsAsync(TimeSpan olderThan);
}