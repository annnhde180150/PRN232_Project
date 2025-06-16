using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class UserRepository(Prn232HomeHelperFinderSystemContext context)
    : BaseRepository<User>(context), IUserRepository
{
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    
    public async Task<IEnumerable<User>> GetActiveHelpersAsync()
    {
        return await _context.Users
            .Where(h => h.IsActive == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetInactiveHelpersAsync()
    {
        return await _context.Users
            .Where(h => h.IsActive == false)
            .ToListAsync();
    }
}