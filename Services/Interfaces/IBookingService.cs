using Services.DTOs.Booking;
using Services.DTOs.ServiceRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IBookingService : IBaseService<BookingDetailDto, BookingCreateDto, BookingUpdateDto>
    {
        public Task<BookingDetailDto?> GetUserLatestBooking(int userId);
        public Task<bool> isBooked(int requestId);
        Task<IEnumerable<GetAllBookingDto>> getAllbookingByHelperId(int helperId);
        Task<BookingDetailDto?> UpdateBookingStatusAsync(BookingStatusUpdateDto dto);
        Task<List<BookingDetailDto>> GetPendingBookingByUserId(int userId);
        Task<List<BookingDetailDto>> GetUserSchedule(int userId);
        Task<List<BookingDetailDto>> GetHelperSchedule(int helperId);
    }
}
