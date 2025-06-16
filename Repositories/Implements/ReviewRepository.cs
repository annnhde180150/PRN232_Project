using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class ReviewRepository : BaseRepository<Review>, IReviewRepository
{
    public ReviewRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Review>> GetReviewsByHelperIdAsync(int helperId)
    {
        return await _context.Reviews
            .Where(r => r.HelperId == helperId)
            .Include(r => r.User)
            .Include(r => r.Helper)
            .Include(r => r.Booking)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetReviewsByUserIdAsync(int userId)
    {
        return await _context.Reviews
            .Where(r => r.UserId == userId)
            .Include(r => r.User)
            .Include(r => r.Helper)
            .Include(r => r.Booking)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetReviewsByBookingIdAsync(int bookingId)
    {
        return await _context.Reviews
            .Where(r => r.BookingId == bookingId)
            .Include(r => r.User)
            .Include(r => r.Helper)
            .Include(r => r.Booking)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetReviewsByRatingAsync(int rating)
    {
        return await _context.Reviews
            .Where(r => r.Rating == rating)
            .Include(r => r.User)
            .Include(r => r.Helper)
            .Include(r => r.Booking)
            .ToListAsync();
    }

    public async Task<double> GetAverageRatingAsync()
    {
        var reviews = await _context.Reviews.ToListAsync();
        return reviews.Any() ? reviews.Average(r => r.Rating) : 0.0;
    }

    public async Task<double> GetAverageRatingByHelperIdAsync(int helperId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.HelperId == helperId)
            .ToListAsync();
        return reviews.Any() ? reviews.Average(r => r.Rating) : 0.0;
    }

    public async Task<Dictionary<int, int>> GetRatingDistributionAsync()
    {
        return await _context.Reviews
            .GroupBy(r => r.Rating)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }

    public async Task<Dictionary<int, int>> GetRatingDistributionByHelperIdAsync(int helperId)
    {
        return await _context.Reviews
            .Where(r => r.HelperId == helperId)
            .GroupBy(r => r.Rating)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
} 