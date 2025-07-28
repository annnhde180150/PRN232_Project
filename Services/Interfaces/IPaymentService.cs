using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessObjects.Models;
using Services.DTOs.Payment;

namespace Services.Interfaces
{
    public interface IPaymentService
    {
        Task<GetPaymentDto> GetPayment(int userId, int bookingId);
        Task<GetPaymentDto> CreatePayment(PaymentCreateDto newPayment);
        Task<Payment> UpdatePaymentStatus(int paymentId, string action, DateTime paymentDate);
        Task<IEnumerable<PaymentDetailsDto>> GetPaymentByUserId(int userId);
    }
}
