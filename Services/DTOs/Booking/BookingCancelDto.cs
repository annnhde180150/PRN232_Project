using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Booking
{
    public class BookingCancelDto
    {
        public int BookingId { get; set; }

        public string? CancellationReason { get; set; }

        public string? CancelledBy { get; set; }
    }
}
