using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.ServiceRequest
{
    public class ServiceRequestActionDto
    {
        public int RequestId { get; set; }
        public int BookingId { get; set; }
        public string Action { get; set; }
    }

    public class ServiceRequestActionResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
