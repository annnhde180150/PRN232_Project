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

    public async Task<(IEnumerable<User> users, int totalCount)> SearchUsersAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        int? excludeUserId = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _context.Users.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(u =>
                (u.FullName != null && u.FullName.ToLower().Contains(lowerSearchTerm)) ||
                (u.Email != null && u.Email.ToLower().Contains(lowerSearchTerm)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(searchTerm)));
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(u => u.Email != null && u.Email.ToLower().Contains(email.ToLower()));
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        if (excludeUserId.HasValue)
        {
            query = query.Where(u => u.UserId != excludeUserId.Value);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination and ordering
        var users = await query
            .OrderBy(u => u.FullName)
            .ThenBy(u => u.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return (users, totalCount);
    }
}