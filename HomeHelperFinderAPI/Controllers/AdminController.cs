using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Admin;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
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

                return Ok(new
                {
                    Success = true,
                    Message = "Admin profile updated successfully",
                    Data = updatedAdmin
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid argument when editing profile for admin {adminId}: {ex.Message}");
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error editing profile for admin {adminId}: {ex.Message}");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while updating the admin profile"
                });
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

                return Ok(new
                {
                    Success = true,
                    Data = adminProfile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting profile for admin {adminId}: {ex.Message}");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the admin profile"
                });
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
                _logger.LogError($"Error changing password for admin {adminId}: {ex.Message}");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while changing the password"
                });
            }
        }
    }
} 