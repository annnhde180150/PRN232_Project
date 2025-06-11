namespace Services.Interfaces;

public interface IConnectionManager
{
    Task AddConnectionAsync(string userId, string userType, string connectionId);
    Task RemoveConnectionAsync(string userId, string connectionId);
    Task<List<string>> GetConnectionsAsync(string userId);
    Task<bool> IsUserOnlineAsync(string userId);
    Task<Dictionary<string, List<string>>> GetAllConnectionsAsync();
    Task RemoveAllConnectionsForUserAsync(string userId);
}