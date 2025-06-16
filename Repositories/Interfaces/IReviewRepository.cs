using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IReviewRepository : IBaseRepository<Review>
{
    Task<IEnumerable<Review>> GetReviewsByHelperIdAsync(int helperId);
    Task<IEnumerable<Review>> GetReviewsByUserIdAsync(int userId);
    Task<IEnumerable<Review>> GetReviewsByBookingIdAsync(int bookingId);
    Task<IEnumerable<Review>> GetReviewsByRatingAsync(int rating);
    Task<double> GetAverageRatingAsync();
    Task<double> GetAverageRatingByHelperIdAsync(int helperId);
    Task<Dictionary<int, int>> GetRatingDistributionAsync();
    Task<Dictionary<int, int>> GetRatingDistributionByHelperIdAsync(int helperId);
} 