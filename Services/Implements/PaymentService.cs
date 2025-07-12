using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BussinessObjects.Models;
using Repositories;
using Repositories.Interfaces;
using Services.DTOs.Payment;
using Services.Interfaces;

namespace Services.Implements
{
    public class PaymentService : IPaymentService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetPaymentDto> CreatePayment(PaymentCreateDto newPayment)
        {
            if (newPayment == null)
            {
                throw new ArgumentException("Invalid payment data");
            }
            var payment = _mapper.Map<Payment>(newPayment);
            await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.CompleteAsync();
            return await GetPayment(payment.UserId, payment.BookingId);
        }

        public async Task<GetPaymentDto> GetPayment(int userId ,int bookingId)
        {
            var listPayment = await _unitOfWork.Payments.GetPaymentsByUserIdAsync(userId);
            if (listPayment == null || !listPayment.Any())
            {
                throw new ArgumentException($"No payments found for user with ID {userId}");
            }
            var payment = listPayment.FirstOrDefault(p => p.BookingId == bookingId);
            if (payment == null)
            {
                throw new ArgumentException($"No payment found for booking with ID {bookingId} for user with ID {userId}");
            }
            var paymentDto = _mapper.Map<GetPaymentDto>(payment);
            return paymentDto;
        }
    }
}
