using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Profile;
using Services.Interfaces;
using System.Security.Claims;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ProfileManagementController : ControllerBase
{
    private readonly IProfileManagementService _profileManagementService;
    private readonly ILogger<ProfileManagementController> _logger;

    public ProfileManagementController(
        IProfileManagementService profileManagementService,
        ILogger<ProfileManagementController> logger)
    {
        _profileManagementService = profileManagementService;
        _logger = logger;
    }

    [HttpPost("ban")]
    public async Task<ActionResult<ProfileStatusDto>> BanProfile([FromBody] BanProfileDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Set admin ID from current user
            dto.AdminId = GetCurrentAdminId();

            var result = await _profileManagementService.BanProfileAsync(dto);
            
            _logger.LogInformation($"Profile banned successfully: {dto.ProfileType} ID {dto.ProfileId} by Admin ID {dto.AdminId}");
            
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning($"Invalid ban request: {ex.Message}");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error banning {dto?.ProfileType} profile {dto?.ProfileId}");
            return StatusCode(500, "An error occurred while banning the profile");
        }
    }

    [HttpPost("unban")]
    public async Task<ActionResult<ProfileStatusDto>> UnbanProfile([FromBody] UnbanProfileDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Set admin ID from current user
            dto.AdminId = GetCurrentAdminId();

            var result = await _profileManagementService.UnbanProfileAsync(dto);
            
            _logger.LogInformation($"Profile unbanned successfully: {dto.ProfileType} ID {dto.ProfileId} by Admin ID {dto.AdminId}");
            
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning($"Invalid unban request: {ex.Message}");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error unbanning {dto?.ProfileType} profile {dto?.ProfileId}");
            return StatusCode(500, "An error occurred while unbanning the profile");
        }
    }

    [HttpGet("status/{profileId}/{profileType}")]
    public async Task<ActionResult<ProfileStatusDto>> GetProfileStatus(int profileId, string profileType)
    {
        try
        {
            if (string.IsNullOrEmpty(profileType) || 
                (!profileType.Equals("User", StringComparison.OrdinalIgnoreCase) && 
                 !profileType.Equals("Helper", StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest("ProfileType must be 'User' or 'Helper'");
            }

            var result = await _profileManagementService.GetProfileStatusAsync(profileId, profileType);
            
            if (result == null)
                return NotFound($"{profileType} with ID {profileId} not found");
                
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting status for {profileType} profile {profileId}");
            return StatusCode(500, "An error occurred while retrieving profile status");
        }
    }

    [HttpGet("banned")]
    public async Task<ActionResult<IEnumerable<ProfileStatusDto>>> GetBannedProfiles()
    {
        try
        {
            var result = await _profileManagementService.GetBannedProfilesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving banned profiles");
            return StatusCode(500, "An error occurred while retrieving banned profiles");
        }
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<ProfileStatusDto>>> GetActiveProfiles()
    {
        try
        {
            var result = await _profileManagementService.GetActiveProfilesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active profiles");
            return StatusCode(500, "An error occurred while retrieving active profiles");
        }
    }

    [HttpGet("banned-status/{profileId}/{profileType}")]
    public async Task<ActionResult<bool>> IsProfileBanned(int profileId, string profileType)
    {
        try
        {
            if (string.IsNullOrEmpty(profileType) || 
                (!profileType.Equals("User", StringComparison.OrdinalIgnoreCase) && 
                 !profileType.Equals("Helper", StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest("ProfileType must be 'User' or 'Helper'");
            }

            var result = await _profileManagementService.IsProfileBannedAsync(profileId, profileType);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error checking ban status for {profileType} profile {profileId}");
            return StatusCode(500, "An error occurred while checking profile ban status");
        }
    }

    [HttpPost("bulk-ban")]
    public async Task<ActionResult<IEnumerable<ProfileStatusDto>>> BulkBanProfiles([FromBody] IEnumerable<BanProfileDto> requests)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var results = new List<ProfileStatusDto>();
            var adminId = GetCurrentAdminId();

            foreach (var request in requests)
            {
                try
                {
                    request.AdminId = adminId;
                    var result = await _profileManagementService.BanProfileAsync(request);
                    results.Add(result);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error banning {request.ProfileType} profile {request.ProfileId} in bulk operation");
                    // Continue with other profiles even if one fails
                }
            }

            _logger.LogInformation($"Bulk ban operation completed. {results.Count} profiles processed by Admin ID {adminId}");
            
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk ban operation");
            return StatusCode(500, "An error occurred during bulk ban operation");
        }
    }

    [HttpPost("bulk-unban")]
    public async Task<ActionResult<IEnumerable<ProfileStatusDto>>> BulkUnbanProfiles([FromBody] IEnumerable<UnbanProfileDto> requests)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var results = new List<ProfileStatusDto>();
            var adminId = GetCurrentAdminId();

            foreach (var request in requests)
            {
                try
                {
                    request.AdminId = adminId;
                    var result = await _profileManagementService.UnbanProfileAsync(request);
                    results.Add(result);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error unbanning {request.ProfileType} profile {request.ProfileId} in bulk operation");
                    // Continue with other profiles even if one fails
                }
            }

            _logger.LogInformation($"Bulk unban operation completed. {results.Count} profiles processed by Admin ID {adminId}");
            
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk unban operation");
            return StatusCode(500, "An error occurred during bulk unban operation");
        }
    }

    private int GetCurrentAdminId()
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !int.TryParse(adminIdClaim, out int adminId))
        {
            throw new UnauthorizedAccessException("Invalid admin credentials");
        }
        return adminId;
    }
}