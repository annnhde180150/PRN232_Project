namespace Services.DTOs.Service
{
    public class ServiceDto
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public decimal? BasePrice { get; set; }
        public string? PriceUnit { get; set; }
        public bool? IsActive { get; set; }
        public int? ParentServiceId { get; set; }
    }
} 