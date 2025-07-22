using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Review;

namespace Services.Mappers;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        // Review entity to ReviewDetailsDto
        CreateMap<Review, ReviewDetailsDto>()
            .ForMember(dest => dest.ReviewId, opt => opt.MapFrom(src => src.ReviewId))
            .ForMember(dest => dest.BookingId, opt => opt.MapFrom(src => src.BookingId))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
            .ForMember(dest => dest.ReviewDate, opt => opt.MapFrom(src => src.ReviewDate));

        // ReviewCreateDto to Review entity
        CreateMap<ReviewCreateDto, Review>()
            .ForMember(dest => dest.BookingId, opt => opt.MapFrom(src => src.BookingId))
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
            .ForMember(dest => dest.ReviewId, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.ReviewDate, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.IsEdited, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.LastEditedDate, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.Booking, opt => opt.Ignore())
            .ForMember(dest => dest.Helper, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());

        // ReviewUpdateDto to Review entity (for updates)
        CreateMap<ReviewUpdateDto, Review>()
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
            .ForMember(dest => dest.ReviewId, opt => opt.Ignore())
            .ForMember(dest => dest.BookingId, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.HelperId, opt => opt.Ignore())
            .ForMember(dest => dest.ReviewDate, opt => opt.Ignore())
            .ForMember(dest => dest.IsEdited, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.LastEditedDate, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.Booking, opt => opt.Ignore())
            .ForMember(dest => dest.Helper, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());
    }
}
