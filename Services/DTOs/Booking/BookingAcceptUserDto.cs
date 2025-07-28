using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Booking
{
    public class BookingAcceptUserDto
    {
        public int BookingId { get; set; }
        public bool isAccepted { get; set; }
    }
}
