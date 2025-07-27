using HomeHelperFinderAPI.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.User;
using Services.DTOs.Notification;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IOtpService _otpService;
        private readonly ILogger<UserController> _logger;
        private readonly IUserAddressService _addressService;

        public UserController(IUserService userService, INotificationService notificationService, IOtpService otpService, ILogger<UserController> logger, IUserAddressService addressService)
        {
            _userService = userService;
            _notificationService = notificationService;
            _otpService = otpService;
            _logger = logger;
            _addressService = addressService;
        }

      
        [HttpPut("profile/{userId}")]
        public async Task<IActionResult> EditProfile(int userId, [FromBody] UserUpdateDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Editing profile for user ID: {userId}");

                if (updateDto == null)
                {
                    return BadRequest("Update data cannot be null");
                }

                if (!await _userService.ExistsAsync(userId))
                {
                    return NotFound($"User with ID {userId} not found");
                }

                if (!await _userService.IsEmailUniqueAsync(updateDto.Email, userId))
                {
                    ModelState.AddModelError("Email", "Email is already registered.");
                    return BadRequest(ModelState);
                }

                if (!await _userService.IsPhoneUniqueAsync(updateDto.PhoneNumber, userId))
                {
                    ModelState.AddModelError("PhoneNumber", "Phone number is already registered.");
                    return BadRequest(ModelState);
                }

                var updatedUser = await _userService.UpdateAsync(userId, updateDto);

                // If address update is included, update the address
                if (updateDto.DefaultAddress != null && updateDto.DefaultAddressId.HasValue)
                {
                    await _addressService.UpdateAsync(updateDto.DefaultAddressId.Value, updateDto.DefaultAddress);
                }

                // Send notification
                try
                {
                    var notificationDto = new NotificationCreateDto
                    {
                        RecipientUserId = userId,
                        Title = "Profile Updated",
                        Message = "Your profile has been successfully updated.",
                        NotificationType = "ProfileUpdate",
                        ReferenceId = userId.ToString()
                    };

                    await _notificationService.CreateAsync(notificationDto);
                }
                catch (Exception notificationEx)
                {
                    _logger.LogWarning($"Failed to send profile update notification to user {userId}: {notificationEx.Message}");
                }

                return Ok(updatedUser);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid argument when editing profile for user {userId}: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error editing profile for user {userId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }

     
        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            try
            {
                _logger.LogInformation($"Getting profile for user ID: {userId}");

                if (!await _userService.ExistsAsync(userId))
                {
                    return NotFound($"User with ID {userId} not found");
                }

                var userProfile = await _userService.GetByIdAsync(userId);

                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting profile for user {userId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] UserForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                _logger.LogInformation($"Processing forgot password request for user email: {forgotPasswordDto.Email}");

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

                // Check if user exists with this email
                var user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    // Don't reveal if email exists or not for security
                    _logger.LogWarning($"Forgot password request for non-existent user email: {forgotPasswordDto.Email}");
                    return Ok(new
                    {
                        Success = true,
                        Message = "If the email address exists in our system, you will receive a password reset OTP shortly."
                    });
                }

                // Generate and send OTP
                var otpCode = await _otpService.GenerateAndSendOtpAsync(forgotPasswordDto.Email);

                _logger.LogInformation($"OTP sent successfully to user email {forgotPasswordDto.Email}");

                return Ok(new
                {
                    Success = true,
                    Message = "If the email address exists in our system, you will receive a password reset OTP shortly.",
                    Email = forgotPasswordDto.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing forgot password request for user email {forgotPasswordDto.Email}: {ex.Message}");
                return StatusCode(500, "An error occurred while processing the forgot password request");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] UserResetPasswordDto resetPasswordDto)
        {
            try
            {
                _logger.LogInformation($"Processing password reset for user email: {resetPasswordDto.Email}");

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

                // Check if user exists with this email
                var user = await _userService.GetUserByEmailAsync(resetPasswordDto.Email);
                if (user == null)
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
                var passwordReset = await _userService.ResetPasswordAsync(resetPasswordDto.Email, resetPasswordDto.NewPassword);

                if (passwordReset)
                {
                    // Send notification
                    try
                    {
                        var notificationDto = new NotificationCreateDto
                        {
                            RecipientUserId = user.Id,
                            Title = "Password Reset",
                            Message = "Your password has been successfully reset. If you didn't make this change, please contact support immediately.",
                            NotificationType = "PasswordReset",
                            ReferenceId = user.Id.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                    }
                    catch (Exception notificationEx)
                    {
                        _logger.LogWarning($"Failed to send user password reset notification to user {user.Id}: {notificationEx.Message}");
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
                _logger.LogError($"Error resetting password for user email {resetPasswordDto.Email}: {ex.Message}");
                return StatusCode(500, "An error occurred while resetting the password");
            }
        }

        [HttpPut("change-password/{userId}")]
        public async Task<IActionResult> ChangePassword(int userId, [FromBody] UserChangePasswordDto changePasswordDto)
        {
            try
            {
                _logger.LogInformation($"Changing password for user ID: {userId}");

                if (changePasswordDto == null)
                {
                    return BadRequest("Change password data cannot be null");
                }

                if (!await _userService.ExistsAsync(userId))
                {
                    return NotFound($"User with ID {userId} not found");
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
                var passwordChanged = await _userService.ChangePasswordAsync(
                    userId, 
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
                            RecipientUserId = userId,
                            Title = "Password Changed",
                            Message = "Your password has been successfully changed. If you didn't make this change, please contact support immediately.",
                            NotificationType = "PasswordChange",
                            ReferenceId = userId.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                        _logger.LogInformation($"Password change notification sent to user ID: {userId}");
                    }
                    catch (Exception notificationEx)
                    {
                        _logger.LogWarning($"Failed to send password change notification to user {userId}: {notificationEx.Message}");
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
                _logger.LogError($"Error changing password for user {userId}: {ex.Message}");
                return StatusCode(500, "An error occurred while changing the password");
            }
        }
    }
} 