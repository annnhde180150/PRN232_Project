using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly IConnectionManager _connectionManager;
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(IConnectionManager connectionManager, ILogger<NotificationHub> logger)
    {
        _connectionManager = connectionManager;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        try
        {
            var userType = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userType) || string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User connected without proper authentication claims");
                await Clients.Caller.SendAsync("Error", "Authentication required");
                Context.Abort();
                return;
            }

            // Track connection
            await _connectionManager.AddConnectionAsync(userId, userType, Context.ConnectionId);

            // Add to appropriate group
            if (userType == "User")
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Users");
                _logger.LogInformation($"User {userId} joined Users group with connection {Context.ConnectionId}");
            }
            else if (userType == "Helper")
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Helpers");
                _logger.LogInformation($"Helper {userId} joined Helpers group with connection {Context.ConnectionId}");
            }

            await Clients.Caller.SendAsync("Connected", $"Welcome {userType} {userId}");
            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during connection establishment");
            await Clients.Caller.SendAsync("Error", "Connection failed");
            Context.Abort();
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            var userType = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                await _connectionManager.RemoveConnectionAsync(userId, Context.ConnectionId);
                _logger.LogInformation($"{userType} {userId} disconnected with connection {Context.ConnectionId}");
            }

            if (exception != null) _logger.LogError(exception, "User disconnected with error");

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during disconnection");
        }
    }

    // Method for clients to join specific notification groups
    public async Task JoinGroup(string groupName)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Caller.SendAsync("JoinedGroup", groupName);
            _logger.LogInformation($"Connection {Context.ConnectionId} joined group {groupName}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error joining group {groupName}");
            await Clients.Caller.SendAsync("Error", $"Failed to join group {groupName}");
        }
    }

    // Method for clients to leave specific notification groups
    public async Task LeaveGroup(string groupName)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Caller.SendAsync("LeftGroup", groupName);
            _logger.LogInformation($"Connection {Context.ConnectionId} left group {groupName}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error leaving group {groupName}");
            await Clients.Caller.SendAsync("Error", $"Failed to leave group {groupName}");
        }
    }

    // Method to send notification to specific user
    public async Task SendNotificationToUser(string targetUserId, string userType, object notification)
    {
        try
        {
            var connections = await _connectionManager.GetConnectionsAsync(targetUserId);
            if (connections.Any())
            {
                await Clients.Clients(connections).SendAsync("ReceiveNotification", notification);
                _logger.LogInformation($"Notification sent to {userType} {targetUserId}");
            }
            else
            {
                _logger.LogInformation($"{userType} {targetUserId} is not online");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to {userType} {targetUserId}");
        }
    }

    // Method to send chat message to specific user
    public async Task SendChatMessage(string targetUserId, string userType, object message)
    {
        try
        {
            var connections = await _connectionManager.GetConnectionsAsync(targetUserId);
            if (connections.Any())
            {
                await Clients.Clients(connections).SendAsync("ReceiveChatMessage", message);
                _logger.LogInformation($"Chat message sent to {userType} {targetUserId}");
            }
            else
            {
                _logger.LogInformation($"{userType} {targetUserId} is not online - chat message not delivered");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending chat message to {userType} {targetUserId}");
        }
    }

    // Method to notify about read status
    public async Task NotifyMessageRead(string targetUserId, string userType, object readInfo)
    {
        try
        {
            var connections = await _connectionManager.GetConnectionsAsync(targetUserId);
            if (connections.Any())
            {
                await Clients.Clients(connections).SendAsync("MessagesMarkedAsRead", readInfo);
                _logger.LogInformation($"Read status notification sent to {userType} {targetUserId}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending read status notification to {userType} {targetUserId}");
        }
    }

    // Method to join conversation room
    public async Task JoinConversation(string conversationId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
            await Clients.Caller.SendAsync("JoinedConversation", conversationId);
            _logger.LogInformation($"Connection {Context.ConnectionId} joined conversation {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error joining conversation {conversationId}");
            await Clients.Caller.SendAsync("Error", $"Failed to join conversation {conversationId}");
        }
    }

    // Method to leave conversation room
    public async Task LeaveConversation(string conversationId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
            await Clients.Caller.SendAsync("LeftConversation", conversationId);
            _logger.LogInformation($"Connection {Context.ConnectionId} left conversation {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error leaving conversation {conversationId}");
            await Clients.Caller.SendAsync("Error", $"Failed to leave conversation {conversationId}");
        }
    }

    // Method to send chat message to a specific conversation
    public async Task SendChatMessageToConversation(string conversationId, object message)
    {
        try
        {
            await Clients.Group($"Conversation_{conversationId}").SendAsync("ReceiveChatMessage", message);
            _logger.LogInformation($"Chat message sent to conversation {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending chat message to conversation {conversationId}");
        }
    }
}