using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.DTOs.Payment;

namespace Services.Interfaces
{
    public interface IPaymentService
    {
        Task<GetPaymentDto> GetPayment(int userId, int bookingId);
        Task<GetPaymentDto> CreatePayment(PaymentCreateDto newPayment);
    }
}
