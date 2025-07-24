using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Booking
{
    public class BookingStatusUpdateDto
    {
        public int BookingId { get; set; }
        public int HelperId { get; set; }
        public string Status { get; set; }
        // Remove ActualStartTime and ActualEndTime properties
    }
} 