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
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ServiceRequestService> _logger;
        private readonly IRealtimeNotificationService _realtimeNotificationService;
        private readonly BaseService<BookingDetailDto, BookingCreateDto, BookingUpdateDto, Booking> _baseService;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ServiceRequestService> logger, IRealtimeNotificationService realtimeNotificationService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
            _realtimeNotificationService = realtimeNotificationService;
            _baseService = new BaseService<BookingDetailDto, BookingCreateDto, BookingUpdateDto, Booking>(unitOfWork.Bookings, mapper, unitOfWork);
        }

        public async Task<IEnumerable<BookingDetailDto>> GetAllAsync() => await _baseService.GetAllAsync();
        public async Task<BookingDetailDto> GetByIdAsync(int id, bool asNoTracking) => await _baseService.GetByIdAsync(id, asNoTracking);
        public async Task<BookingDetailDto> CreateAsync(BookingCreateDto dto) => await _baseService.CreateAsync(dto);
        public async Task<BookingDetailDto> UpdateAsync(int id, BookingUpdateDto dto) => await _baseService.UpdateAsync(id, dto);
        public async Task<bool> ExistsAsync(int id) => await _baseService.ExistsAsync(id);
        public async Task DeleteAsync(int id) => await _baseService.DeleteAsync(id);

        public async Task<BookingDetailDto?> GetUserLatestBooking(int userId)
        {
            return (await GetAllAsync()).Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingCreationTime)
                .FirstOrDefault();
        }

        public async Task<bool> isBooked(int requestId)
        {
            var booking = _unitOfWork.Bookings;
            return (await booking.FindFirstAsync(b => b.RequestId == requestId, true)) != null;
        }
        
        public async Task<IEnumerable<GetAllBookingDto>> getAllbookingByHelperId(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetBookingsByHelperIdAsync(helperId);
            var pendingBookings = bookings.Where(b => b.Status == "Pending").ToList();
            IEnumerable<GetAllBookingDto> bookingList = new List<GetAllBookingDto>();
            foreach (var booking in pendingBookings) {
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
             
        public async Task<BookingDetailDto?> UpdateBookingStatusAsync(BookingStatusUpdateDto dto)
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(dto.BookingId);
            if (booking == null) return null;

            // Only allow InProgress or Completed
            if (dto.Status != "InProgress" && dto.Status != "Completed")
                throw new ArgumentException("Invalid status");

            booking.Status = dto.Status;
            if (dto.Status == "InProgress")
            {
                booking.ActualStartTime = dto.ActualStartTime ?? DateTime.UtcNow;
            }
            if (dto.Status == "Completed")
            {
                booking.ActualEndTime = dto.ActualEndTime ?? DateTime.UtcNow;
            }
            _unitOfWork.Bookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            // Send SignalR notification to user
            try
            {
                var notification = new Services.DTOs.Notification.NotificationDetailsDto
                {
                    RecipientUserId = booking.UserId,
                    Title = "Cập nhật trạng thái booking",
                    Message = $"Trạng thái booking #{booking.BookingId} đã chuyển sang {booking.Status}",
                    NotificationType = "STATUS_UPDATE",
                    ReferenceId = $"booking_{booking.BookingId}",
                    CreationTime = DateTime.UtcNow,
                    SentTime = DateTime.UtcNow
                };
                await _realtimeNotificationService.SendToUserAsync(booking.UserId.ToString(), "User", notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send SignalR booking status update");
            }

            return new BookingDetailDto
            {
                BookingId = booking.BookingId,
                RequestId = booking.RequestId,
                UserId = booking.UserId,
                HelperId = booking.HelperId,
                ServiceId = booking.ServiceId,
                ScheduledStartTime = booking.ScheduledStartTime,
                ScheduledEndTime = booking.ScheduledEndTime,
                ActualStartTime = booking.ActualStartTime,
                ActualEndTime = booking.ActualEndTime,
                Status = booking.Status,
                CancellationReason = booking.CancellationReason,
                CancelledBy = booking.CancelledBy,
                CancellationTime = booking.CancellationTime,
                FreeCancellationDeadline = booking.FreeCancellationDeadline,
                EstimatedPrice = booking.EstimatedPrice,
                FinalPrice = booking.FinalPrice,
                BookingCreationTime = booking.BookingCreationTime
            };
        }
    }
}
