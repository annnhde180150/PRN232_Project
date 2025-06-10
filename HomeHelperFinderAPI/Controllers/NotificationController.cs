using HomeHelperFinderAPI.Attributes;
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

    [HttpGet]
    [EnableQuery]
    [ApiResponseMessage("Lấy danh sách thông báo thành công")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetAll()
    {
        var notifications = await _notificationService.GetAllAsync();
        return Ok(notifications);
    }

    [HttpGet("{id:int}")]
    [ApiResponseMessage("Lấy thông tin thông báo thành công",
        SuccessMessage = "Tìm thấy thông báo thành công",
        ErrorMessage = "Không tìm thấy thông báo với ID được cung cấp")]
    public async Task<ActionResult<NotificationDetailsDto>> GetById(int id)
    {
        if (!await _notificationService.ExistsAsync(id)) return NotFound($"Notification with ID {id} not found.");

        var notification = await _notificationService.GetByIdAsync(id);
        return Ok(notification);
    }

    [HttpPost]
    [ApiResponseMessage("Thao tác với thông báo hoàn tất",
        SuccessMessage = "Tạo thông báo mới thành công",
        ErrorMessage = "Không thể tạo thông báo do dữ liệu không hợp lệ")]
    public async Task<ActionResult<NotificationDetailsDto>> Create([FromBody] NotificationCreateDto createDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var notification = await _notificationService.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = notification.NotificationId }, notification);
    }

    [HttpPut("{id:int}")]
    [ApiResponseMessage("Cập nhật thông báo thành công")]
    public async Task<ActionResult<NotificationDetailsDto>> Update(int id, [FromBody] NotificationUpdateDto updateDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!await _notificationService.ExistsAsync(id)) return NotFound($"Notification with ID {id} not found.");

        var notification = await _notificationService.UpdateAsync(id, updateDto);
        return Ok(notification);
    }

    [HttpDelete("{id:int}")]
    [ApiResponseMessage("Xóa thông báo thành công")]
    public async Task<ActionResult> Delete(int id)
    {
        if (!await _notificationService.ExistsAsync(id)) return NotFound($"Notification with ID {id} not found.");

        await _notificationService.DeleteAsync(id);
        return Ok($"Notification with ID {id} has been deleted successfully.");
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetByUserId(int userId)
    {
        var notifications = await _notificationService.GetByUserIdAsync(userId);
        return Ok(notifications);
    }

    [HttpGet("helper/{helperId:int}")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetByHelperId(int helperId)
    {
        var notifications = await _notificationService.GetByHelperIdAsync(helperId);
        return Ok(notifications);
    }

    [HttpGet("user/{userId:int}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetUnreadByUserId(int userId)
    {
        var notifications = await _notificationService.GetUnreadByUserIdAsync(userId);
        return Ok(notifications);
    }

    [HttpGet("helper/{helperId:int}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDetailsDto>>> GetUnreadByHelperId(int helperId)
    {
        var notifications = await _notificationService.GetUnreadByHelperIdAsync(helperId);
        return Ok(notifications);
    }

    [HttpGet("user/{userId:int}/unread-count")]
    public async Task<ActionResult<int>> GetUnreadCountByUserId(int userId)
    {
        var count = await _notificationService.GetUnreadCountByUserIdAsync(userId);
        return Ok(count);
    }

    [HttpGet("helper/{helperId:int}/unread-count")]
    public async Task<ActionResult<int>> GetUnreadCountByHelperId(int helperId)
    {
        var count = await _notificationService.GetUnreadCountByHelperIdAsync(helperId);
        return Ok(count);
    }

    [HttpPatch("{id:int}/mark-read")]
    [ApiResponseMessage("Đánh dấu thông báo đã đọc thành công")]
    public async Task<ActionResult> MarkAsRead(int id)
    {
        if (!await _notificationService.ExistsAsync(id)) return NotFound($"Notification with ID {id} not found.");

        var result = await _notificationService.MarkAsReadAsync(id);
        if (result) return Ok($"Notification with ID {id} has been marked as read.");

        return BadRequest("Failed to mark notification as read.");
    }

    [HttpPatch("user/{userId:int}/mark-all-read")]
    public async Task<ActionResult> MarkAllAsReadByUserId(int userId)
    {
        await _notificationService.MarkAllAsReadByUserIdAsync(userId);
        return Ok($"All notifications for user {userId} have been marked as read.");
    }

    [HttpPatch("helper/{helperId:int}/mark-all-read")]
    public async Task<ActionResult> MarkAllAsReadByHelperId(int helperId)
    {
        await _notificationService.MarkAllAsReadByHelperIdAsync(helperId);
        return Ok($"All notifications for helper {helperId} have been marked as read.");
    }
}