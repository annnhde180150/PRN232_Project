using AutoMapper;
using Azure.Core;
using BussinessObjects.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Services.DTOs.Booking;
using Services.DTOs.Notification;
using Services.DTOs.Payment;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController(IServiceRequestService _requestService, IMapper _mapper, IUnitOfWork _unitOfWork, IHelperService _helperService, IUserAddressService _addressService, IBookingService _bookingService, IServiceService _serviceService, IPaymentService _paymentService, IUserService _userService, INotificationService _notiService) : ControllerBase
    {
        [HttpPost("AcceptRequest")]
        public async Task<ActionResult> AcceptRequest(BookingAcceptDto acceptance)
        {
            var currentRequest = await _requestService.GetByIdAsync(acceptance.RequestId);
            var service = await _serviceService.GetByIdAsync(currentRequest.ServiceId);

            //validation
            if (await _bookingService.isBooked(acceptance.RequestId))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (currentRequest == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (!await _helperService.ExistsAsync(acceptance.HelperId))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (currentRequest.Status != ServiceRequest.AvailableStatus.Pending.ToString())
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (!await _helperService.isAvailalble(
                    acceptance.HelperId,
                    currentRequest.RequestedStartTime,
                    currentRequest.RequestedStartTime.AddHours((double)currentRequest.RequestedDurationHours.Value)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");


            var newBooking = new BookingCreateDto()
            {
                RequestId = acceptance.RequestId,
                UserId = currentRequest.UserId,
                HelperId = acceptance.HelperId,
                ServiceId = currentRequest.ServiceId,
                ScheduledStartTime = currentRequest.RequestedStartTime,
                ScheduledEndTime = currentRequest.RequestedStartTime.AddHours((double)currentRequest.RequestedDurationHours),
                Status = Booking.AvailableStatus.Accepted.ToString(),
                BookingCreationTime = DateTime.Now,
                EstimatedPrice = currentRequest.RequestedDurationHours * service.BasePrice
            };



            currentRequest.Status = ServiceRequest.AvailableStatus.Accepted.ToString();
            var request = _mapper.Map<ServiceRequest>(currentRequest);

            await _bookingService.CreateAsync(newBooking);
            await _requestService.UpdateAsync(request.RequestId, _mapper.Map<ServiceRequestUpdateDto>(request));
            var latestBooking = await _bookingService.GetUserLatestBooking(newBooking.UserId);

            var newPayment = new PaymentCreateDto
            {
                UserId = currentRequest.UserId,
                BookingId = latestBooking.BookingId,
                Amount = newBooking.EstimatedPrice ?? 0,
                PaymentStatus = Payment.PaymentStatusEnum.Pending.ToString(),
                PaymentMethod = "None"
            };

            _paymentService.CreatePayment(newPayment);
            await _notiService.CreateAsync(new NotificationCreateDto()
            {
                RecipientUserId = request.UserId,
                Title = "An Request has been accepted",
                Message = "Your posted request has been accepted by a helper, please check booking schedule to see detail",
                NotificationType = "BookingAccepted",
                ReferenceId = acceptance.HelperId.ToString()
            });

            return Ok(latestBooking);
        }

        //[HttpPost("CreateBooking")]
        //public async Task<ActionResult> CreateBooking([FromBody] BookingCreateDto newBooking)
        //{
        //    var currentBooking = (await _bookingService.GetAllAsync()).Where(b => b.RequestId == newBooking.RequestId).FirstOrDefault();
        //    var request = await _requestService.GetByIdAsync(newBooking.RequestId.Value);
        //    // validate request
        //    if (currentBooking != null && currentBooking.Status != Booking.AvailableStatus.Cancelled.ToString())
        //        return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
        //    if (newBooking == null)
        //        return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
        //    if (!await _requestService.ExistsAsync(newBooking.RequestId.Value))
        //        return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
        //    if (!await _helperService.ExistsAsync(newBooking.HelperId))
        //        return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
        //    if(request.Status == ServiceRequest.AvailableStatus.Cancelled.ToString())
        //        return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");


        //    newBooking.BookingCreationTime = DateTime.Now;


        //    //create new Booking
        //    Task createTask = _bookingService.CreateAsync(newBooking);


        //    await createTask;
        //    if (!createTask.IsCompleted)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create booking");
        //    }

        //    var basePrice = (await _serviceService.GetByIdAsync(newBooking.ServiceId)).BasePrice;
        //    newBooking.EstimatedPrice = basePrice * (decimal)(newBooking.ScheduledEndTime - newBooking.ScheduledStartTime).TotalHours;

        //    //return new Booking under DetailDto
        //    var latestBooking = await _bookingService.GetUserLatestBooking(newBooking.UserId);
        //    await _paymentService.CreatePayment(new PaymentCreateDto
        //    {
        //        BookingId = latestBooking.BookingId,
        //        UserId = latestBooking.UserId,
        //        Amount = latestBooking.EstimatedPrice ?? 0,
        //        PaymentStatus = Payment.PaymentStatusEnum.Pending.ToString(),
        //        PaymentMethod = "None"
        //    });
        //    return Ok(_mapper.Map<BookingDetailDto>(latestBooking));

        //}

        [HttpPost("BookHelper/{helperId}")]
        //[Authorize]
        public async Task<ActionResult> BookHelperRequest([FromBody] ServiceRequestCreateDto newRequest, [FromRoute] int helperId)
        {
            if (!await _requestService.IsValidatedCreateRequest(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //validate helper id and check if helper is available at time
            if (helperId == null || !(await _helperService.ExistsAsync(helperId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (!await _helperService.isAvailalble(
                    helperId,
                    newRequest.RequestedStartTime,
                    newRequest.RequestedStartTime.AddHours((double)newRequest.RequestedDurationHours.Value)))
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
            await _bookingService.CreateAsync(newBooking);
            var bookingResult = await _bookingService.GetUserLatestBooking(newBooking.UserId);
            await _paymentService.CreatePayment(new PaymentCreateDto
            {
                BookingId = bookingResult.BookingId,
                UserId = bookingResult.UserId,
                Amount = bookingResult.EstimatedPrice ?? 0,
                PaymentStatus = Payment.PaymentStatusEnum.Pending.ToString(),
                PaymentMethod = "None"
            });

            await _notiService.CreateAsync(new NotificationCreateDto()
            {
                RecipientUserId = helperId,
                Title = "new Request",
                Message = "You have a new Request, please check for detail",
                NotificationType = "NewBooking",
                ReferenceId = newRequest.UserId.ToString()
            });

            return Ok(bookingResult);
        }

        [HttpPut("EditBookedRequest")]
        //[Authorized]
        public async Task<ActionResult> UpdateBookedRequest([FromBody] BookingUpdateDto updateBooking)
        {
            // valid request?
            if (!await _requestService.ExistsAsync(updateBooking.RequestId.Value))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            // check if booking exists
            if (updateBooking.BookingId == null || updateBooking.BookingId <= 0 || !(await _bookingService.ExistsAsync(updateBooking.BookingId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            // check if user is the owner of the booking
            var booking = await _bookingService.GetByIdAsync(updateBooking.BookingId);
            if (booking == null || booking.UserId != updateBooking.UserId)
                return StatusCode(StatusCodes.Status403Forbidden, "You are not authorized to update this booking");

            //time must not greater than 8
            if ((updateBooking.ScheduledEndTime - updateBooking.ScheduledStartTime) > TimeSpan.FromHours(8))
                return StatusCode(StatusCodes.Status403Forbidden, "Invalid request");

            // check if helper is available at the new time
            if (updateBooking.HelperId != booking.HelperId && !(await _helperService.isAvailalble(updateBooking.HelperId, updateBooking.ScheduledStartTime, updateBooking.ScheduledEndTime)))
                return StatusCode(StatusCodes.Status400BadRequest, "Helper is not available at the requested time");


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
            updateBooking.EstimatedPrice = basePrice * Math.Ceiling((decimal)(updateBooking.ScheduledEndTime - updateBooking.ScheduledStartTime).TotalHours);
            if (updateBooking.ActualEndTime == null || updateBooking.ActualStartTime == null)
            {
                updateBooking.FinalPrice = updateBooking.EstimatedPrice;
            }
            else
            {
                updateBooking.FinalPrice = basePrice * (decimal)(updateBooking.ActualEndTime - updateBooking.ActualStartTime).Value.TotalHours;
            }

            updateBooking.FreeCancellationDeadline = updateBooking.ScheduledStartTime.AddHours(-12);

            //update booking
            Task updateTask = _bookingService.UpdateAsync(updateBooking.BookingId, updateBooking);
            await updateTask;
            if (!updateTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update booking");
            }

            var payment = await _paymentService.GetPayment(updateBooking.UserId, updateBooking.BookingId);
            payment.Amount = (decimal)updateBooking.EstimatedPrice;

            //cannot update payment

            //return updated booking
            var updatedBooking = await _bookingService.GetByIdAsync(updateBooking.BookingId);
            if (updatedBooking == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Booking not found");
            }

            await _notiService.CreateAsync(new NotificationCreateDto()
            {
                RecipientUserId = updateBooking.HelperId,
                Title = "An Booking has been updated",
                Message = "An Booking of your has been updated, please check for detail",
                NotificationType = "BookingUpdate",
                ReferenceId = updateBooking.UserId.ToString()
            });

            return Ok(updatedBooking);
        }

        [HttpGet("GetBookingByHelperId/{helperId}")]
        public async Task<ActionResult<IEnumerable<GetAllBookingDto>>> GetBookingsByHelperId(int helperId)
        {
            if (helperId <= 0 || !(await _helperService.ExistsAsync(helperId)))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid helper ID");
            }
            var bookings = await _bookingService.getAllbookingByHelperId(helperId);

            return Ok(bookings);

        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatusUpdateDto dto)
        {
            if (id != dto.BookingId)
                return BadRequest("Booking ID mismatch");

            var booking = await _bookingService.GetByIdAsync(id);
            if (booking == null)
                return NotFound("Booking not found");

            if (booking.HelperId != dto.HelperId)
                return Forbid("You are not the assigned helper for this booking");

            if (dto.Status != "InProgress" && dto.Status != "Completed")
                return BadRequest("Invalid status");

            var updated = await _bookingService.UpdateBookingStatusAsync(dto);
            // TODO: Gửi SignalR tới user
            return Ok(updated);
        }

        [HttpGet("getBooking/{id}")]
        public async Task<ActionResult> GetBooking(int id)
        {
            var booking = await _bookingService.GetByIdAsync(id);
            return Ok(booking);
        }

        [HttpPost("CancelBooking")]
        public async Task<ActionResult> CancelBooking([FromBody] BookingCancelDto cancellation)
        {
            if (cancellation == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (cancellation.BookingId == null || !await _bookingService.ExistsAsync(cancellation.BookingId))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if (cancellation.CancellationReason == null || cancellation.CancelledBy == null)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            var currentBooking = _mapper.Map<Booking>(await _bookingService.GetByIdAsync(cancellation.BookingId));


            if (currentBooking.FreeCancellationDeadline != null && DateTime.Now > currentBooking.FreeCancellationDeadline)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            currentBooking.CancellationReason = cancellation.CancellationReason;
            currentBooking.CancelledBy = cancellation.CancelledBy;
            currentBooking.Status = Booking.AvailableStatus.Cancelled.ToString();

            var currentRequest = _mapper.Map<ServiceRequest>(await _requestService.GetByIdAsync(currentBooking.RequestId.Value));
            currentRequest.Status = ServiceRequest.AvailableStatus.Cancelled.ToString();

            await _bookingService.UpdateAsync(cancellation.BookingId, _mapper.Map<BookingUpdateDto>(currentBooking));
            await _requestService.UpdateAsync(currentRequest.RequestId, _mapper.Map<ServiceRequestUpdateDto>(currentRequest));

            await _notiService.CreateAsync(new NotificationCreateDto()
            {
                RecipientUserId = currentBooking.HelperId,
                Title = "An Booking has been cancelled",
                Message = "Your Booking has been cancelled, please check for more detail",
                NotificationType = "BookingCancelled",
                ReferenceId = currentBooking.UserId.ToString()
            });

            return Ok("Booking cancelled successfully");
        }

        [HttpGet("GetUserPendingBooking/{id}")]
        public async Task<ActionResult> getPendingBookingByUserId(int id)
        {
            if (id <= 0 || !(await _userService.ExistsAsync(id)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid user ID");
            var bookings = await _bookingService.GetPendingBookingByUserId(id);
            return Ok(bookings);
        }

        [HttpGet("GetUserSchedule/{id}")]
        public async Task<ActionResult> GetUserSchedule(int id)
        {
            if (id <= 0 || !(await _userService.ExistsAsync(id)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid user ID");
            var bookings = await _bookingService.GetUserSchedule(id);
            return Ok(bookings);
        }

        [HttpGet("GetHelperSchedule/{id}")]
        public async Task<ActionResult> GetHelperSchedule(int id)
        {
            if (id <= 0 || !(await _helperService.ExistsAsync(id)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid user ID");
            var bookings = await _bookingService.GetHelperSchedule(id);
            return Ok(bookings);
        }

        [HttpGet("GetHelperBookingServiceNames/{id}")]
        public async Task<ActionResult> getServiceNames(int id)
        {
            if (id <= 0 || !(await _helperService.ExistsAsync(id)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid user ID");
            var serviceNames = await _bookingService.GetReviewServiceNames(id);
            return Ok(serviceNames);
        }
    }
}
