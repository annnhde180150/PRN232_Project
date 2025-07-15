using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.UserAddress;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mappers
{
    public class UserAddressProfile : Profile
    {
        public UserAddressProfile()
        {
            //entity to dto
            CreateMap<UserAddress, UserAddressCreateDto>();
            CreateMap<UserAddress, UserAddressUpdateDto>();
            CreateMap<UserAddress, UserAddressDetailDto>()
                .ForMember(dest => dest.ServiceRequests, opt => opt.MapFrom(sr => sr.ServiceRequests))
                .ForMember(dest => dest.User, opt => opt.MapFrom(sr => sr.User)); // Ignore navigation properties

            //dto to entity
            CreateMap<UserAddressCreateDto, UserAddress>()
                .ForMember(dest => dest.AddressId, opt => opt.Ignore()) // Ignore ID for creation
                .ForMember(dest => dest.Users, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore()) // Ignore navigation properties
                .ForMember(dest => dest.ServiceRequests, opt => opt.Ignore());
            CreateMap<UserAddressUpdateDto, UserAddress>()
                .ForMember(dest => dest.Users, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore()) // Ignore navigation properties
                .ForMember(dest => dest.ServiceRequests, opt => opt.Ignore());
            CreateMap<UserAddressDetailDto, UserAddress>()
                .ForMember(dest => dest.Users, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore()) // Ignore navigation properties
                .ForMember(dest => dest.ServiceRequests, opt => opt.MapFrom(src => src.ServiceRequests));
        }
    }
}
