using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Payment
{
    public class PaymentCreateDto
    {
        public int BookingId { get; set; }

        public int UserId { get; set; }

        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
    }
}
