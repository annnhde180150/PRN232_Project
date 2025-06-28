using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Implements;
using Services.Interfaces;
using Services.DTOs.Helper;

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

        [HttpPut("profile/{helperId}")]
        public async Task<IActionResult> EditProfile(int helperId, [FromBody] HelperUpdateDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Editing profile for helper ID: {helperId}");

                // Validate input
                if (updateDto == null)
                {
                    return BadRequest("Update data cannot be null");
                }

                // Check if helper exists
                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }

                // Update helper profile
                var updatedHelper = await _helperService.UpdateAsync(helperId, updateDto);

                return Ok(new
                {
                    Success = true,
                    Message = "Helper profile updated successfully",
                    Data = updatedHelper
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid argument when editing profile for helper {helperId}: {ex.Message}");
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error editing profile for helper {helperId}: {ex.Message}");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while updating the helper profile"
                });
            }
        }

        [HttpGet("profile/{helperId}")]
        public async Task<IActionResult> GetProfile(int helperId)
        {
            try
            {
                _logger.LogInformation($"Getting profile for helper ID: {helperId}");

                // Check if helper exists
                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }

                // Get helper profile
                var helperProfile = await _helperService.GetByIdAsync(helperId);

                return Ok(new
                {
                    Success = true,
                    Data = helperProfile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting profile for helper {helperId}: {ex.Message}");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the helper profile"
                });
            }
        }

        [HttpPut("change-password/{helperId}")]
        public async Task<IActionResult> ChangePassword(int helperId, [FromBody] HelperChangePasswordDto changePasswordDto)
        {
            try
            {
                _logger.LogInformation($"Changing password for helper ID: {helperId}");

                // Validate input
                if (changePasswordDto == null)
                {
                    return BadRequest("Change password data cannot be null");
                }

                // Check if helper exists
                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                // Change password
                var passwordChanged = await _helperService.ChangePasswordAsync(
                    helperId, 
                    changePasswordDto.CurrentPassword, 
                    changePasswordDto.NewPassword
                );

                if (passwordChanged)
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Password changed successfully"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Current password is incorrect"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error changing password for helper {helperId}: {ex.Message}");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while changing the password"
                });
            }
        }

    }
} 