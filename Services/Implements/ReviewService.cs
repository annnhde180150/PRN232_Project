using AutoMapper;
using BussinessObjects.Models;
using Repositories.Interfaces;
using Services.DTOs.Review;
using Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Repositories;
using Microsoft.Extensions.Logging;

namespace Services.Implements;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<ReviewService> _logger;

    public ReviewService(IReviewRepository reviewRepo, IUnitOfWork unitOfWork, IMapper mapper, ILogger<ReviewService> logger)
    {
        _reviewRepo = reviewRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ReviewDetailsDto> AddReviewAsync(int userId, ReviewCreateDto dto)
    {
        // Validate review creation
        var (isValid, errorMessage) = await ValidateReviewCreationAsync(userId, dto);
        if (!isValid)
        {
            throw new InvalidOperationException(errorMessage);
        }

        try
        {
            var entity = new Review
            {
                BookingId = dto.BookingId,
                UserId = userId,
                HelperId = dto.HelperId,
                Rating = dto.Rating,
                Comment = dto.Comment ?? string.Empty,
                ReviewDate = DateTime.Now,
                IsEdited = false
            };

            await _reviewRepo.AddAsync(entity);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Review created successfully for booking {BookingId} by user {UserId}", dto.BookingId, userId);
            return _mapper.Map<ReviewDetailsDto>(entity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating review for booking {BookingId} by user {UserId}", dto.BookingId, userId);
            throw;
        }
    }

    public async Task<(bool IsValid, string ErrorMessage)> ValidateReviewCreationAsync(int userId, ReviewCreateDto dto)
    {
        try
        {
            // Check if user exists
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                return (false, "User not found");
            }

            // Check if booking exists
            var booking = await _unitOfWork.Bookings.GetByIdAsync(dto.BookingId);
            if (booking == null)
            {
                return (false, "Booking not found");
            }

            // Check if user owns the booking
            if (booking.UserId != userId)
            {
                return (false, "You can only review your own bookings");
            }

            // Check if booking is completed
            if (booking.Status != "Completed")
            {
                return (false, "You can only review completed bookings");
            }

            // Check if helper ID matches
            if (booking.HelperId != dto.HelperId)
            {
                return (false, "Helper ID does not match the booking");
            }

            // Check if review already exists
            if (await ReviewExistsForBookingAsync(dto.BookingId))
            {
                return (false, "A review already exists for this booking");
            }

            // Validate rating range
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return (false, "Rating must be between 1 and 5");
            }

            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating review creation for booking {BookingId} by user {UserId}", dto.BookingId, userId);
            return (false, "An error occurred during validation");
        }
    }

    public async Task<IEnumerable<ReviewDetailsDto>> GetReviewsByHelperIdAsync(int helperId)
    {
        var reviews = await _reviewRepo.GetReviewsByHelperIdAsync(helperId);
        return _mapper.Map<IEnumerable<ReviewDetailsDto>>(reviews);
    }

    public async Task<IEnumerable<ReviewDetailsDto>> GetReviewsByUserIdAsync(int userId)
    {
        var reviews = await _reviewRepo.GetReviewsByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<ReviewDetailsDto>>(reviews);
    }

    public async Task<ReviewDetailsDto?> GetReviewByIdAsync(int reviewId)
    {
        var review = await _reviewRepo.GetByIdAsync(reviewId);
        return review != null ? _mapper.Map<ReviewDetailsDto>(review) : null;
    }

    public async Task<ReviewDetailsDto?> GetReviewByBookingIdAsync(int bookingId)
    {
        var reviews = await _reviewRepo.GetReviewsByBookingIdAsync(bookingId);
        var review = reviews.FirstOrDefault();
        return review != null ? _mapper.Map<ReviewDetailsDto>(review) : null;
    }

    public async Task<ReviewDetailsDto?> UpdateReviewAsync(int userId, int reviewId, ReviewUpdateDto dto)
    {
        try
        {
            // Check if review exists and user owns it
            if (!await CheckReviewOwnershipAsync(userId, reviewId))
            {
                return null;
            }

            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null)
            {
                return null;
            }

            // Validate rating range
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5");
            }

            // Update review
            review.Rating = dto.Rating;
            review.Comment = dto.Comment ?? string.Empty;
            review.IsEdited = true;
            review.LastEditedDate = DateTime.Now;

            _unitOfWork.Reviews.Update(review);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Review {ReviewId} updated by user {UserId}", reviewId, userId);
            return _mapper.Map<ReviewDetailsDto>(review);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating review {ReviewId} by user {UserId}", reviewId, userId);
            throw;
        }
    }

    public async Task<bool> DeleteReviewAsync(int userId, int reviewId)
    {
        try
        {
            // Check if review exists and user owns it
            if (!await CheckReviewOwnershipAsync(userId, reviewId))
            {
                return false;
            }

            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null)
            {
                return false;
            }

            _reviewRepo.Delete(review);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Review {ReviewId} deleted by user {UserId}", reviewId, userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting review {ReviewId} by user {UserId}", reviewId, userId);
            return false;
        }
    }

    public async Task<bool> CheckReviewOwnershipAsync(int userId, int reviewId)
    {
        var review = await _reviewRepo.GetByIdAsync(reviewId);
        return review != null && review.UserId == userId;
    }

    public async Task<bool> ReviewExistsForBookingAsync(int bookingId)
    {
        var reviews = await _reviewRepo.GetReviewsByBookingIdAsync(bookingId);
        return reviews.Any();
    }
}