using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.DTOs.Admin;

namespace Services.Interfaces
{
    public interface IAdminService : IBaseService<AdminDetailsDto, AdminCreateDto, AdminUpdateDto>
    {
        Task<AdminDetailsDto?> GetAdminByUsernameAsync(string username);
        Task<AdminDetailsDto?> GetAdminByEmailAsync(string email);
        Task<bool> IsUsernameExistsAsync(string username);
        Task<bool> IsEmailExistsAsync(string email);
        Task<AdminDetailsDto?> ValidateAdminCredentialsAsync(string email, string password);
        Task UpdateLastLoginDateAsync(int adminId);
        Task<bool> ChangePasswordAsync(int adminId, string currentPassword, string newPassword);
        Task<bool> ResetPasswordAsync(string email, string newPassword);
    }
}
