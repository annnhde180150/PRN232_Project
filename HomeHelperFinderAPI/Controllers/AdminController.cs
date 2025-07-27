using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Admin;
using Services.DTOs.Notification;
using Services.Interfaces;
using System.Threading.Channels;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly INotificationService _notificationService;
        private readonly IOtpService _otpService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, INotificationService notificationService, IOtpService otpService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _notificationService = notificationService;
            _otpService = otpService;
            _logger = logger;
        }

        [HttpPut("profile/{adminId}")]
        public async Task<IActionResult> EditProfile(int adminId, [FromBody] AdminUpdateDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Editing profile for admin ID: {adminId}");

                // Validate input
                if (updateDto == null)
                {
                    return BadRequest("Update data cannot be null");
                }

                // Check if admin exists
                if (!await _adminService.ExistsAsync(adminId))
                {
                    return NotFound($"Admin with ID {adminId} not found");
                }

                // Update admin profile
                var updatedAdmin = await _adminService.UpdateAsync(adminId, updateDto);

                try
                {
                    var notificationDto = new NotificationCreateDto
                    {
                        RecipientUserId = adminId, 
                        Title = "Admin Profile Updated",
                        Message = "Your admin profile has been successfully updated.",
                        NotificationType = "AdminProfileUpdate",
                        ReferenceId = adminId.ToString()
                    };
                    await _notificationService.CreateAsync(notificationDto);
                }
                catch (Exception notificationEx)
                {
                    _logger.LogWarning($"Failed to send admin profile update notification to admin {adminId}: {notificationEx.Message}");
                }

                return Ok(updatedAdmin);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid argument when editing profile for admin {adminId}: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error editing profile for admin {adminId}: {ex.Message}");
                return StatusCode(500, "An error occurred while updating the admin profile");
            }
        }

        [HttpGet("profile/{adminId}")]
        public async Task<IActionResult> GetProfile(int adminId)
        {
            try
            {
                _logger.LogInformation($"Getting profile for admin ID: {adminId}");

                // Check if admin exists
                if (!await _adminService.ExistsAsync(adminId))
                {
                    return NotFound($"Admin with ID {adminId} not found");
                }

                // Get admin profile
                var adminProfile = await _adminService.GetByIdAsync(adminId);

                return Ok(adminProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting profile for admin {adminId}: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the admin profile");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] AdminForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                _logger.LogInformation($"Processing forgot password request for admin email: {forgotPasswordDto.Email}");

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

                // Check if admin exists with this email
                var admin = await _adminService.GetAdminByEmailAsync(forgotPasswordDto.Email);
                if (admin == null)
                {
                    // Don't reveal if email exists or not for security
                    _logger.LogWarning($"Forgot password request for non-existent admin email: {forgotPasswordDto.Email}");
                    return Ok(new
                    {
                        Success = true,
                        Message = "If the email address exists in our system, you will receive a password reset OTP shortly."
                    });
                }

                // Generate and send OTP
                var otpCode = await _otpService.GenerateAndSendOtpAsync(forgotPasswordDto.Email);

                _logger.LogInformation($"OTP sent successfully to admin email {forgotPasswordDto.Email}");

                return Ok(new
                {
                    Success = true,
                    Message = "If the email address exists in our system, you will receive a password reset OTP shortly.",
                    Email = forgotPasswordDto.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing forgot password request for admin email {forgotPasswordDto.Email}: {ex.Message}");
                return StatusCode(500, "An error occurred while processing the forgot password request");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] AdminResetPasswordDto resetPasswordDto)
        {
            try
            {
                _logger.LogInformation($"Processing password reset for admin email: {resetPasswordDto.Email}");

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

                // Check if admin exists with this email
                var admin = await _adminService.GetAdminByEmailAsync(resetPasswordDto.Email);
                if (admin == null)
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
                var passwordReset = await _adminService.ResetPasswordAsync(resetPasswordDto.Email, resetPasswordDto.NewPassword);

                if (passwordReset)
                {
                    // Send notification
                    try
                    {
                        var notificationDto = new NotificationCreateDto
                        {
                            RecipientUserId = admin.Id, 
                            Title = "Admin Password Reset",
                            Message = "Your admin password has been successfully reset. If you didn't make this change, please contact system administrator immediately.",
                            NotificationType = "AdminPasswordReset",
                            ReferenceId = admin.Id.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                    }
                    catch (Exception notificationEx)
                    {
                        _logger.LogWarning($"Failed to send admin password reset notification to admin {admin.Id}: {notificationEx.Message}");
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
                _logger.LogError($"Error resetting password for admin email {resetPasswordDto.Email}: {ex.Message}");
                return StatusCode(500, "An error occurred while resetting the password");
            }
        }

        [HttpPut("change-password/{adminId}")]
        public async Task<IActionResult> ChangePassword(int adminId, [FromBody] AdminChangePasswordDto changePasswordDto)
        {
            try
            {
                // Validate input
                if (changePasswordDto == null)
                {
                    return BadRequest("Change password data cannot be null");
                }

                // Check if admin exists
                if (!await _adminService.ExistsAsync(adminId))
                {
                    return NotFound($"Admin with ID {adminId} not found");
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
                var passwordChanged = await _adminService.ChangePasswordAsync(
                    adminId, 
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
                            RecipientUserId = adminId, 
                            Title = "Admin Password Changed",
                            Message = "Your admin password has been successfully changed. If you didn't make this change, please contact system administrator immediately.",
                            NotificationType = "AdminPasswordChange",
                            ReferenceId = adminId.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                    }
                    catch (Exception notificationEx)
                    {
                        _logger.LogWarning($"Failed to send admin password change notification to admin {adminId}: {notificationEx.Message}");
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
                _logger.LogError($"Error changing password for admin {adminId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }
    }
} 