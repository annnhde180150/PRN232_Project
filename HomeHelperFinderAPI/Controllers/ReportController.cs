using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Report;
using Services.Interfaces;
using System.Security.Claims;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public ReportController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    #region Customer Reports

    [HttpGet("customer/my-bookings")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<BookingAnalyticsDto>> GetMyBookingReport(
        [FromQuery] string period = "month")
    {
        try
        {
            var userId = GetCurrentUserId();
            var analytics = await _analyticsService.GetCustomerBookingAnalyticsAsync(userId, period);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy báo cáo đặt dịch vụ: {ex.Message}");
        }
    }

    [HttpGet("customer/my-spending")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<object>> GetMySpendingReport(
        [FromQuery] string period = "month")
    {
        try
        {
            var userId = GetCurrentUserId();
            var spendingAnalytics = await _analyticsService.GetCustomerSpendingAnalyticsAsync(userId, period);
            return Ok(spendingAnalytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy báo cáo chi tiêu: {ex.Message}");
        }
    }

    [HttpGet("customer/favorite-helpers")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<List<HelperAnalyticsDto>>> GetMyFavoriteHelpersReport()
    {
        try
        {
            var userId = GetCurrentUserId();
            var favoriteHelpers = await _analyticsService.GetCustomerFavoriteHelpersAsync(userId);
            return Ok(favoriteHelpers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy báo cáo helper yêu thích: {ex.Message}");
        }
    }

    #endregion

    #region Helper Reports

    [HttpGet("helper/my-earnings")]
    [Authorize(Roles = "Helper")]
    public async Task<ActionResult<HelperAnalyticsDto>> GetMyEarningsReport(
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
            return StatusCode(500, $"Lỗi khi lấy báo cáo thu nhập: {ex.Message}");
        }
    }

    [HttpGet("helper/my-performance")]
    [Authorize(Roles = "Helper")]
    public async Task<ActionResult<object>> GetMyPerformanceReport(
        [FromQuery] string period = "month")
    {
        try
        {
            var helperId = GetCurrentHelperId();
            var performanceAnalytics = await _analyticsService.GetHelperPerformanceAnalyticsAsync(helperId, period);
            return Ok(performanceAnalytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy báo cáo hiệu suất: {ex.Message}");
        }
    }

    [HttpGet("helper/my-schedule-analytics")]
    [Authorize(Roles = "Helper")]
    public async Task<ActionResult<object>> GetMyScheduleAnalytics(
        [FromQuery] string period = "month")
    {
        try
        {
            var helperId = GetCurrentHelperId();
            var scheduleAnalytics = await _analyticsService.GetHelperScheduleAnalyticsAsync(helperId, period);
            return Ok(scheduleAnalytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy phân tích lịch làm việc: {ex.Message}");
        }
    }

    #endregion

    #region Admin Reports

    [HttpGet("admin/business-overview")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SystemOverviewDto>> GetBusinessOverview()
    {
        try
        {
            var overview = await _analyticsService.GetSystemOverviewAsync();
            return Ok(overview);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy tổng quan kinh doanh: {ex.Message}");
        }
    }

    [HttpGet("admin/revenue-analytics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RevenueReportDto>> GetRevenueAnalytics(
        [FromQuery] string period = "month")
    {
        try
        {
            var revenue = await _analyticsService.GetRevenueReportAsync(period);
            return Ok(revenue);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy phân tích doanh thu: {ex.Message}");
        }
    }

    [HttpGet("admin/user-growth")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserAnalyticsDto>> GetUserGrowthReport(
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
            return StatusCode(500, $"Lỗi khi lấy báo cáo tăng trưởng người dùng: {ex.Message}");
        }
    }

    [HttpGet("admin/service-performance")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<ServicePopularityDto>>> GetServicePerformanceReport(
        [FromQuery] string period = "month")
    {
        try
        {
            var popularity = await _analyticsService.GetServicePopularityAnalyticsAsync(period);
            return Ok(popularity);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy báo cáo hiệu suất dịch vụ: {ex.Message}");
        }
    }

    [HttpGet("admin/helper-rankings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<HelperAnalyticsDto>>> GetHelperRankings(
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
            return StatusCode(500, $"Lỗi khi lấy xếp hạng helper: {ex.Message}");
        }
    }

    [HttpGet("admin/booking-analytics")]
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
            return StatusCode(500, $"Lỗi khi lấy phân tích đặt dịch vụ: {ex.Message}");
        }
    }

    [HttpGet("admin/quality-metrics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> GetQualityMetrics()
    {
        try
        {
            var performance = await _analyticsService.GetPerformanceMetricsAsync();

            return Ok(new
            {
                CustomerSatisfactionScore = performance.CustomerSatisfactionScore,
                ServiceQualityIndex = performance.ServiceQualityIndex,
                PlatformUtilizationRate = performance.PlatformUtilizationRate,
                RetentionRate = performance.RetentionRate,
                ChurnRate = performance.ChurnRate,
                LastCalculated = performance.LastCalculated
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy chỉ số chất lượng: {ex.Message}");
        }
    }

    #endregion

    #region Export Reports

    [HttpGet("export/admin/business-report")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ExportBusinessReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.Now.AddMonths(-1);
            var end = endDate ?? DateTime.Now;

            var csvData = await _analyticsService.ExportSystemReportToCsvAsync(start, end);
            var fileName = $"business-report-{DateTime.Now:yyyyMMdd-HHmmss}.csv";

            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi xuất báo cáo kinh doanh: {ex.Message}");
        }
    }

    [HttpGet("export/helper/my-report")]
    [Authorize(Roles = "Helper")]
    public async Task<ActionResult> ExportMyHelperReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var helperId = GetCurrentHelperId();
            var start = startDate ?? DateTime.Now.AddMonths(-1);
            var end = endDate ?? DateTime.Now;

            var csvData = await _analyticsService.ExportHelperReportToCsvAsync(helperId, start, end);
            var fileName = $"helper-report-{DateTime.Now:yyyyMMdd-HHmmss}.csv";

            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi xuất báo cáo helper: {ex.Message}");
        }
    }

    [HttpGet("export/admin/helper-report/{helperId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ExportSpecificHelperReport(
        int helperId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.Now.AddMonths(-1);
            var end = endDate ?? DateTime.Now;

            var csvData = await _analyticsService.ExportHelperReportToCsvAsync(helperId, start, end);
            var fileName = $"helper-{helperId}-report-{DateTime.Now:yyyyMMdd-HHmmss}.csv";

            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi xuất báo cáo helper: {ex.Message}");
        }
    }

    [HttpGet("export/admin/booking-report")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ExportBookingReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.Now.AddMonths(-1);
            var end = endDate ?? DateTime.Now;

            var csvData = await _analyticsService.ExportBookingReportToCsvAsync(start, end);
            var fileName = $"booking-report-{DateTime.Now:yyyyMMdd-HHmmss}.csv";

            return File(csvData, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi xuất báo cáo đặt dịch vụ: {ex.Message}");
        }
    }

    #endregion

    #region Utility Methods

    [HttpGet("admin/revenue-trend")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<MonthlyRevenueDto>>> GetRevenueTrend(
        [FromQuery] int months = 12)
    {
        try
        {
            var trend = await _analyticsService.GetMonthlyRevenueTrendAsync(months);
            return Ok(trend);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi lấy xu hướng doanh thu: {ex.Message}");
        }
    }

    #endregion

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
        return User.FindFirst(ClaimTypes.Role)?.Value ?? "";
    }

    #endregion
} 