using BussinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IAdminRepository : IBaseRepository<AdminUser>
    {
        Task<AdminUser?> GetAdminByUsernameAsync(string username);
        Task<AdminUser?> GetAdminByEmailAsync(string email);
        Task<IEnumerable<AdminUser>> GetActiveAdminsAsync();
        Task<IEnumerable<AdminUser>> GetInactiveAdminsAsync();
    }
}
