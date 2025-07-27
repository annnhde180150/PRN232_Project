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
        private readonly IServiceService _serviceService;
        private readonly IOtpService _otpService;
        private readonly ILogger<HelperController> _logger;  
        public HelperController(IHelperService helperService, INotificationService notificationService, IServiceService serviceService, IOtpService otpService, ILogger<HelperController> logger)
        {
            _helperService = helperService;
            _notificationService = notificationService;
            _serviceService = serviceService;
            _otpService = otpService;
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

                // Validate skills if provided
                if (updateDto.Skills != null)
                {
                    foreach (var skill in updateDto.Skills)
                    {
                        if (skill.ServiceId <= 0)
                        {
                            return BadRequest("Invalid service ID in skills");
                        }
                        
                        // Validate that the service exists
                        var service = await _serviceService.GetByIdAsync(skill.ServiceId);
                        if (service == null)
                        {
                            return BadRequest($"Service with ID {skill.ServiceId} does not exist");
                        }
                    }
                }

                // Validate work areas if provided
                if (updateDto.WorkAreas != null)
                {
                    foreach (var workArea in updateDto.WorkAreas)
                    {
                        if (string.IsNullOrEmpty(workArea.City) || string.IsNullOrEmpty(workArea.District))
                        {
                            return BadRequest("City and District are required for work areas");
                        }
                    }
                }

                // Validate documents if provided
                if (updateDto.Documents != null)
                {
                    foreach (var document in updateDto.Documents)
                    {
                        if (string.IsNullOrEmpty(document.DocumentType) || string.IsNullOrEmpty(document.DocumentUrl))
                        {
                            return BadRequest("Document type and URL are required for documents");
                        }
                    }
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
                return StatusCode(500, "An error occurred while updating the profile");
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

                if (helperProfile == null)
                {
                    return NotFound($"Helper profile with ID {helperId} not found");
                }

                return Ok(helperProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting profile for helper {helperId}: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the profile");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] HelperForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                _logger.LogInformation($"Processing forgot password request for helper email: {forgotPasswordDto.Email}");

                if (forgotPasswordDto == null)
                {
                    return BadRequest("Forgot password data cannot be null");
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

                // Check if helper exists with this email
                var helper = await _helperService.GetHelperByEmailAsync(forgotPasswordDto.Email);
                if (helper == null)
                {
                    // Don't reveal if email exists or not for security
                    _logger.LogWarning($"Forgot password request for non-existent helper email: {forgotPasswordDto.Email}");
                    return Ok(new
                    {
                        Success = true,
                        Message = "If the email address exists in our system, you will receive a password reset OTP shortly."
                    });
                }

                // Generate and send OTP
                var otpCode = await _otpService.GenerateAndSendOtpAsync(forgotPasswordDto.Email);

                _logger.LogInformation($"OTP sent successfully to helper email {forgotPasswordDto.Email}");

                return Ok(new
                {
                    Success = true,
                    Message = "If the email address exists in our system, you will receive a password reset OTP shortly.",
                    Email = forgotPasswordDto.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing forgot password request for helper email {forgotPasswordDto.Email}: {ex.Message}");
                return StatusCode(500, "An error occurred while processing the forgot password request");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] HelperResetPasswordDto resetPasswordDto)
        {
            try
            {
                _logger.LogInformation($"Processing password reset for helper email: {resetPasswordDto.Email}");

                if (resetPasswordDto == null)
                {
                    return BadRequest("Reset password data cannot be null");
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

                // Check if helper exists with this email
                var helper = await _helperService.GetHelperByEmailAsync(resetPasswordDto.Email);
                if (helper == null)
                {
                    return BadRequest("Invalid email address");
                }

                // Verify OTP first
                var otpVerified = await _otpService.VerifyOtpAsync(resetPasswordDto.Email, resetPasswordDto.OtpCode);
                if (!otpVerified)
                {
                    return BadRequest("Invalid or expired OTP code");
                }

                // Reset password
                var passwordReset = await _helperService.ResetPasswordAsync(resetPasswordDto.Email, resetPasswordDto.NewPassword);

                if (passwordReset)
                {
                    // Send notification
                    try
                    {
                        var notificationDto = new NotificationCreateDto
                        {
                            RecipientHelperId = helper.Id,
                            Title = "Password Reset",
                            Message = "Your password has been successfully reset. If you didn't make this change, please contact support immediately.",
                            NotificationType = "PasswordReset",
                            ReferenceId = helper.Id.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                    }
                    catch (Exception notificationEx)
                    {
                        _logger.LogWarning($"Failed to send helper password reset notification to helper {helper.Id}: {notificationEx.Message}");
                    }

                    return Ok("Password reset successfully");
                }
                else
                {
                    return BadRequest("Failed to reset password");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error resetting password for helper email {resetPasswordDto.Email}: {ex.Message}");
                return StatusCode(500, "An error occurred while resetting the password");
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

                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                // Check if helper exists
                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
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

        [HttpGet("search")]
        public async Task<IActionResult> searchHelper (int serviceId , string? page , string? pageSize)
        {
            try
            {
                _logger.LogInformation($"Searching for helpers for service ID: {serviceId}");
                if (serviceId <= 0)
                {
                    return BadRequest("Invalid service ID");
                }
                var helpers = await _helperService.GetHelpersByServiceAsync(serviceId, page, pageSize);
                if (helpers == null || !helpers.Any())
                {
                    return NotFound($"No helpers found for service ID {serviceId}");
                }
                return Ok(helpers);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching for helpers for service ID {serviceId}: {ex.Message}");
                return StatusCode(500, "An error occurred while searching for helpers");
            }

        }

        [HttpPut("addMoneyToWallet")]
        public async Task<IActionResult> addMoneyToWallet([FromBody] HelperAddMoneyToWalletDto helperAddMoneyToWalletDto)
        {
            try
            {
                _logger.LogInformation($"Adding money to wallet for helper ID: {helperAddMoneyToWalletDto.HelperId}");
                if (helperAddMoneyToWalletDto == null || helperAddMoneyToWalletDto.HelperId <= 0 || helperAddMoneyToWalletDto.Amount <= 0)
                {
                    return BadRequest("Invalid input data");
                }
                var result = await _helperService.AddMoneyToWalletAsync(helperAddMoneyToWalletDto);
                if (result.IsSuccess)
                {
                    _logger.LogInformation($"Successfully added money to wallet for helper ID: {helperAddMoneyToWalletDto.HelperId}");
                    return Ok(result);
                }
                else
                {
                    _logger.LogWarning($"Failed to add money to wallet for helper ID: {helperAddMoneyToWalletDto.HelperId}");
                    return BadRequest("Failed to add money to wallet.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding money to wallet for helper {helperAddMoneyToWalletDto.HelperId}: {ex.Message}");
                return StatusCode(500, "An error occurred while adding money to the wallet");
            }
        }
    }
} 