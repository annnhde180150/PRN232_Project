using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.User;

namespace Services.Mappers;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDetailsDto>();
    }
}