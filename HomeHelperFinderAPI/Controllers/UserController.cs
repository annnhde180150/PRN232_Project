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
        private readonly ILogger<UserController> _logger;
        private readonly IUserAddressService _addressService;

        public UserController(IUserService userService, INotificationService notificationService, ILogger<UserController> logger, IUserAddressService addressService)
        {
            _userService = userService;
            _notificationService = notificationService;
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

                var updatedUser = await _userService.UpdateAsync(userId, updateDto);

                // If address update is included, update the address
                if (updateDto.DefaultAddress != null && updateDto.DefaultAddressId.HasValue)
                {
                    updateDto.DefaultAddress.AddressId = updateDto.DefaultAddressId.Value;
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