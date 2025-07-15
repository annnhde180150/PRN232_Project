using BussinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.ServiceRequest
{
    public class ServiceRequestDetailDto
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

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

    }
}
