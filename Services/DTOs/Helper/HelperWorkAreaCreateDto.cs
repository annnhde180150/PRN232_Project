namespace Services.DTOs.Helper;

public class HelperWorkAreaCreateDto
{
    public string City { get; set; } = null!;
    public string District { get; set; } = null!;
    public string? Ward { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? RadiusKm { get; set; }
} 