using AutoMapper;
using BussinessObjects.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Services.DTOs.Booking;
using Services.DTOs.Payment;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController(IServiceRequestService _requestService, IMapper _mapper, IUnitOfWork _unitOfWork, IHelperService _helperService, IUserAddressService _addressService, IBookingService _bookingService, IServiceService _serviceService, IPaymentService _paymentService) : ControllerBase
    {
        [HttpPost("CreateBooking")]
        public async Task<ActionResult> CreateBooking([FromBody] BookingCreateDto newBooking)
        {
            // validate request
            if (newBooking == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (!await _requestService.ExistsAsync(newBooking.RequestId.Value))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (!await _helperService.ExistsAsync(newBooking.HelperId))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //create new Booking
            Task createTask = _bookingService.CreateAsync(newBooking);
            await createTask;
            if (!createTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create booking");
            }

            var basePrice = (await _serviceService.GetByIdAsync(newBooking.ServiceId)).BasePrice;
            newBooking.EstimatedPrice = basePrice * (decimal)(newBooking.ScheduledEndTime - newBooking.ScheduledStartTime).TotalHours;

            //return new Booking under DetailDto
            var latestBooking = await _bookingService.GetUserLatestBooking(newBooking.UserId);
            var payment = new Payment
            {
                BookingId = latestBooking.BookingId,
                Amount = latestBooking.FinalPrice ?? 0,
                PaymentStatus = Payment.PaymentStatusEnum.Pending.ToString(),
            };
            await _paymentService.CreatePayment(new PaymentCreateDto
            {
                BookingId = latestBooking.BookingId,
                UserId = latestBooking.UserId,
                Amount = latestBooking.EstimatedPrice ?? 0,
                PaymentStatus = Payment.PaymentStatusEnum.Pending.ToString(),
                PaymentMethod = "None"
            });
            return Ok(_mapper.Map<BookingDetailDto>(latestBooking));

        }

        [HttpPost("BookHelper/{helperId}")]
        //[Authorize]
        public async Task<ActionResult> BookHelperRequest([FromBody] ServiceRequestCreateDto newRequest, [FromRoute] int helperId)
        {
            if (!await _requestService.IsValidatedCreateRequest(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //validate helper id and check if helper is available at time
            if (helperId == null || !(await _helperService.ExistsAsync(helperId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //notify 

            //insert new Request
            Task createTask = _requestService.CreateAsync(newRequest);
            await createTask;
            if (!createTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create service request");
            }

            //return created Request under DetailDto
            var latestRequest = await _requestService.GetLatestRequestByUserId(newRequest.UserId);

            var newBooking = new BookingCreateDto
            {
                RequestId = latestRequest.RequestId,
                UserId = newRequest.UserId,
                HelperId = helperId,
                ServiceId = newRequest.ServiceId,
                ScheduledStartTime = newRequest.RequestedStartTime,
                ScheduledEndTime = newRequest.RequestedStartTime.AddHours((double)newRequest.RequestedDurationHours),
                Status = "Pending",
                BookingCreationTime = DateTime.UtcNow
            };

            var basePrice = (await _serviceService.GetByIdAsync(newBooking.ServiceId)).BasePrice;
            newBooking.EstimatedPrice = basePrice * (decimal)(newBooking.ScheduledEndTime - newBooking.ScheduledStartTime).TotalHours;

            // insert the new booking
            var bookingResult = await _bookingService.CreateAsync(newBooking);
            await _paymentService.CreatePayment(new PaymentCreateDto
            {
                BookingId = bookingResult.BookingId,
                UserId = bookingResult.UserId,
                Amount = bookingResult.EstimatedPrice ?? 0,
                PaymentStatus = Payment.PaymentStatusEnum.Pending.ToString()
            });
            return Ok(_mapper.Map<ServiceRequestDetailDto>(latestRequest));
        }

        [HttpPut("EditBookedRequest")]
        //[Authorized]
        public async Task<ActionResult> UpdateBookedRequest([FromBody] BookingUpdateDto updateBooking)
        {
            // valid request?
            if (await _requestService.ExistsAsync(updateBooking.RequestId.Value))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            // check if booking exists
            if (updateBooking.BookingId == null || updateBooking.BookingId <= 0 || !(await _bookingService.ExistsAsync(updateBooking.BookingId)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            }

            // check if user is the owner of the booking
            var booking = await _bookingService.GetByIdAsync(updateBooking.BookingId);
            if (booking == null || booking.UserId != updateBooking.UserId)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "You are not authorized to update this booking");
            }

            // check if helper is available at the new time
            //if (updateBooking.HelperId != booking.HelperId && !(await _helperService.(updateBooking.HelperId, updateBooking.ScheduledStartTime, updateBooking.ScheduledEndTime)))
            //{
            //    return StatusCode(StatusCodes.Status400BadRequest, "Helper is not available at the requested time");
            //}


            //if cancelled, is all cancelled info filled?
            if (updateBooking.Status == Booking.AvailableStatus.Cancelled.ToString())
            {
                if (string.IsNullOrEmpty(updateBooking.CancellationReason) || string.IsNullOrEmpty(updateBooking.CancelledBy))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Cancellation reason and cancelled by must be provided");
                }
                updateBooking.CancellationTime = DateTime.UtcNow;
            }

            // set new Final Price
            var basePrice = (await _serviceService.GetByIdAsync(updateBooking.ServiceId)).BasePrice;
            updateBooking.EstimatedPrice = basePrice * (decimal)(updateBooking.ScheduledEndTime - updateBooking.ScheduledStartTime).TotalHours;
            if (updateBooking.ActualEndTime == null || updateBooking.ActualStartTime == null)
            {
                updateBooking.FinalPrice = updateBooking.EstimatedPrice;
            }
            else
            {
                updateBooking.FinalPrice = basePrice * (decimal)(updateBooking.ActualEndTime - updateBooking.ActualStartTime).Value.TotalHours;
            }

            //update booking
            Task updateTask = _bookingService.UpdateAsync(updateBooking.BookingId, updateBooking);
            await updateTask;
            if (!updateTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update booking");
            }

            //return updated booking
            var updatedBooking = await _bookingService.GetByIdAsync(updateBooking.BookingId);
            if (updatedBooking == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Booking not found");
            }
            return Ok(_mapper.Map<BookingDetailDto>(updatedBooking));
        }

        [HttpGet("GetBookingByHelperId/{helperId}")]
        public async Task<ActionResult<IEnumerable<GetAllBookingDto>>> GetBookingsByHelperId(int helperId)
        {
            if (helperId <= 0 || !(await _helperService.ExistsAsync(helperId)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid helper ID");
            }
            var bookings = await _bookingService.getAllbookingByHelperId(helperId);
            if (bookings == null || !bookings.Any())
            {
                return StatusCode(StatusCodes.Status404NotFound, "No bookings found for this helper");
            }

            return Ok(bookings);

        }

        [HttpPut("UpdateBookingstatus")]
        public async Task<IActionResult> updateBookingStatus([FromBody] UpdateBookingStatusDto updateBookingStatusDto)
        {
            if (updateBookingStatusDto.BookingId <= 0 || string.IsNullOrEmpty(updateBookingStatusDto.Action))
            {
                return BadRequest("Invalid booking update request data.");
            }
            var result = await _bookingService.updateBookingStatus(updateBookingStatusDto.BookingId, updateBookingStatusDto.Action);
            return Ok(result);
        }
    }
}
