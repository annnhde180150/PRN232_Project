using AutoMapper;
using AutoMapper.Internal;
using BussinessObjects.Models;
using Services.DTOs.Booking;
using Services.DTOs.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mappers
{
    public class BookingProfile : Profile
    {
        public BookingProfile()
        {

            //Entity to Dto
            CreateMap<Booking, BookingDetailDto>()
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service != null ? src.Service.ServiceName : string.Empty))
                .ForMember(dest => dest.HelperName, opt => opt.MapFrom(src => src.Helper != null ? src.Helper.FullName : string.Empty))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Request != null && src.Request.Address != null ? src.Request.Address.FullAddress : null))
                .ForMember(dest => dest.PaymentStatus, opt => opt.Ignore());
            CreateMap<Booking, BookingCreateDto>();
            CreateMap<Booking, BookingUpdateDto>();
            CreateMap<Booking, BookingServiceNameDto>()
                .ForMember(dest => dest.BookingId, opt => opt.MapFrom(src => src.BookingId))
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.ServiceName));


            //Dto to Entity
            CreateMap<BookingDetailDto, Booking>()
                .ForAllMembers(opt =>
                {
                    var type = opt.DestinationMember.GetMemberType();
                    if (!IsSimpleType(type))
                    {
                        opt.Ignore();
                    }
                });

            CreateMap<BookingCreateDto, Booking>()
                .ForMember(dest => dest.BookingId, opt => opt.Ignore()) // Ignore BookingId for create
                .ForMember(dest => dest.ActualStartTime, opt => opt.Ignore())
                .ForMember(dest => dest.ActualEndTime, opt => opt.Ignore())
                .ForMember(dest => dest.CancellationReason, opt => opt.Ignore())
                .ForMember(dest => dest.CancelledBy, opt => opt.Ignore())
                .ForMember(dest => dest.CancellationTime, opt => opt.Ignore())
                .ForMember(dest => dest.FreeCancellationDeadline, opt => opt.MapFrom(src => src.ScheduledStartTime.AddHours(-12)))
                .ForMember(dest => dest.FinalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.RequestId, opt => opt.MapFrom(src => src.RequestId.HasValue ? src.RequestId.Value : (int?)null))
                .ForAllMembers(opt =>
                {
                    var type = opt.DestinationMember.GetMemberType();
                    if (!IsSimpleType(type))
                    {
                        opt.Ignore();
                    }
                });
                

            CreateMap<BookingUpdateDto, Booking>()
                .ForMember(dest => dest.BookingCreationTime, opt => opt.Ignore())
                .ForAllMembers(opt =>
                {
                    var type = opt.DestinationMember.GetMemberType();
                    if (!IsSimpleType(type))
                    {
                        opt.Ignore();
                    }
                });
        }

        public static bool IsSimpleType(Type type)
        {
            var underlyingType = Nullable.GetUnderlyingType(type) ?? type;

            return underlyingType.IsPrimitive ||
                   underlyingType == typeof(string) ||
                   underlyingType == typeof(decimal) ||
                   underlyingType == typeof(DateTime) ||
                   underlyingType == typeof(DateTimeOffset) ||
                   underlyingType == typeof(TimeSpan) ||
                   underlyingType == typeof(Guid);
        }
    }
}
