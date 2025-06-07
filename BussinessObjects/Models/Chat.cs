namespace BussinessObjects.Models;

public class Chat
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

    public virtual Booking? Booking { get; set; }

    public virtual AdminUser? ModeratorAdmin { get; set; }

    public virtual Helper? ReceiverHelper { get; set; }

    public virtual User? ReceiverUser { get; set; }

    public virtual Helper? SenderHelper { get; set; }

    public virtual User? SenderUser { get; set; }
}