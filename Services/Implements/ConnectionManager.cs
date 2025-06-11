using System.Collections.Concurrent;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.Interfaces;

namespace Services.Implements;

public class ConnectionManager : IConnectionManager
{
    private readonly ConcurrentDictionary<string, string> _connectionUsers;
    private readonly ILogger<ConnectionManager> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ConcurrentDictionary<string, List<string>> _userConnections;

    public ConnectionManager(IUnitOfWork unitOfWork, ILogger<ConnectionManager> logger)
    {
        _userConnections = new ConcurrentDictionary<string, List<string>>();
        _connectionUsers = new ConcurrentDictionary<string, string>();
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task AddConnectionAsync(string userId, string userType, string connectionId)
    {
        try
        {
            // Add to in-memory tracking
            _userConnections.AddOrUpdate(userId,
                new List<string> { connectionId },
                (key, existingConnections) =>
                {
                    existingConnections.Add(connectionId);
                    return existingConnections;
                });

            _connectionUsers.TryAdd(connectionId, userId);

            // Persist to database
            var connection = new Connection
            {
                UserId = userId,
                UserType = userType,
                ConnectionId = connectionId,
                ConnectedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _unitOfWork.Connections.AddAsync(connection);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation($"Connection {connectionId} added for {userType} {userId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error adding connection {connectionId} for user {userId}");
            throw;
        }
    }

    public async Task RemoveConnectionAsync(string userId, string connectionId)
    {
        try
        {
            // Remove from in-memory tracking
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                connections.Remove(connectionId);
                if (!connections.Any()) _userConnections.TryRemove(userId, out _);
            }

            _connectionUsers.TryRemove(connectionId, out _);

            // Update database
            var connection = await _unitOfWork.Connections.GetByConnectionIdAsync(connectionId);
            if (connection != null)
            {
                connection.DisconnectedAt = DateTime.UtcNow;
                connection.IsActive = false;
                _unitOfWork.Connections.Update(connection);
                await _unitOfWork.CompleteAsync();
            }

            _logger.LogInformation($"Connection {connectionId} removed for user {userId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error removing connection {connectionId} for user {userId}");
            throw;
        }
    }

    public Task<List<string>> GetConnectionsAsync(string userId)
    {
        try
        {
            if (_userConnections.TryGetValue(userId, out var connections))
                return Task.FromResult(new List<string>(connections));
            return Task.FromResult(new List<string>());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting connections for user {userId}");
            return Task.FromResult(new List<string>());
        }
    }

    public Task<bool> IsUserOnlineAsync(string userId)
    {
        try
        {
            return Task.FromResult(_userConnections.ContainsKey(userId) && _userConnections[userId].Any());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error checking if user {userId} is online");
            return Task.FromResult(false);
        }
    }

    public Task<Dictionary<string, List<string>>> GetAllConnectionsAsync()
    {
        try
        {
            return Task.FromResult(new Dictionary<string, List<string>>(_userConnections.ToDictionary(
                kvp => kvp.Key,
                kvp => new List<string>(kvp.Value)
            )));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all connections");
            return Task.FromResult(new Dictionary<string, List<string>>());
        }
    }

    public async Task RemoveAllConnectionsForUserAsync(string userId)
    {
        try
        {
            if (_userConnections.TryRemove(userId, out var connections))
            {
                foreach (var connectionId in connections)
                {
                    _connectionUsers.TryRemove(connectionId, out _);

                    // Update database
                    var connection = await _unitOfWork.Connections.GetByConnectionIdAsync(connectionId);
                    if (connection != null)
                    {
                        connection.DisconnectedAt = DateTime.UtcNow;
                        connection.IsActive = false;
                        _unitOfWork.Connections.Update(connection);
                    }
                }

                await _unitOfWork.CompleteAsync();
            }

            _logger.LogInformation($"All connections removed for user {userId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error removing all connections for user {userId}");
            throw;
        }
    }
}