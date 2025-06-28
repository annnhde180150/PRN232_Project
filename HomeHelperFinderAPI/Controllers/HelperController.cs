using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Implements;
using Services.Interfaces;


namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelperController : ControllerBase
    {
        private readonly IHelperService _helperService;
        private readonly ILogger<HelperController> _logger;  
        public HelperController(IHelperService helperService, ILogger<HelperController> logger)
        {
            _helperService = helperService;
            _logger = logger;
        }

        [HttpPost("OnlineRequest")]
        public async Task<IActionResult> OnlineRequest([FromBody] int helperId)
        {
            var result = await _helperService.SetHelperStatusOnlineAsync(helperId);
            if (result)
            {
                _logger.LogInformation($"Helper with ID {helperId} set to online.");
                return Ok(new { message = "Helper is now online." });
            }
            else
            {
                _logger.LogWarning($"Failed to set helper with ID {helperId} to online.");
                return BadRequest(new { message = "Failed to set helper status to online." });
            }

        }
        [HttpPost("OfflineRequest")]
        public async Task<IActionResult> OfflineRequest([FromBody] int helperId)
        {
            var result = await _helperService.SetHelperStatusOfflineAsync(helperId);
            if (result)
            {
                _logger.LogInformation($"Helper with ID {helperId} set to offline.");
                return Ok(new { message = "Helper is now offline." });
            }
            else
            {
                _logger.LogWarning($"Failed to set helper with ID {helperId} to offline.");
                return BadRequest(new { message = "Failed to set helper status to offline." });
            }
        }
        [HttpPost("BusyRequest")]
        public async Task<IActionResult> BusyRequest([FromBody] int helperId)
        {
            var result = await _helperService.SetHelperStatusBusyAsync(helperId);
            if (result)
            {
                _logger.LogInformation($"Helper with ID {helperId} set to busy.");
                return Ok(new { message = "Helper is now busy." });
            }
            else
            {
                _logger.LogWarning($"Failed to set helper with ID {helperId} to busy.");
                return BadRequest(new { message = "Failed to set helper status to busy." });
            }
        }
        [HttpGet("ViewIncome/{id}")]
        public async Task<IActionResult> ViewIncome(int id)
        {
            var incomeDetails = await _helperService.HelperViewIncomeAsync(id);
            if (incomeDetails != null)
            {
                _logger.LogInformation($"Income details retrieved for helper with ID {id}.");
                return Ok(incomeDetails);
            }
            else
            {
                _logger.LogWarning($"No income details found for helper with ID {id}.");
                return NotFound(new { message = "No income details found for this helper." });
            }
        }

    }
} 