namespace Services.DTOs.Notification;

public class NotificationDetailsDto
{
    public long NotificationId { get; set; }
    public int? RecipientUserId { get; set; }
    public int? RecipientHelperId { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string? NotificationType { get; set; }
    public string? ReferenceId { get; set; }
    public bool? IsRead { get; set; }
    public DateTime? ReadTime { get; set; }
    public DateTime? CreationTime { get; set; }
    public DateTime? SentTime { get; set; }
}