using AutoMapper;
using AutoMapper.Internal;
using BussinessObjects.Models;
using Services.DTOs.Booking;
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
            CreateMap<Booking, BookingDetailDto>();
            CreateMap<Booking, BookingCreateDto>();
            CreateMap<Booking, BookingUpdateDto>();


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
                .ForMember(dest => dest.FreeCancellationDeadline, opt => opt.Ignore())
                .ForMember(dest => dest.FinalPrice, opt => opt.Ignore())
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
            return type.IsPrimitive ||
                   type == typeof(string) ||
                   type == typeof(decimal) ||
                   type == typeof(DateTime) ||  // Often included as "simple" for convenience
                   type == typeof(DateTimeOffset) ||
                   type == typeof(TimeSpan) ||
                   type == typeof(Guid);
        }
    }
}
