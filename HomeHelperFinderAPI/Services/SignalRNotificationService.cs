using HomeHelperFinderAPI.Hubs;
using Microsoft.AspNetCore.SignalR;
using Services.DTOs.Notification;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Services;

public class SignalRNotificationService : IRealtimeNotificationService
{
    private readonly IConnectionManager _connectionManager;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<SignalRNotificationService> _logger;

    public SignalRNotificationService(
        IHubContext<NotificationHub> hubContext,
        IConnectionManager connectionManager,
        ILogger<SignalRNotificationService> logger)
    {
        _hubContext = hubContext;
        _connectionManager = connectionManager;
        _logger = logger;
    }

    public async Task SendToUserAsync(string userId, string userType, NotificationDetailsDto notification)
    {
        try
        {
            var connections = await _connectionManager.GetConnectionsAsync(userId);
            if (connections.Any())
            {
                await _hubContext.Clients.Clients(connections)
                    .SendAsync("ReceiveNotification", notification);

                _logger.LogInformation($"Notification sent to {userType} {userId} via SignalR");
            }
            else
            {
                _logger.LogInformation($"{userType} {userId} is not online - notification not sent via SignalR");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to {userType} {userId} via SignalR");
            throw;
        }
    }

    public async Task SendToGroupAsync(string groupName, NotificationDetailsDto notification)
    {
        try
        {
            await _hubContext.Clients.Group(groupName)
                .SendAsync("ReceiveNotification", notification);

            _logger.LogInformation($"Notification sent to group {groupName} via SignalR");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to group {groupName} via SignalR");
            throw;
        }
    }

    public async Task SendToAllUsersAsync(NotificationDetailsDto notification)
    {
        try
        {
            await _hubContext.Clients.Group("Users")
                .SendAsync("ReceiveNotification", notification);

            _logger.LogInformation("Notification sent to all Users via SignalR");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to all Users via SignalR");
            throw;
        }
    }

    public async Task SendToAllHelpersAsync(NotificationDetailsDto notification)
    {
        try
        {
            await _hubContext.Clients.Group("Helpers")
                .SendAsync("ReceiveNotification", notification);

            _logger.LogInformation("Notification sent to all Helpers via SignalR");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to all Helpers via SignalR");
            throw;
        }
    }

    public async Task<bool> IsUserOnlineAsync(string userId)
    {
        try
        {
            return await _connectionManager.IsUserOnlineAsync(userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error checking if user {userId} is online");
            return false;
        }
    }

    public async Task NotifyUserStatusAsync(string userId, string userType, bool isOnline)
    {
        try
        {
            await _hubContext.Clients.All
                .SendAsync("UserStatusChanged", new { UserId = userId, UserType = userType, IsOnline = isOnline });

            _logger.LogInformation(
                $"User status notification sent for {userType} {userId}: {(isOnline ? "Online" : "Offline")}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending user status notification for {userType} {userId}");
            throw;
        }
    }

    public async Task SendChatMessageAsync(string userId, string userType, object message)
    {
        try
        {
            var connections = await _connectionManager.GetConnectionsAsync(userId);
            if (connections.Any())
            {
                await _hubContext.Clients.Clients(connections)
                    .SendAsync("ReceiveChatMessage", message);

                _logger.LogInformation($"Chat message sent to {userType} {userId} via SignalR");
            }
            else
            {
                _logger.LogInformation($"{userType} {userId} is not online - chat message not sent via SignalR");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending chat message to {userType} {userId} via SignalR");
            throw;
        }
    }

    public async Task SendReadStatusAsync(string userId, string userType, object readInfo)
    {
        try
        {
            var connections = await _connectionManager.GetConnectionsAsync(userId);
            if (connections.Any())
            {
                await _hubContext.Clients.Clients(connections)
                    .SendAsync("MessagesMarkedAsRead", readInfo);

                _logger.LogInformation($"Read status sent to {userType} {userId} via SignalR");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending read status to {userType} {userId} via SignalR");
            throw;
        }
    }

    public async Task SendToConversationAsync(string conversationId, object message)
    {
        try
        {
            await _hubContext.Clients.Group($"Conversation_{conversationId}")
                .SendAsync("ReceiveChatMessage", message);

            _logger.LogInformation($"Message sent to conversation {conversationId} via SignalR");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending message to conversation {conversationId} via SignalR");
            throw;
        }
    }
}