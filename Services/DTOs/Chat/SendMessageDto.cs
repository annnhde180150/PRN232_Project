using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Chat;

public class SendMessageDto
{
    public int? BookingId { get; set; }
    
    public int? ReceiverUserId { get; set; }
    
    public int? ReceiverHelperId { get; set; }
    
    [Required]
    [StringLength(2000, ErrorMessage = "Message content cannot exceed 2000 characters")]
    public string MessageContent { get; set; } = null!;
} 