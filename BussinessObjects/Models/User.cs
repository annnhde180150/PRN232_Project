namespace BussinessObjects.Models;

public class User
{
    public int UserId { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? FullName { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public DateTime? LastLoginDate { get; set; }

    public string? ExternalAuthProvider { get; set; }

    public string? ExternalAuthId { get; set; }

    public bool? IsActive { get; set; }

    public int? DefaultAddressId { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Chat> ChatReceiverUsers { get; set; } = new List<Chat>();

    public virtual ICollection<Chat> ChatSenderUsers { get; set; } = new List<Chat>();

    public virtual UserAddress? DefaultAddress { get; set; }

    public virtual ICollection<FavoriteHelper> FavoriteHelpers { get; set; } = new List<FavoriteHelper>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();

    public virtual ICollection<SupportTicket> SupportTickets { get; set; } = new List<SupportTicket>();

    public virtual ICollection<UserAddress> UserAddresses { get; set; } = new List<UserAddress>();
}