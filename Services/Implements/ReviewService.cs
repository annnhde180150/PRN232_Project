using AutoMapper;
using BussinessObjects.Models;
using Repositories.Interfaces;
using Services.DTOs.Review;
using Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Repositories;

namespace Services.Implements;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ReviewService(IReviewRepository reviewRepo, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _reviewRepo = reviewRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ReviewDetailsDto> AddReviewAsync(ReviewCreateDto dto)
    {
        var entity = new Review
        {
            BookingId = dto.BookingId,
            HelperId = dto.HelperId,
            Rating = dto.Rating,
            Comment = dto.Comment ?? string.Empty,
            ReviewDate = DateTime.UtcNow
        };
        await _reviewRepo.AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<ReviewDetailsDto>(entity);
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
} 