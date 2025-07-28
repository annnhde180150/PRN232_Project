using AutoMapper;
using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Booking;
using Services.DTOs.Review;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<BookingService> _logger;
        private readonly IRealtimeNotificationService _realtimeNotificationService;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<BookingService> logger, IRealtimeNotificationService realtimeNotificationService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
            _realtimeNotificationService = realtimeNotificationService;
        }

        // CRUD
        public async Task<IEnumerable<BookingDetailDto>> GetAllAsync()
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            return _mapper.Map<IEnumerable<BookingDetailDto>>(bookings);
        }

        public async Task<BookingDetailDto> GetByIdAsync(int id, bool asNoTracking = false)
        {
            var booking = await _unitOfWork.Bookings.GetQueryable(
                b => b.Helper,
                b => b.Service,
                b => b.Request,
                b => b.Request.Address
            ).FirstOrDefaultAsync(b => b.BookingId == id);
            var dto = _mapper.Map<BookingDetailDto>(booking);
            if (booking != null)
            {
                var payment = (await _unitOfWork.Payments.GetAllAsync()).Where(p => p.BookingId == booking.BookingId).OrderByDescending(p => p.PaymentId).FirstOrDefault();
                dto.PaymentStatus = payment?.PaymentStatus;
            }
            return dto;
        }

        public async Task<BookingDetailDto> CreateAsync(BookingCreateDto dto)
        {
            var booking = _mapper.Map<Booking>(dto);
            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<BookingDetailDto>(booking);
        }

        public async Task<BookingDetailDto> UpdateAsync(int id, BookingUpdateDto dto)
        {
            var existing = await _unitOfWork.Bookings.GetByIdAsync(id);
            if (existing == null) return null;
            var updated = _mapper.Map(dto, existing);
            _unitOfWork.Bookings.Update(updated);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<BookingDetailDto>(updated);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return (await _unitOfWork.Bookings.GetByIdAsync(id, true)) != null;
        }

        public async Task DeleteAsync(int id)
        {
            await _unitOfWork.Bookings.DeleteByIdAsync(id);
            await _unitOfWork.CompleteAsync();
        }

        // Custom business logic
        public async Task<BookingDetailDto?> GetUserLatestBooking(int userId)
        {
            var booking = await _unitOfWork.Bookings
                .GetQueryable()
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingCreationTime)
                .FirstOrDefaultAsync();
            return _mapper.Map<BookingDetailDto>(booking);
        }

        public async Task<bool> IsBooked(int requestId)
        {
            var booking = await _unitOfWork.Bookings.FindFirstAsync(b => b.RequestId == requestId, true);
            return booking != null;
        }

        public async Task<IEnumerable<GetAllBookingDto>> GetAllBookingByHelperId(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetBookingsByHelperIdAsync(helperId);
            var pendingBookings = bookings.Where(b => b.Status == Booking.AvailableStatus.Pending.ToString());
            var result = new List<GetAllBookingDto>();
            foreach (var booking in pendingBookings)
            {
                var userAddress = booking.Request != null ? await _unitOfWork.addressRepository.GetByIdAsync(booking.Request.AddressId) : null;
                result.Add(new GetAllBookingDto
                {
                    BookingId = booking.BookingId,
                    RequestId = booking.RequestId ?? 0,
                    UserId = booking.UserId,
                    ServiceId = booking.ServiceId,
                    ScheduledStartTime = booking.ScheduledStartTime,
                    ScheduledEndTime = booking.ScheduledEndTime,
                    EstimatedPrice = booking.EstimatedPrice ?? 0,
                    Status = booking.Status,
                    AddressId = userAddress?.AddressId ?? 0,
                    FullAddress = userAddress?.FullAddress,
                    Ward = userAddress?.Ward,
                    District = userAddress?.District ?? string.Empty,
                    City = userAddress?.City ?? string.Empty,
                    FullName = booking.User?.FullName ?? string.Empty,
                    ServiceName = booking.Service?.ServiceName ?? string.Empty,
                });
            }
            return result;
        }

        public async Task<BookingDetailDto?> UpdateBookingStatusAsync(BookingStatusUpdateDto dto)
        {
            var booking = await _unitOfWork.Bookings.GetByIdAsync(dto.BookingId);
            if (booking == null) return null;

            booking.Status = dto.Status;
            _unitOfWork.Bookings.Update(booking);
            await _unitOfWork.CompleteAsync();
            try
            {
                var notification = new Services.DTOs.Notification.NotificationDetailsDto
                {
                    RecipientUserId = booking.UserId,
                    Title = "Cập nhật trạng thái booking",
                    Message = $"Trạng thái booking #{booking.BookingId} đã chuyển sang {booking.Status}",
                    NotificationType = "STATUS_UPDATE",
                    ReferenceId = $"booking_{booking.BookingId}",
                    CreationTime = DateTime.Now,
SentTime = DateTime.Now
                };
                await _realtimeNotificationService.SendToUserAsync(booking.UserId.ToString(), "User", notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send SignalR booking status update");
            }
            return _mapper.Map<BookingDetailDto>(booking);
        }

        public async Task<List<BookingDetailDto>> GetPendingBookingByUserId(int userId)
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            var filtered = bookings.Where(b => b.UserId == userId && b.Status == Booking.AvailableStatus.Pending.ToString());
            return _mapper.Map<List<BookingDetailDto>>(filtered);
        }

        public async Task<List<BookingDetailDto>> GetUserSchedule(int userId)
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            var filtered = bookings
                .Where(b => b.UserId == userId && b.Status != Booking.AvailableStatus.Pending.ToString() && b.Status != Booking.AvailableStatus.Cancelled.ToString())
                .OrderBy(b => b.ScheduledStartTime);
            return _mapper.Map<List<BookingDetailDto>>(filtered);
        }

        public async Task<List<BookingDetailDto>> GetHelperSchedule(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            var filtered = bookings
                .Where(b => b.HelperId == helperId && b.Status != Booking.AvailableStatus.Pending.ToString() && b.Status != Booking.AvailableStatus.Cancelled.ToString())
                .OrderBy(b => b.ScheduledStartTime);
            return _mapper.Map<List<BookingDetailDto>>(filtered);
        }

        public async Task<List<BookingServiceNameDto>> GetReviewServiceNames(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetQueryable(b => b.Service)
                .Where(b => b.HelperId == helperId && b.Status == Booking.AvailableStatus.Completed.ToString())
                .ToListAsync();
            return _mapper.Map<List<BookingServiceNameDto>>(bookings);
        }

        public async Task<IEnumerable<GetAllBookingDto>> GetActiveBookingsByHelperId(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetBookingsByHelperIdAsync(helperId);
            var activeStatuses = new[] { Booking.AvailableStatus.Accepted.ToString(), Booking.AvailableStatus.InProgress.ToString(), Booking.AvailableStatus.Completed.ToString() };
            var activeBookings = bookings.Where(b => activeStatuses.Contains(b.Status));
            var result = new List<GetAllBookingDto>();
            foreach (var booking in activeBookings)
            {
                if (booking.Request == null) continue;
                var userAddress = await _unitOfWork.addressRepository.GetByIdAsync(booking.Request.AddressId);
                result.Add(new GetAllBookingDto
                {
                    BookingId = booking.BookingId,
                    RequestId = booking.RequestId ?? 0,
                    UserId = booking.UserId,
                    ServiceId = booking.ServiceId,
                    ScheduledStartTime = booking.ScheduledStartTime,
                    ScheduledEndTime = booking.ScheduledEndTime,
                    EstimatedPrice = booking.EstimatedPrice ?? 0,
                    Status = booking.Status,
                    AddressId = userAddress?.AddressId ?? 0,
                    FullAddress = userAddress?.FullAddress,
                    Ward = userAddress?.Ward,
                    District = userAddress?.District ?? string.Empty,
                    City = userAddress?.City ?? string.Empty,
                    FullName = booking.User?.FullName ?? string.Empty,
                    ServiceName = booking.Service?.ServiceName ?? string.Empty,
                });
            }
            return result;
        }

        public async Task<IEnumerable<GetAllBookingDto>> GetActiveBookingsByUserId(int userId)
        {
            var bookings = await _unitOfWork.Bookings.GetBookingsByUserIdAsync(userId);
            var activeStatuses = new[] { Booking.AvailableStatus.Accepted.ToString(), Booking.AvailableStatus.InProgress.ToString(), Booking.AvailableStatus.Completed.ToString() };
            var activeBookings = bookings.Where(b => activeStatuses.Contains(b.Status));
            var result = new List<GetAllBookingDto>();
            foreach (var booking in activeBookings)
            {
                if (booking.Request == null) continue;
                var userAddress = await _unitOfWork.addressRepository.GetByIdAsync(booking.Request.AddressId);
                result.Add(new GetAllBookingDto
                {
                    BookingId = booking.BookingId,
                    RequestId = booking.RequestId ?? 0,
                    UserId = booking.UserId,
                    ServiceId = booking.ServiceId,
                    ScheduledStartTime = booking.ScheduledStartTime,
                    ScheduledEndTime = booking.ScheduledEndTime,
                    EstimatedPrice = booking.EstimatedPrice ?? 0,
                    Status = booking.Status,
                    AddressId = userAddress?.AddressId ?? 0,
                    FullAddress = userAddress?.FullAddress,
                    Ward = userAddress?.Ward,
                    District = userAddress?.District ?? string.Empty,
                    City = userAddress?.City ?? string.Empty,
                    FullName = booking.User?.FullName ?? string.Empty,
                    ServiceName = booking.Service?.ServiceName ?? string.Empty,
                });
            }
            return result;
        }

        public async Task<List<BookingDetailDto>> GetAllBookingsByUserId(int userId)
        {
            var bookings = await _unitOfWork.Bookings.GetQueryable(
                b => b.Helper,
                b => b.Service,
                b => b.Request,
                b => b.Request.Address
            ).Where(b => b.UserId == userId).ToListAsync();
            var dtos = _mapper.Map<List<BookingDetailDto>>(bookings);
            var payments = await _unitOfWork.Payments.GetAllAsync();
            foreach (var dto in dtos)
            {
                var payment = payments.Where(p => p.BookingId == dto.BookingId).OrderByDescending(p => p.PaymentId).FirstOrDefault();
                dto.PaymentStatus = payment?.PaymentStatus;
            }
            return dtos;
        }
        public async Task<List<BookingDetailDto>> GetAllBookingsByHelperId(int helperId)
        {
            var bookings = await _unitOfWork.Bookings.GetQueryable(
                b => b.User,
                b => b.Service,
                b => b.Request,
                b => b.Request.Address
            ).Where(b => b.HelperId == helperId).ToListAsync();
            var dtos = _mapper.Map<List<BookingDetailDto>>(bookings);
            var payments = await _unitOfWork.Payments.GetAllAsync();
            foreach (var dto in dtos)
            {
                var payment = payments.Where(p => p.BookingId == dto.BookingId).OrderByDescending(p => p.PaymentId).FirstOrDefault();
                dto.PaymentStatus = payment?.PaymentStatus;
            }
            return dtos;
        }

        public async Task<List<BookingDetailDto>> GetTempBookingByUserId(int userId)
        {
            var bookings = await _unitOfWork.Bookings.GetQueryable(
                b => b.User,
                b => b.Service,
                b => b.Request,
                b => b.Request.Address
            ).Where(b => b.UserId == userId && b.Status.Equals(Booking.AvailableStatus.TemporaryAccepted.ToString()))
            .ToListAsync();
            var dtos = _mapper.Map<List<BookingDetailDto>>(bookings);
            var helperIds = (await _unitOfWork.Helpers.GetAllAsync()).Select(h => new { h.HelperId, h.FullName }).ToList();
            foreach (var dto in dtos)
            {
                var helper = helperIds.FirstOrDefault(h => h.HelperId == dto.HelperId);
                if (helper != null)
                {
                    dto.HelperName = helper.FullName;
                }
            }
            return dtos;
        }
    }
}
