using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Admin;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminServiceRequestController : ControllerBase
    {
        private readonly IServiceRequestService _serviceRequestService;
        private readonly ILogger<AdminServiceRequestController> _logger;

        public AdminServiceRequestController(
            IServiceRequestService serviceRequestService,
            ILogger<AdminServiceRequestController> logger)
        {
            _serviceRequestService = serviceRequestService;
            _logger = logger;
        }

        /// <summary>
        /// Get all service requests with filtering and pagination for admin
        /// </summary>
        /// <param name="status">Filter by request status (pending, matched, completed, cancelled)</param>
        /// <param name="user">Filter by user name or email</param>
        /// <param name="dateFrom">Filter by start date</param>
        /// <param name="dateTo">Filter by end date</param>
        /// <param name="location">Filter by location</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 20)</param>
        /// <returns>Paginated list of service requests</returns>
        [HttpGet("requests")]
        public async Task<IActionResult> GetServiceRequests(
            [FromQuery] string? status = null,
            [FromQuery] string? user = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string? location = null,
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

                // Validate date range
                if (dateFrom.HasValue && dateTo.HasValue && dateFrom > dateTo)
                {
                    return BadRequest(new { message = "DateFrom cannot be greater than DateTo" });
                }

                var filter = new AdminServiceRequestFilterDto
                {
                    Status = status,
                    User = user,
                    DateFrom = dateFrom,
                    DateTo = dateTo,
                    Location = location,
                    Page = page,
                    PageSize = pageSize
                };

                var result = await _serviceRequestService.GetServiceRequestsForAdminAsync(filter);

                // Return 204 No Content if no requests found
                if (result.Total == 0)
                {
                    return NoContent();
                }

                return Ok(new
                {
                    requests = result.Requests,
                    total = result.Total,
                    page = result.Page,
                    pageSize = result.PageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving service requests for admin");
                return StatusCode(500, new { message = "An error occurred while retrieving service requests" });
            }
        }

        /// <summary>
        /// Export service requests to CSV format
        /// </summary>
        /// <param name="format">Export format (currently only 'csv' is supported)</param>
        /// <param name="status">Filter by request status</param>
        /// <param name="user">Filter by user name or email</param>
        /// <param name="dateFrom">Filter by start date</param>
        /// <param name="dateTo">Filter by end date</param>
        /// <param name="location">Filter by location</param>
        /// <returns>CSV file download</returns>
        [HttpGet("requests/export")]
        public async Task<IActionResult> ExportServiceRequests(
            [FromQuery] string format = "csv",
            [FromQuery] string? status = null,
            [FromQuery] string? user = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string? location = null)
        {
            try
            {
                // Validate format
                if (format.ToLower() != "csv")
                {
                    return BadRequest(new { message = "Only CSV format is currently supported" });
                }

                // Validate date range
                if (dateFrom.HasValue && dateTo.HasValue && dateFrom > dateTo)
                {
                    return BadRequest(new { message = "DateFrom cannot be greater than DateTo" });
                }

                var filter = new AdminServiceRequestFilterDto
                {
                    Status = status,
                    User = user,
                    DateFrom = dateFrom,
                    DateTo = dateTo,
                    Location = location
                };

                var csvData = await _serviceRequestService.ExportServiceRequestsToCsvAsync(filter);

                var fileName = $"service_requests_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                
                return File(csvData, "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while exporting service requests");
                return StatusCode(500, new { message = "An error occurred while exporting service requests" });
            }
        }
    }
}
