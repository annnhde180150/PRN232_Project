using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.User;
using Services.DTOs.FavoriteHelper;

namespace Services.Mappers;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDetailsDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.RegistrationDate))
            .ForMember(dest => dest.LastLoginDate, opt => opt.MapFrom(src => src.LastLoginDate))
            .ForMember(dest => dest.ExternalAuthProvider, opt => opt.MapFrom(src => src.ExternalAuthProvider))
            .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ExternalAuthId))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.DefaultAddressId, opt => opt.MapFrom(src => src.DefaultAddressId));

        CreateMap<UserDetailsDto, User>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.RegistrationDate))
            .ForMember(dest => dest.LastLoginDate, opt => opt.MapFrom(src => src.LastLoginDate))
            .ForMember(dest => dest.ExternalAuthProvider, opt => opt.MapFrom(src => src.ExternalAuthProvider))
            .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ExternalAuthId))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.DefaultAddressId, opt => opt.MapFrom(src => src.DefaultAddressId))
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Không map password hash từ DTO
            .ForMember(dest => dest.DefaultAddress, opt => opt.Ignore()) // Ignore navigation properties
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.ChatReceiverUsers, opt => opt.Ignore())
            .ForMember(dest => dest.ChatSenderUsers, opt => opt.Ignore())
            .ForMember(dest => dest.FavoriteHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.Notifications, opt => opt.Ignore())
            .ForMember(dest => dest.Payments, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.ServiceRequests, opt => opt.Ignore())
            .ForMember(dest => dest.SupportTickets, opt => opt.Ignore())
            .ForMember(dest => dest.UserAddresses, opt => opt.Ignore());

        CreateMap<UserCreateDto, User>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.PasswordHash))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.ExternalAuthProvider, opt => opt.MapFrom(src => src.ExternalAuthProvider))
            .ForMember(dest => dest.ExternalAuthId, opt => opt.MapFrom(src => src.ExternalAuthId))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.DefaultAddressId, opt => opt.MapFrom(src => src.DefaultAddressId))
            .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Auto-generated
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.LastLoginDate, opt => opt.Ignore()) // Sẽ set khi login
            .ForMember(dest => dest.DefaultAddress, opt => opt.Ignore()) // Navigation properties
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.ChatReceiverUsers, opt => opt.Ignore())
            .ForMember(dest => dest.ChatSenderUsers, opt => opt.Ignore())
            .ForMember(dest => dest.FavoriteHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.Notifications, opt => opt.Ignore())
            .ForMember(dest => dest.Payments, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.ServiceRequests, opt => opt.Ignore())
            .ForMember(dest => dest.SupportTickets, opt => opt.Ignore())
            .ForMember(dest => dest.UserAddresses, opt => opt.Ignore());

        CreateMap<UserUpdateDto, User>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.DefaultAddressId, opt => opt.MapFrom(src => src.DefaultAddressId))
            .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Không update ID
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Không update password qua DTO này
            .ForMember(dest => dest.RegistrationDate, opt => opt.Ignore()) // Không thay đổi
            .ForMember(dest => dest.LastLoginDate, opt => opt.Ignore()) // Không thay đổi
            .ForMember(dest => dest.ExternalAuthProvider, opt => opt.Ignore()) // Không update qua DTO này
            .ForMember(dest => dest.ExternalAuthId, opt => opt.Ignore()) // Không update qua DTO này
            .ForMember(dest => dest.DefaultAddress, opt => opt.Ignore()) // Navigation properties
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.ChatReceiverUsers, opt => opt.Ignore())
            .ForMember(dest => dest.ChatSenderUsers, opt => opt.Ignore())
            .ForMember(dest => dest.FavoriteHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.Notifications, opt => opt.Ignore())
            .ForMember(dest => dest.Payments, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.ServiceRequests, opt => opt.Ignore())
            .ForMember(dest => dest.SupportTickets, opt => opt.Ignore())
            .ForMember(dest => dest.UserAddresses, opt => opt.Ignore());

        CreateMap<UserDetailsDto, UserUpdateDto>();
        CreateMap<UserRegisterDto, UserCreateDto>();
        CreateMap<FavoriteHelper, FavoriteHelperDetailsDto>();
        CreateMap<FavoriteHelperCreateDto, FavoriteHelper>();
    }
}