using BussinessObjects.Models;

namespace Services.DTOs.Chat;

public class HelperSearchDto
{
    public int HelperId { get; set; }
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    public bool? IsActive { get; set; }
    public decimal? AverageRating { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public BussinessObjects.Models.Helper.AvailableStatusEnum AvailableStatus { get; set; }
    
    // Additional info for chat context
    public bool HasExistingConversation { get; set; }
    public DateTime? LastConversationDate { get; set; }
    
    // Helper specific info
    public List<string> Skills { get; set; } = new List<string>();
}
