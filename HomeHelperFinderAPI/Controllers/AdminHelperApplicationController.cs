using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Admin;
using Services.Interfaces;
using System.Security.Claims;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/admin/helpers")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminHelperApplicationController : ControllerBase
    {
        private readonly IHelperService _helperService;
        private readonly ILogger<AdminHelperApplicationController> _logger;

        public AdminHelperApplicationController(
            IHelperService helperService,
            ILogger<AdminHelperApplicationController> logger)
        {
            _helperService = helperService;
            _logger = logger;
        }

        /// <summary>
        /// Get paginated list of helper applications with optional status filtering
        /// </summary>
        /// <param name="status">Filter by approval status (pending, approved, rejected, revision_requested)</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 20, max: 100)</param>
        /// <returns>Paginated list of helper applications</returns>
        [HttpGet("applications")]
        public async Task<IActionResult> GetHelperApplications(
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                // Validate pagination parameters
                if (page < 1)
                {
                    return BadRequest(new { message = "Page number must be greater than 0" });
                }

                if (pageSize < 1 || pageSize > 100)
                {
                    return BadRequest(new { message = "Page size must be between 1 and 100" });
                }

                // Validate status parameter if provided
                if (!string.IsNullOrEmpty(status))
                {
                    var validStatuses = new[] { "pending", "approved", "rejected", "revision_requested" };
                    if (!validStatuses.Contains(status.ToLower()))
                    {
                        return BadRequest(new { message = "Invalid status. Valid values are: pending, approved, rejected, revision_requested" });
                    }
                }

                _logger.LogInformation($"Admin {User.FindFirst(ClaimTypes.NameIdentifier)?.Value} requesting helper applications - Status: {status}, Page: {page}, PageSize: {pageSize}");

                var (applications, totalCount) = await _helperService.GetHelperApplicationsAsync(status, page, pageSize);

                var response = new
                {
                    applications = applications,
                    pagination = new
                    {
                        page = page,
                        pageSize = pageSize,
                        totalCount = totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                        hasNext = page * pageSize < totalCount,
                        hasPrevious = page > 1
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving helper applications");
                return StatusCode(500, new { message = "An error occurred while retrieving helper applications" });
            }
        }

        /// <summary>
        /// Get detailed information about a specific helper application
        /// </summary>
        /// <param name="id">Helper ID</param>
        /// <returns>Detailed helper application information</returns>
        [HttpGet("applications/{id}")]
        public async Task<IActionResult> GetHelperApplicationById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Invalid helper ID" });
                }

                _logger.LogInformation($"Admin {User.FindFirst(ClaimTypes.NameIdentifier)?.Value} requesting helper application details for ID: {id}");

                var application = await _helperService.GetHelperApplicationByIdAsync(id);
                if (application == null)
                {
                    return NotFound(new { message = $"Helper application with ID {id} not found" });
                }

                return Ok(application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving helper application with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while retrieving the helper application" });
            }
        }

        /// <summary>
        /// Process admin decision on a helper application
        /// </summary>
        /// <param name="id">Helper ID</param>
        /// <param name="decision">Decision details (status and optional comment)</param>
        /// <returns>Success or error response</returns>
        [HttpPost("applications/{id}/decision")]
        public async Task<IActionResult> ProcessHelperApplicationDecision(int id, [FromBody] HelperApplicationDecisionDto decision)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Invalid helper ID" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(adminIdClaim, out int adminId))
                {
                    return Unauthorized(new { message = "Invalid admin credentials" });
                }

                _logger.LogInformation($"Admin {adminId} processing decision for helper application {id}: {decision.Status}");

                var result = await _helperService.ProcessHelperApplicationDecisionAsync(id, decision, adminId);
                if (!result)
                {
                    return NotFound(new { message = $"Helper application with ID {id} not found or cannot be processed" });
                }

                var responseMessage = decision.Status switch
                {
                    "approved" => "Helper application approved successfully",
                    "rejected" => "Helper application rejected successfully",
                    "revision_requested" => "Revision request sent to helper successfully",
                    _ => "Helper application status updated successfully"
                };

                return Ok(new { message = responseMessage });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while processing decision for helper application with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while processing the application decision" });
            }
        }
    }
}
