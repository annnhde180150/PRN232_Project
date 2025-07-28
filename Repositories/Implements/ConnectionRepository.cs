using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class ConnectionRepository : BaseRepository<Connection>, IConnectionRepository
{
    public ConnectionRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
    {
    }

    public async Task<Connection?> GetByConnectionIdAsync(string connectionId)
    {
        return await _context.Set<Connection>()
            .FirstOrDefaultAsync(c => c.ConnectionId == connectionId);
    }

    public async Task<List<Connection>> GetActiveConnectionsByUserIdAsync(string userId)
    {
        return await _context.Set<Connection>()
            .Where(c => c.UserId == userId && c.IsActive)
            .OrderByDescending(c => c.ConnectedAt)
            .ToListAsync();
    }

    public async Task<List<Connection>> GetActiveConnectionsByUserTypeAsync(string userType)
    {
        return await _context.Set<Connection>()
            .Where(c => c.UserType == userType && c.IsActive)
            .OrderByDescending(c => c.ConnectedAt)
            .ToListAsync();
    }

    public async Task<bool> IsUserOnlineAsync(string userId)
    {
        return await _context.Set<Connection>()
            .AnyAsync(c => c.UserId == userId && c.IsActive);
    }

    public async Task DeactivateAllConnectionsForUserAsync(string userId)
    {
        var connections = await _context.Set<Connection>()
            .Where(c => c.UserId == userId && c.IsActive)
            .ToListAsync();

        foreach (var connection in connections)
        {
            connection.IsActive = false;
            connection.DisconnectedAt = DateTime.Now;
            Update(connection);
        }
    }

    public async Task CleanupInactiveConnectionsAsync(TimeSpan olderThan)
    {
        var cutoffTime = DateTime.Now - olderThan;

        var oldConnections = await _context.Set<Connection>()
            .Where(c => !c.IsActive && c.DisconnectedAt.HasValue && c.DisconnectedAt < cutoffTime)
            .ToListAsync();

        if (oldConnections.Any()) DeleteRange(oldConnections);
    }
}