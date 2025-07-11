using Services.DTOs.Booking;
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
    }
}
