using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.ServiceRequest
{
    public class ServiceRequestCreateDto
    {
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public int AddressId { get; set; }

        public DateTime RequestedStartTime { get; set; }

        public decimal? RequestedDurationHours { get; set; }

        public string? SpecialNotes { get; set; }
    }
}
