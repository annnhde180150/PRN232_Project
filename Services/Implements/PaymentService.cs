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

        public async Task<GetPaymentDto> GetPayment(int userId, int bookingId)
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

        public async Task<Payment> UpdatePaymentStatus(int paymentId, string action, DateTime paymentDate)
        {
            var payment = await _unitOfWork.Payments.GetByIdAsync(paymentId);
            if (payment == null)
            {
                throw new ArgumentException($"Payment with ID {paymentId} not found");
            }
            if (action == "Success")
            {
                payment.PaymentStatus = Payment.PaymentStatusEnum.Success.ToString();
                payment.PaymentDate = paymentDate;
            }
            else if (action == "Cancelled")
            {
                payment.PaymentStatus = Payment.PaymentStatusEnum.Cancelled.ToString();
                payment.PaymentDate = paymentDate;
            }
            else
            {
                throw new ArgumentException("Invalid action. Use 'approve' or 'reject'.");
            }
            _unitOfWork.Payments.Update(payment);
            await _unitOfWork.CompleteAsync();
            return payment;
        }

        public async Task<IEnumerable<PaymentDetailsDto>> GetPaymentByUserId(int userId)
        {
            var payments = await _unitOfWork.Payments.GetPaymentsByUserIdAsync(userId);
            if (payments == null || !payments.Any())
            {
                return new List<PaymentDetailsDto>();
            }

            var listDto = new List<PaymentDetailsDto>();

            foreach (var payment in payments)
            {
                var dto = new PaymentDetailsDto
                {
                    PaymentId = payment.PaymentId,
                    BookingId = payment.BookingId,
                    UserId = payment.UserId,
                    HelperId = payment.Booking?.HelperId ?? 0,
                    Amount = payment.Amount,
                    PaymentStatus = payment.PaymentStatus,
                    PaymentDate = payment.PaymentDate,
                    TransactionId = payment.TransactionId,
                    PaymentMethod = payment.PaymentMethod,
                    BookingStatus = payment.Booking?.Status,
                    ScheduledStartTime = payment.Booking?.ScheduledStartTime,
                    ScheduledEndTime = payment.Booking?.ScheduledEndTime,
                    ServiceName = payment.Booking?.Helper?.HelperSkills?.FirstOrDefault()?.Service?.ServiceName,
                    HelperName = payment.Booking?.Helper?.FullName
                };

                listDto.Add(dto);
            }

            return listDto;
        }
    }
}
