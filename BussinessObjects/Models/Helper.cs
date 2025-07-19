namespace BussinessObjects.Models;

public class Helper
{
    public int HelperId { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string? Email { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? ProfilePictureUrl { get; set; }

    public string? Bio { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public string? ApprovalStatus { get; set; }

    public int? ApprovedByAdminId { get; set; }

    public DateTime? ApprovalDate { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsEmailVerified { get; set; } = false;

    public decimal? TotalHoursWorked { get; set; }

    public decimal? AverageRating { get; set; }

    public DateTime? LastLoginDate { get; set; }

    public virtual AdminUser? ApprovedByAdmin { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Chat> ChatReceiverHelpers { get; set; } = new List<Chat>();

    public virtual ICollection<Chat> ChatSenderHelpers { get; set; } = new List<Chat>();

    public virtual ICollection<FavoriteHelper> FavoriteHelpers { get; set; } = new List<FavoriteHelper>();

    public virtual ICollection<HelperDocument> HelperDocuments { get; set; } = new List<HelperDocument>();

    public virtual ICollection<HelperSkill> HelperSkills { get; set; } = new List<HelperSkill>();

    public virtual HelperWallet? HelperWallet { get; set; }

    public virtual ICollection<HelperWorkArea> HelperWorkAreas { get; set; } = new List<HelperWorkArea>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<SupportTicket> SupportTickets { get; set; } = new List<SupportTicket>();

    public virtual ICollection<WithdrawalRequest> WithdrawalRequests { get; set; } = new List<WithdrawalRequest>();
    public enum AvailableStatusEnum
    {
        Available = 0,
        Busy = 1,
        Offline = 2
    }
    public AvailableStatusEnum AvailableStatus { get; set; } = AvailableStatusEnum.Offline;
    
    public virtual ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
}