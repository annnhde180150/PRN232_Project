using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

    }
}
