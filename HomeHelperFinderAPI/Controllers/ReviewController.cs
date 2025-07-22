using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Review;
using Services.Interfaces;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly IBookingService _bookingService;
    private readonly ILogger<ReviewController> _logger;

    public ReviewController(IReviewService reviewService, IBookingService bookingService, ILogger<ReviewController> logger)
    {
        _reviewService = reviewService;
        _bookingService = bookingService;
        _logger = logger;
    }

    /// <summary>
    /// Create a new review for a completed booking
    /// </summary>
    /// <param name="dto">Review creation data</param>
    /// <returns>Created review details</returns>
    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<ReviewDetailsDto>> CreateReview([FromBody] ReviewCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token");
            }

            var result = await _reviewService.AddReviewAsync(currentUserId.Value, dto);
            return CreatedAtAction(nameof(GetReviewById), new { id = result.ReviewId }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating review for booking {BookingId}", dto.BookingId);
            return StatusCode(500, "An error occurred while creating the review");
        }
    }

    /// <summary>
    /// Get all reviews for a specific helper (public endpoint)
    /// </summary>
    /// <param name="helperId">Helper ID</param>
    /// <returns>List of reviews for the helper</returns>
    [HttpGet("helper/{helperId}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ReviewDetailsDto>>> GetReviewsByHelper(int helperId)
    {
        if (helperId <= 0)
        {
            return BadRequest("Invalid helper ID");
        }

        try
        {
            var result = await _reviewService.GetReviewsByHelperIdAsync(helperId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reviews for helper {HelperId}", helperId);
            return StatusCode(500, "An error occurred while retrieving reviews");
        }
    }

    /// <summary>
    /// Get all reviews by a specific user (only accessible by the user themselves or admin)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of reviews by the user</returns>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<ReviewDetailsDto>>> GetReviewsByUser(int userId)
    {
        if (userId <= 0)
        {
            return BadRequest("Invalid user ID");
        }

        try
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Only allow users to view their own reviews or admins to view any reviews
            if (currentUserId != userId && currentUserRole != "Admin")
            {
                return Forbid("You can only view your own reviews");
            }

            var result = await _reviewService.GetReviewsByUserIdAsync(userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reviews for user {UserId}", userId);
            return StatusCode(500, "An error occurred while retrieving reviews");
        }
    }

    /// <summary>
    /// Get a specific review by ID
    /// </summary>
    /// <param name="id">Review ID</param>
    /// <returns>Review details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewDetailsDto>> GetReviewById(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid review ID");
        }

        try
        {
            var result = await _reviewService.GetReviewByIdAsync(id);
            if (result == null)
            {
                return NotFound("Review not found");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving review {ReviewId}", id);
            return StatusCode(500, "An error occurred while retrieving the review");
        }
    }

    /// <summary>
    /// Get review for a specific booking
    /// </summary>
    /// <param name="bookingId">Booking ID</param>
    /// <returns>Review details if exists</returns>
    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<ReviewDetailsDto>> GetReviewByBooking(int bookingId)
    {
        if (bookingId <= 0)
        {
            return BadRequest("Invalid booking ID");
        }

        try
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Check if user has access to this booking
            var booking = await _bookingService.GetByIdAsync(bookingId);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            // Only allow booking participants (user or helper) or admin to view the review
            if (currentUserRole != "Admin" &&
                booking.UserId != currentUserId &&
                booking.HelperId != currentUserId)
            {
                return Forbid("You don't have access to this booking's review");
            }

            var result = await _reviewService.GetReviewByBookingIdAsync(bookingId);
            if (result == null)
            {
                return NotFound("No review found for this booking");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving review for booking {BookingId}", bookingId);
            return StatusCode(500, "An error occurred while retrieving the review");
        }
    }

    /// <summary>
    /// Update an existing review
    /// </summary>
    /// <param name="id">Review ID</param>
    /// <param name="dto">Review update data</param>
    /// <returns>Updated review details</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<ReviewDetailsDto>> UpdateReview(int id, [FromBody] ReviewUpdateDto dto)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid review ID");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token");
            }

            var result = await _reviewService.UpdateReviewAsync(currentUserId.Value, id, dto);
            if (result == null)
            {
                return NotFound("Review not found or you don't have permission to update it");
            }

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating review {ReviewId}", id);
            return StatusCode(500, "An error occurred while updating the review");
        }
    }

    /// <summary>
    /// Delete a review
    /// </summary>
    /// <param name="id">Review ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult> DeleteReview(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid review ID");
        }

        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized("User ID not found in token");
            }

            var success = await _reviewService.DeleteReviewAsync(currentUserId.Value, id);
            if (!success)
            {
                return NotFound("Review not found or you don't have permission to delete it");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting review {ReviewId}", id);
            return StatusCode(500, "An error occurred while deleting the review");
        }
    }

    #region Helper Methods

    /// <summary>
    /// Extract current user ID from JWT claims
    /// </summary>
    /// <returns>User ID or null if not found</returns>
    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    /// <summary>
    /// Extract current user role from JWT claims
    /// </summary>
    /// <returns>User role or empty string if not found</returns>
    private string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }

    #endregion
}