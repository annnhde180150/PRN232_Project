using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.ServiceRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mappers
{
    public class ServiceRequestProfile : Profile
    {
        public ServiceRequestProfile()
        {
            //Entity to Dto
            CreateMap<ServiceRequest, ServiceRequestDetailDto>();
            CreateMap<ServiceRequest, ServiceRequestCreateDto>();
            CreateMap<ServiceRequest, ServiceRequestUpdateDto>();

            //Dto to Entity
            CreateMap<ServiceRequestCreateDto, ServiceRequest>()
                .ForMember(dest => dest.RequestCreationTime, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending")) // Default status
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Address, opt => opt.Ignore())
                .ForMember(dest => dest.Bookings, opt => opt.Ignore());
            CreateMap<ServiceRequestUpdateDto, ServiceRequest>()
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Address, opt => opt.Ignore())
                .ForMember(dest => dest.Bookings, opt => opt.Ignore());
            CreateMap<ServiceRequestDetailDto, ServiceRequest>()
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Address, opt => opt.Ignore())
                .ForMember(dest => dest.Bookings, opt => opt.Ignore());

            // Dto to Dto additional if nessesary
            CreateMap<ServiceRequestDetailDto, ServiceRequestUpdateDto>();
        }
    }
}
