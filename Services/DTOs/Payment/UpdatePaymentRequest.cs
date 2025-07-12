using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Payment
{
    public class UpdatePaymentRequestDto
    {
        public int PaymentId { get; set; }
        public string action { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
    }
}
