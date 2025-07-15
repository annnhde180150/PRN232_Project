using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Helper
{
    public class HelperGetServiceRequestDto
    {
        public int RequestId { get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime ScheduledStartTime { get; set; }
        public DateTime ScheduledEndTime { get; set; }
        public string SpecialNotes { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public decimal EstimatedPrice { get; set; }
        public string Ward { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
