using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Services.DTOs.Notification;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// Get all notifications with OData support
    /// </summary>
    /// <returns>List of notifications</returns>
    [HttpGet]
    [EnableQuery]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetAll()
    {
        var notifications = await _notificationService.GetAllAsync();
        return Ok(notifications);
    }

    /// <summary>
    /// Get notification by ID
    /// </summary>
    /// <param name="id">Notification ID</param>
    /// <returns>Notification details</returns>
    [HttpGet("{id:long}")]
    public async Task<ActionResult<NotificationDetailsDto>> GetById(long id)
    {
        if (!await _notificationService.ExistsAsync(id))
        {
            return NotFound($"Notification with ID {id} not found.");
        }

        var notification = await _notificationService.GetByIdAsync(id);
        return Ok(notification);
    }

    /// <summary>
    /// Create new notification
    /// </summary>
    /// <param name="createDto">Notification creation data</param>
    /// <returns>Created notification</returns>
    [HttpPost]
    public async Task<ActionResult<NotificationDetailsDto>> Create([FromBody] NotificationCreateDto createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var notification = await _notificationService.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = notification.NotificationId }, notification);
    }

    /// <summary>
    /// Update notification
    /// </summary>
    /// <param name="id">Notification ID</param>
    /// <param name="updateDto">Notification update data</param>
    /// <returns>Updated notification</returns>
    [HttpPut("{id:long}")]
    public async Task<ActionResult<NotificationDetailsDto>> Update(long id, [FromBody] NotificationUpdateDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (!await _notificationService.ExistsAsync(id))
        {
            return NotFound($"Notification with ID {id} not found.");
        }

        var notification = await _notificationService.UpdateAsync(id, updateDto);
        return Ok(notification);
    }

    /// <summary>
    /// Delete notification
    /// </summary>
    /// <param name="id">Notification ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id:long}")]
    public async Task<ActionResult> Delete(long id)
    {
        if (!await _notificationService.ExistsAsync(id))
        {
            return NotFound($"Notification with ID {id} not found.");
        }

        await _notificationService.DeleteAsync(id);
        return Ok($"Notification with ID {id} has been deleted successfully.");
    }

    /// <summary>
    /// Get notifications by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of user notifications</returns>
    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetByUserId(int userId)
    {
        var notifications = await _notificationService.GetByUserIdAsync(userId);
        return Ok(notifications);
    }

    /// <summary>
    /// Get notifications by helper ID
    /// </summary>
    /// <param name="helperId">Helper ID</param>
    /// <returns>List of helper notifications</returns>
    [HttpGet("helper/{helperId:int}")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetByHelperId(int helperId)
    {
        var notifications = await _notificationService.GetByHelperIdAsync(helperId);
        return Ok(notifications);
    }

    /// <summary>
    /// Get unread notifications by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of unread user notifications</returns>
    [HttpGet("user/{userId:int}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetUnreadByUserId(int userId)
    {
        var notifications = await _notificationService.GetUnreadByUserIdAsync(userId);
        return Ok(notifications);
    }

    /// <summary>
    /// Get unread notifications by helper ID
    /// </summary>
    /// <param name="helperId">Helper ID</param>
    /// <returns>List of unread helper notifications</returns>
    [HttpGet("helper/{helperId:int}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetUnreadByHelperId(int helperId)
    {
        var notifications = await _notificationService.GetUnreadByHelperIdAsync(helperId);
        return Ok(notifications);
    }

    /// <summary>
    /// Get unread notification count by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Unread notification count</returns>
    [HttpGet("user/{userId:int}/unread-count")]
    public async Task<ActionResult<int>> GetUnreadCountByUserId(int userId)
    {
        var count = await _notificationService.GetUnreadCountByUserIdAsync(userId);
        return Ok(count);
    }

    /// <summary>
    /// Get unread notification count by helper ID
    /// </summary>
    /// <param name="helperId">Helper ID</param>
    /// <returns>Unread notification count</returns>
    [HttpGet("helper/{helperId:int}/unread-count")]
    public async Task<ActionResult<int>> GetUnreadCountByHelperId(int helperId)
    {
        var count = await _notificationService.GetUnreadCountByHelperIdAsync(helperId);
        return Ok(count);
    }

    /// <summary>
    /// Mark notification as read
    /// </summary>
    /// <param name="id">Notification ID</param>
    /// <returns>Success status</returns>
    [HttpPatch("{id:long}/mark-read")]
    public async Task<ActionResult> MarkAsRead(long id)
    {
        if (!await _notificationService.ExistsAsync(id))
        {
            return NotFound($"Notification with ID {id} not found.");
        }

        var result = await _notificationService.MarkAsReadAsync(id);
        if (result)
        {
            return Ok($"Notification with ID {id} has been marked as read.");
        }

        return BadRequest("Failed to mark notification as read.");
    }

    /// <summary>
    /// Mark all notifications as read for user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Success status</returns>
    [HttpPatch("user/{userId:int}/mark-all-read")]
    public async Task<ActionResult> MarkAllAsReadByUserId(int userId)
    {
        await _notificationService.MarkAllAsReadByUserIdAsync(userId);
        return Ok($"All notifications for user {userId} have been marked as read.");
    }

    /// <summary>
    /// Mark all notifications as read for helper
    /// </summary>
    /// <param name="helperId">Helper ID</param>
    /// <returns>Success status</returns>
    [HttpPatch("helper/{helperId:int}/mark-all-read")]
    public async Task<ActionResult> MarkAllAsReadByHelperId(int helperId)
    {
        await _notificationService.MarkAllAsReadByHelperIdAsync(helperId);
        return Ok($"All notifications for helper {helperId} have been marked as read.");
    }
}