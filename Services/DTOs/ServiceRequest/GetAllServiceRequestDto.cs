using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.ServiceRequest
{
    public class GetAllServiceRequestDto
    {
        public int RequestId { get; set; }

        public int UserId { get; set; }

        public int ServiceId { get; set; }

        public int AddressId { get; set; }

        public DateTime RequestedStartTime { get; set; }

        public decimal? RequestedDurationHours { get; set; }

        public string? SpecialNotes { get; set; }

        public string? Status { get; set; }

        public DateTime? RequestCreationTime { get; set; }

        /// Location coordinates for real-time tracking and mapping purposes
        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }
        public string? Ward { get; set; }

        public string District { get; set; } = null!;

        public string City { get; set; } = null!;

        public string? FullAddress { get; set; }
        public string? FullName { get; set; }
        public decimal? BasePrice { get; set; }
        public string ServiceName { get; set; } = null!;
    }
}
