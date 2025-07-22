namespace Services.DTOs.Chat;

public class UserSearchDto
{
    public int UserId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? LastLoginDate { get; set; }
    
    // Additional info for chat context
    public bool HasExistingConversation { get; set; }
    public DateTime? LastConversationDate { get; set; }
}
