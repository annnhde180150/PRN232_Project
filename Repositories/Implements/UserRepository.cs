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

    public async Task<User?> GetUserByPhoneAsync(string phoneNumber)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }
    
    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _context.Users
            .Where(h => h.IsActive == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetInactiveUsersAsync()
    {
        return await _context.Users
            .Where(h => h.IsActive == false)
            .ToListAsync();
    }

    public async Task<bool> IsEmailUniqueAsync(string email, int exceptUserId)
    {
        return !await _context.Users.AnyAsync(u => u.Email == email && u.UserId != exceptUserId);
    }

    public async Task<bool> IsPhoneUniqueAsync(string phoneNumber, int exceptUserId)
    {
        return !await _context.Users.AnyAsync(u => u.PhoneNumber == phoneNumber && u.UserId != exceptUserId);
    }
}