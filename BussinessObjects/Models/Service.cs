namespace BussinessObjects.Models;

public class Service
{
    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = null!;

    public string? Description { get; set; }

    public string? IconUrl { get; set; }

    public decimal? BasePrice { get; set; }

    public string? PriceUnit { get; set; }

    public bool? IsActive { get; set; }

    public int? ParentServiceId { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<HelperSkill> HelperSkills { get; set; } = new List<HelperSkill>();

    public virtual ICollection<Service> InverseParentService { get; set; } = new List<Service>();

    public virtual Service? ParentService { get; set; }

    public virtual ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
}