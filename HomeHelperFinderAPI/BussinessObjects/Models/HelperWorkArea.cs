using System;
using System.Collections.Generic;

namespace BussinessObjects.Models;

public partial class HelperWorkArea
{
    public int WorkAreaId { get; set; }

    public int HelperId { get; set; }

    public string City { get; set; } = null!;

    public string District { get; set; } = null!;

    public string? Ward { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public decimal? RadiusKm { get; set; }

    public virtual Helper Helper { get; set; } = null!;
}
