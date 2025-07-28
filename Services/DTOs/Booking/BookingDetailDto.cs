using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Booking
{
    public class BookingDetailDto
    {
        public int BookingId { get; set; }

        public int UserId { get; set; }

        public int ServiceId { get; set; }

        public int? RequestId { get; set; }

        public int HelperId { get; set; }
        public DateTime ScheduledStartTime { get; set; }

        public DateTime ScheduledEndTime { get; set; }

        public DateTime? ActualStartTime { get; set; }

        public DateTime? ActualEndTime { get; set; }

        public string Status { get; set; } = null!;
        public string? CancellationReason { get; set; }

        public string? CancelledBy { get; set; }

        public DateTime? CancellationTime { get; set; }

        public DateTime? FreeCancellationDeadline { get; set; }

        public decimal? EstimatedPrice { get; set; }

        public decimal? FinalPrice { get; set; }

        public DateTime? BookingCreationTime { get; set; }

        public string ServiceName { get; set; } = string.Empty;
        public string HelperName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? PaymentStatus { get; set; }
    }
}
