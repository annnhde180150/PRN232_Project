using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Implements;
using Services.Interfaces;
using Services.DTOs.Helper;
using Services.DTOs.Notification;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelperController : ControllerBase
    {
        private readonly IHelperService _helperService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<HelperController> _logger;  
        public HelperController(IHelperService helperService, INotificationService notificationService, ILogger<HelperController> logger)
        {
            _helperService = helperService;
            _notificationService = notificationService;
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

        [HttpPut("profile/{helperId}")]
        public async Task<IActionResult> EditProfile(int helperId, [FromBody] HelperUpdateDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Editing profile for helper ID: {helperId}");

                if (updateDto == null)
                {
                    return BadRequest("Update data cannot be null");
                }

                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }

                var updatedHelper = await _helperService.UpdateAsync(helperId, updateDto);

                // Send notification
                try
                {
                    var notificationDto = new NotificationCreateDto
                    {
                        RecipientHelperId = helperId,
                        Title = "Profile Updated",
                        Message = "Your helper profile has been successfully updated.",
                        NotificationType = "ProfileUpdate",
                        ReferenceId = helperId.ToString()
                    };

                    await _notificationService.CreateAsync(notificationDto);
                }
                catch (Exception notificationEx)
                {
                    _logger.LogWarning($"Failed to send profile update notification to helper {helperId}: {notificationEx.Message}");
                }

                return Ok(updatedHelper);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid argument when editing profile for helper {helperId}: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error editing profile for helper {helperId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }

        [HttpGet("profile/{helperId}")]
        public async Task<IActionResult> GetProfile(int helperId)
        {
            try
            {
                _logger.LogInformation($"Getting profile for helper ID: {helperId}");

                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }

                var helperProfile = await _helperService.GetByIdAsync(helperId);

                return Ok(helperProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting profile for helper {helperId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }

        [HttpPut("change-password/{helperId}")]
        public async Task<IActionResult> ChangePassword(int helperId, [FromBody] HelperChangePasswordDto changePasswordDto)
        {
            try
            {
                _logger.LogInformation($"Changing password for helper ID: {helperId}");

                if (changePasswordDto == null)
                {
                    return BadRequest("Change password data cannot be null");
                }
                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }

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
                    // Send notification
                    try
                    {
                        var notificationDto = new NotificationCreateDto
                        {
                            RecipientHelperId = helperId,
                            Title = "Password Changed",
                            Message = "Your password has been successfully changed. If you didn't make this change, please contact support immediately.",
                            NotificationType = "PasswordChange",
                            ReferenceId = helperId.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                        _logger.LogInformation($"Password change notification sent to helper ID: {helperId}");
                    }
                    catch (Exception notificationEx)
                    {
                        _logger.LogWarning($"Failed to send password change notification to helper {helperId}: {notificationEx.Message}");
                    }

                    return Ok("Password changed successfully");
                }
                else
                {
                    return BadRequest("Current password is incorrect");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error changing password for helper {helperId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }

        [HttpGet("GetHelperServices/{id}")]
        public async Task<ActionResult> GetHelperServiecs(int id)
        {
            var services = await _helperService.GetHelperAvailableService(id);
            return Ok(services);
        }

    }
} 