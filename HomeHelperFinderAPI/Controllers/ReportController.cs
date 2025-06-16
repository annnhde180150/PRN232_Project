using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Report;
using Services.DTOs.Notification;
using Services.Interfaces;
using System.Security.Claims;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly IRealtimeNotificationService _realtimeService;

    public ReportController(
        IAnalyticsService analyticsService,
        IRealtimeNotificationService realtimeService)
    {
        _analyticsService = analyticsService;
        _realtimeService = realtimeService;
    }

    /// <summary>
    /// Get system-wide overview statistics
    /// </summary>
    [HttpGet("system-overview")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SystemOverviewDto>> GetSystemOverview()
    {
        try
        {
            var overview = await _analyticsService.GetSystemOverviewAsync();
            return Ok(overview);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving system overview: {ex.Message}");
        }
    }

    /// <summary>
    /// Get performance metrics and KPIs
    /// </summary>
    [HttpGet("performance-metrics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PerformanceMetricsDto>> GetPerformanceMetrics()
    {
        try
        {
            var metrics = await _analyticsService.GetPerformanceMetricsAsync();
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving performance metrics: {ex.Message}");
        }
    }

    /// <summary>
    /// Get user analytics and trends
    /// </summary>
    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserAnalyticsDto>> GetUserAnalytics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var analytics = await _analyticsService.GetUserAnalyticsAsync(startDate, endDate);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving user analytics: {ex.Message}");
        }
    }

    /// <summary>
    /// Get specific user activity analytics
    /// </summary>
    [HttpGet("users/{userId}/activity")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<UserAnalyticsDto>> GetUserActivity(
        int userId,
        [FromQuery] string period = "month")
    {
        try
        {
            // Check if user is accessing their own data or is admin
            var currentUserId = GetCurrentUserId();
            var userType = GetUserType();
            
            if (userType != "Admin" && currentUserId != userId)
            {
                return Forbid("You can only access your own analytics");
            }

            var analytics = await _analyticsService.GetUserActivityAnalyticsAsync(userId, period);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving user activity: {ex.Message}");
        }
    }

    /// <summary>
    /// Get helper performance analytics
    /// </summary>
    [HttpGet("helpers/{helperId?}")]
    [Authorize(Roles = "Admin,Helper")]
    public async Task<ActionResult<HelperAnalyticsDto>> GetHelperAnalytics(
        int? helperId = null,
        [FromQuery] string period = "month")
    {
        try
        {
            var userType = GetUserType();
            var targetHelperId = helperId;

            // If no helperId provided and user is a helper, use their ID
            if (!targetHelperId.HasValue && userType == "Helper")
            {
                targetHelperId = GetCurrentHelperId();
            }
            
            // Check permissions
            if (userType == "Helper" && targetHelperId != GetCurrentHelperId())
            {
                return Forbid("You can only access your own analytics");
            }

            if (!targetHelperId.HasValue)
            {
                return BadRequest("Helper ID is required");
            }

            var analytics = await _analyticsService.GetHelperAnalyticsAsync(targetHelperId.Value, period);
            return Ok(analytics);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving helper analytics: {ex.Message}");
        }
    }

    /// <summary>
    /// Get my helper analytics (for authenticated helpers)
    /// </summary>
    [HttpGet("helpers/my-analytics")]
    [Authorize(Roles = "Helper")]
    public async Task<ActionResult<HelperAnalyticsDto>> GetMyAnalytics(
        [FromQuery] string period = "month")
    {
        try
        {
            var helperId = GetCurrentHelperId();
            var analytics = await _analyticsService.GetHelperAnalyticsAsync(helperId, period);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving your analytics: {ex.Message}");
        }
    }

    /// <summary>
    /// Get top performing helpers
    /// </summary>
    [HttpGet("helpers/top-performers")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<HelperAnalyticsDto>>> GetTopPerformingHelpers(
        [FromQuery] int count = 10,
        [FromQuery] string period = "month")
    {
        try
        {
            var topHelpers = await _analyticsService.GetTopPerformingHelpersAsync(count, period);
            return Ok(topHelpers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving top performers: {ex.Message}");
        }
    }

    /// <summary>
    /// Get booking analytics and trends
    /// </summary>
    [HttpGet("bookings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookingAnalyticsDto>> GetBookingAnalytics(
        [FromQuery] int? serviceId = null,
        [FromQuery] string period = "month")
    {
        try
        {
            var analytics = await _analyticsService.GetBookingAnalyticsAsync(serviceId, period);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving booking analytics: {ex.Message}");
        }
    }

    /// <summary>
    /// Get service popularity analytics
    /// </summary>
    [HttpGet("services/popularity")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<ServicePopularityDto>>> GetServicePopularity(
        [FromQuery] string period = "month")
    {
        try
        {
            var popularity = await _analyticsService.GetServicePopularityAnalyticsAsync(period);
            return Ok(popularity);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving service popularity: {ex.Message}");
        }
    }

    /// <summary>
    /// Get revenue report and financial analytics
    /// </summary>
    [HttpGet("revenue")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RevenueReportDto>> GetRevenueReport(
        [FromQuery] string period = "month")
    {
        try
        {
            var revenue = await _analyticsService.GetRevenueReportAsync(period);
            return Ok(revenue);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving revenue report: {ex.Message}");
        }
    }

    /// <summary>
    /// Get monthly revenue trend
    /// </summary>
    [HttpGet("revenue/trend")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<MonthlyRevenueDto>>> GetMonthlyRevenueTrend(
        [FromQuery] int months = 12)
    {
        try
        {
            var trend = await _analyticsService.GetMonthlyRevenueTrendAsync(months);
            return Ok(trend);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving revenue trend: {ex.Message}");
        }
    }

    /// <summary>
    /// Export system report to CSV
    /// </summary>
    [HttpGet("export/system")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ExportSystemReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
            var end = endDate ?? DateTime.UtcNow;
            
            var csvData = await _analyticsService.ExportSystemReportToCsvAsync(start, end);
            var fileName = $"system-report-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
            
            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error exporting system report: {ex.Message}");
        }
    }

    /// <summary>
    /// Export helper report to CSV
    /// </summary>
    [HttpGet("export/helpers/{helperId}")]
    [Authorize(Roles = "Admin,Helper")]
    public async Task<ActionResult> ExportHelperReport(
        int helperId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userType = GetUserType();
            
            // Check permissions
            if (userType == "Helper" && helperId != GetCurrentHelperId())
            {
                return Forbid("You can only export your own report");
            }
            
            var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
            var end = endDate ?? DateTime.UtcNow;
            
            var csvData = await _analyticsService.ExportHelperReportToCsvAsync(helperId, start, end);
            var fileName = $"helper-{helperId}-report-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
            
            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error exporting helper report: {ex.Message}");
        }
    }

    /// <summary>
    /// Export booking report to CSV
    /// </summary>
    [HttpGet("export/bookings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ExportBookingReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
            var end = endDate ?? DateTime.UtcNow;
            
            var csvData = await _analyticsService.ExportBookingReportToCsvAsync(start, end);
            var fileName = $"booking-report-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
            
            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error exporting booking report: {ex.Message}");
        }
    }

    /// <summary>
    /// Refresh analytics cache and send real-time updates
    /// </summary>
    [HttpPost("refresh")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RefreshAnalytics()
    {
        try
        {
            // Get fresh analytics data
            var overview = await _analyticsService.GetSystemOverviewAsync();
            var performance = await _analyticsService.GetPerformanceMetricsAsync();
            
            // Send real-time updates to admin dashboard
            await _realtimeService.SendToAllUsersAsync(
                new NotificationDetailsDto
                {
                    Title = "Analytics Updated",
                    Message = "Dashboard metrics have been refreshed",
                    NotificationType = "AnalyticsUpdate",
                    CreationTime = DateTime.UtcNow
                }
            );
            
            return Ok(new { message = "Analytics refreshed successfully", timestamp = DateTime.UtcNow });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error refreshing analytics: {ex.Message}");
        }
    }

    #region Private Helper Methods

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    private int GetCurrentHelperId()
    {
        var helperIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(helperIdClaim, out var helperId) ? helperId : 0;
    }

    private string GetUserType()
    {
        return User.FindFirst("UserType")?.Value ?? "";
    }

    #endregion
} 