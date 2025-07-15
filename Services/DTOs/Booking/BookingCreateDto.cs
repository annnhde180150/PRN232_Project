using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Booking
{
    public class BookingCreateDto
    {
        public int? RequestId { get; set; }

        public int UserId { get; set; }

        public int ServiceId { get; set; }

        public int HelperId { get; set; }

        public DateTime ScheduledStartTime { get; set; }

        public DateTime ScheduledEndTime { get; set; }
        public string Status { get; set; } = null!;
        public decimal? EstimatedPrice { get; set; }
        public DateTime? BookingCreationTime { get; set; }
    }
}
