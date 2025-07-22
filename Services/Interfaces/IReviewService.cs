using Services.DTOs.Review;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces;

public interface IReviewService
{
    // Create and validation
    Task<ReviewDetailsDto> AddReviewAsync(int userId, ReviewCreateDto dto);
    Task<(bool IsValid, string ErrorMessage)> ValidateReviewCreationAsync(int userId, ReviewCreateDto dto);

    // Read operations
    Task<IEnumerable<ReviewDetailsDto>> GetReviewsByHelperIdAsync(int helperId);
    Task<IEnumerable<ReviewDetailsDto>> GetReviewsByUserIdAsync(int userId);
    Task<ReviewDetailsDto?> GetReviewByIdAsync(int reviewId);
    Task<ReviewDetailsDto?> GetReviewByBookingIdAsync(int bookingId);

    // Update and delete
    Task<ReviewDetailsDto?> UpdateReviewAsync(int userId, int reviewId, ReviewUpdateDto dto);
    Task<bool> DeleteReviewAsync(int userId, int reviewId);

    // Validation helpers
    Task<bool> CheckReviewOwnershipAsync(int userId, int reviewId);
    Task<bool> ReviewExistsForBookingAsync(int bookingId);
}