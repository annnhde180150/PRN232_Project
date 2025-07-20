using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Booking;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class BookingService(IUnitOfWork _unitOfWork, IMapper _mapper, ILogger<ServiceRequestService> _logger) :
        BaseService<BookingDetailDto, BookingCreateDto, BookingUpdateDto, Booking>(_unitOfWork.Bookings, _mapper, _unitOfWork), IBookingService
    {
        public async Task<BookingDetailDto?> GetUserLatestBooking(int userId)
        {
            return (await GetAllAsync()).Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingCreationTime)
                .FirstOrDefault();
        }

        public async Task<IEnumerable<GetAllBookingDto>> getAllbookingByHelperId(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetBookingsByHelperIdAsync(helperId);
            IEnumerable<GetAllBookingDto> bookingList = new List<GetAllBookingDto>();
            foreach (var booking in bookings) {
                var userAddress = await _unitOfWork.addressRepository.GetByIdAsync(booking.Request.AddressId);
                var bookingDto = new GetAllBookingDto
                {
                    BookingId = booking.BookingId,
                    RequestId = booking.RequestId.Value,
                    UserId = booking.UserId,
                    ServiceId = booking.ServiceId,
                    ScheduledStartTime = booking.ScheduledStartTime,
                    ScheduledEndTime = booking.ScheduledEndTime,
                    EstimatedPrice = booking?.EstimatedPrice ?? 0,
                    Status = booking.Status,
                    AddressId = userAddress?.AddressId ?? 0,
                    FullAddress = userAddress?.FullAddress,
                    Ward = userAddress?.Ward,
                    District = userAddress?.District ?? string.Empty,
                    City = userAddress?.City ?? string.Empty,
                    FullName = booking.User?.FullName ?? string.Empty,
                    ServiceName = booking.Service?.ServiceName ?? string.Empty,
                };
                ((List<GetAllBookingDto>)bookingList).Add(bookingDto);
            }
            return bookingList;
        }

        public async Task<ServiceRequestActionResultDto> updateBookingStatus(int bookingId, string action)
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId);
            if (booking == null)
            {
                return new ServiceRequestActionResultDto
                {
                    Success = false,
                    Message = "Booking not found"
                };
            }
            if (action == "accept")
            {
                booking.Status = Booking.AvailableStatus.InProgress.ToString();
                return new ServiceRequestActionResultDto
                {
                    Success = true,
                    Message = "Booking accepted successfully",
                };
            }
            if (action == "cancel")
            {
                booking.Status = Booking.AvailableStatus.Cancelled.ToString();
                return new ServiceRequestActionResultDto
                {
                    Success = true,
                    Message = "Booking cancelled successfully",
                };
            }
            return new ServiceRequestActionResultDto
            {
                Success = false,
                Message = "Invalid action"
            };
        }
    }
}
