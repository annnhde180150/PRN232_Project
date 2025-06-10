namespace Services.DTOs.Notification;

public class NotificationUpdateDto
{
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string? NotificationType { get; set; }
}