using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Review;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    public async Task<ActionResult<ReviewDetailsDto>> AddReview([FromBody] ReviewCreateDto dto)
    {
        var result = await _reviewService.AddReviewAsync(dto);
        return Ok(result);
    }

    [HttpGet("helper/{helperId}")]
    public async Task<ActionResult<IEnumerable<ReviewDetailsDto>>> GetReviewsByHelper(int helperId)
    {
        var result = await _reviewService.GetReviewsByHelperIdAsync(helperId);
        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<ReviewDetailsDto>>> GetReviewsByUser(int userId)
    {
        var result = await _reviewService.GetReviewsByUserIdAsync(userId);
        return Ok(result);
    }
} 