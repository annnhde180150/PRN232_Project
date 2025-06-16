namespace Services.DTOs.Chat;

public class ChatMessageDto
{
    public long ChatId { get; set; }
    public int? BookingId { get; set; }
    public int? SenderUserId { get; set; }
    public int? SenderHelperId { get; set; }
    public int? ReceiverUserId { get; set; }
    public int? ReceiverHelperId { get; set; }
    public string MessageContent { get; set; } = null!;
    public DateTime? Timestamp { get; set; }
    public bool? IsReadByReceiver { get; set; }
    public DateTime? ReadTimestamp { get; set; }
    public bool? IsModerated { get; set; }
    public int? ModeratorAdminId { get; set; }
    
    // Navigation properties for display
    public string? SenderName { get; set; }
    public string? SenderProfilePicture { get; set; }
    public string? SenderType { get; set; } // "User" or "Helper"
} 