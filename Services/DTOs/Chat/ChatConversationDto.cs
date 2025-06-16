namespace Services.DTOs.Chat;

public class ChatConversationDto
{
    public string ConversationId { get; set; } = null!; // Unique identifier for the conversation
    public int? BookingId { get; set; }
    public int? ParticipantUserId { get; set; }
    public int? ParticipantHelperId { get; set; }
    public string? ParticipantName { get; set; }
    public string? ParticipantProfilePicture { get; set; }
    public string? ParticipantType { get; set; } // "User" or "Helper"
    public ChatMessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public DateTime? LastActivity { get; set; }
} 