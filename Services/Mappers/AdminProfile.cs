using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mappers
{
    public class AdminProfile : Profile
    {
        public AdminProfile() 
        {
            CreateMap<AdminUser, AdminDetailsDto>()
                .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.PasswordHash))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.LastLoginDate, opt => opt.MapFrom(src => src.LastLoginDate))
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => src.CreationDate))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));

            CreateMap< AdminDetailsDto, AdminUser>()
                .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.PasswordHash))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.LastLoginDate, opt => opt.MapFrom(src => src.LastLoginDate))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));
        }
    }
}
