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
        Task<IEnumerable<GetAllBookingDto>> getAllbookingByHelperId(int helperId);
        Task<ServiceRequestActionResultDto> updateBookingStatus(int bookingId, string action);
        Task<BookingDetailDto?> UpdateBookingStatusAsync(BookingStatusUpdateDto dto);
    }
}
