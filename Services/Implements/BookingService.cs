using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Booking;
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
    }
}
