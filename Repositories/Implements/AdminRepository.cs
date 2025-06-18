using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class AdminRepository(Prn232HomeHelperFinderSystemContext context)
       : BaseRepository<AdminUser>(context), IAdminRepository
    {
        public async Task<AdminUser?> GetAdminByUsernameAsync(string username)
        {
            return await _context.AdminUsers.FirstOrDefaultAsync(a => a.Username == username);
        }

        public async Task<AdminUser?> GetAdminByEmailAsync(string email)
        {
            return await _context.AdminUsers.FirstOrDefaultAsync(a => a.Email == email);
        }

        public async Task<IEnumerable<AdminUser>> GetActiveAdminsAsync()
        {
            return await _context.AdminUsers.Where(a => a.IsActive == true).ToListAsync();
        }

        public async Task<IEnumerable<AdminUser>> GetInactiveAdminsAsync()
        {
            return await _context.AdminUsers.Where(a => a.IsActive == false).ToListAsync();
        }
    }
}
