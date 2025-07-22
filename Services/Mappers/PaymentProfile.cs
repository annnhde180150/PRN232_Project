using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Payment;

namespace Services.Mappers
{
    public class PaymentProfile : Profile
    {
        public PaymentProfile() {
            CreateMap<Payment,GetPaymentDto>()
                .ForMember(dest => dest.PaymentId, opt => opt.MapFrom(src => src.PaymentId))
                .ForMember(dest => dest.BookingId, opt => opt.MapFrom(src => src.BookingId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => src.PaymentDate))
                .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.Booking.HelperId));

            CreateMap<Payment, PaymentCreateDto>();

            //=========================================================================================

            var ignoreName = new String[]
            {
                "TransactionId",
                "PaymentDate",
                "PaymentGatewayResponse",
                "Booking",
                "User"
            };
            CreateMap<PaymentCreateDto, Payment>()
                .ForAllMembers(opt =>
                {
                    opt.Condition((src, dest, srcMember, destMember, context) =>
                    {
                        var memberName = opt.DestinationMember.Name;
                        return !ignoreName.Contains(memberName);
                    });
                });
        }
    }
}
