using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Review;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Helper")]
public class ReviewReportController : ControllerBase
{
    private readonly IReviewReportService _reviewReportService;

    public ReviewReportController(IReviewReportService reviewReportService)
    {
        _reviewReportService = reviewReportService;
    }

    [HttpPost]
    public async Task<IActionResult> ReportReview([FromBody] ReviewReportDto dto)
    {
        await _reviewReportService.ReportReviewAsync(dto);
        return Ok(new { message = "Review reported for moderation." });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewReportDto>>> GetAll()
    {
        var result = await _reviewReportService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewReportDto>> GetById(int id)
    {
        var result = await _reviewReportService.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("by-review/{reviewId}")]
    public async Task<ActionResult<IEnumerable<ReviewReportDto>>> GetByReviewId(int reviewId)
    {
        var result = await _reviewReportService.GetByReviewIdAsync(reviewId);
        return Ok(result);
    }

    [HttpGet("by-helper/{helperId}")]
    public async Task<ActionResult<IEnumerable<ReviewReportDto>>> GetByHelperId(int helperId)
    {
        var result = await _reviewReportService.GetByHelperIdAsync(helperId);
        return Ok(result);
    }
} 