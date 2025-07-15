namespace BussinessObjects.Models;

public class UserAddress
{
    public int AddressId { get; set; }

    public int UserId { get; set; }

    public string AddressLine1 { get; set; } = null!;

    public string? AddressLine2 { get; set; }

    public string? Ward { get; set; }

    public string District { get; set; } = null!;

    public string City { get; set; } = null!;

    public string? FullAddress { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public bool? IsDefault { get; set; }

    public virtual ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}