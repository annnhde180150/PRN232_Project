using Services.DTOs.Review;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces;

public interface IReviewService
{
    Task<ReviewDetailsDto> AddReviewAsync(ReviewCreateDto dto);
    Task<IEnumerable<ReviewDetailsDto>> GetReviewsByHelperIdAsync(int helperId);
    Task<IEnumerable<ReviewDetailsDto>> GetReviewsByUserIdAsync(int userId);
} 