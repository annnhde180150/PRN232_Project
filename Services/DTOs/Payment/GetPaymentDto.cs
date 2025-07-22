using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessObjects.Models;

namespace Services.DTOs.Payment
{
    public class GetPaymentDto
    {
        public int PaymentId { get; set; }  

        public int BookingId { get; set; }

        public int UserId { get; set; }

        public int HelperId { get; set; }  

        public decimal Amount { get; set; }

        public DateTime? PaymentDate { get; set; }
    }
}
