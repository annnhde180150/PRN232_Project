namespace Services.DTOs.Notification;

public class NotificationCreateDto
{
    public int? RecipientUserId { get; set; }
    public int? RecipientHelperId { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string? NotificationType { get; set; }
    public string? ReferenceId { get; set; }
}