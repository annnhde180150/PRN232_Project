using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.DTOs.Payment;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IPaymentService _paymentService;
        public PaymentController(INotificationService notificationService,IPaymentService paymentService)
        {
            _notificationService = notificationService;
            _paymentService = paymentService;
        }
        [HttpGet("GetPayment")]
        public async Task<IActionResult> GetPayment(int userId,int bookingId)
        {
            if (userId == 0 || bookingId == 0)
            {
                return BadRequest("Invalid payment request data.");
            }
            try
            {
                var paymentDto = await _paymentService.GetPayment(userId, bookingId);
                return Ok(paymentDto);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request: {ex.Message}");
            }
        }

        [HttpPut("UpdatePayment")]
        public async Task<IActionResult> UpdatePaymentStatus([FromBody] UpdatePaymentRequestDto updatePaymentRequestDto)
        {
            if (updatePaymentRequestDto.PaymentId <= 0 || string.IsNullOrEmpty(updatePaymentRequestDto.action) || updatePaymentRequestDto.PaymentDate == null)
            {
                return BadRequest("Invalid payment update request data.");
            }
            try
            {
                var updatedPayment = await _paymentService.UpdatePaymentStatus(updatePaymentRequestDto.PaymentId, updatePaymentRequestDto.action,updatePaymentRequestDto.PaymentDate);
                if (updatedPayment == null)
                {
                    return NotFound($"Payment with ID {updatePaymentRequestDto.PaymentId} not found.");
                }
                return Ok(updatedPayment);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request: {ex.Message}");
            }
        }

        [HttpGet("GetPayment/{userId}")]
        public async Task<IActionResult> GetPaymentByUserId(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("Invalid user ID.");
            }
            try
            {
                var paymentStatusList = await _paymentService.GetPaymentByUserId(userId);
                return Ok(paymentStatusList);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request: {ex.Message}");
            }
        }

    }
}
