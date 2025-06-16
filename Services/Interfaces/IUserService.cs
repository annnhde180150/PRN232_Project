using Services.DTOs.User;

namespace Services.Interfaces;

public interface IUserService : IBaseService<UserDetailsDto, UserCreateDto, UserUpdateDto>
{
    Task<IEnumerable<UserDetailsDto>> GetActiveHelpersAsync();
    Task<IEnumerable<UserDetailsDto>> GetInactiveHelpersAsync();
}