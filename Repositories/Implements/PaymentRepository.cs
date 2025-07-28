using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class PaymentRepository : BaseRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByUserIdAsync(int userId)
    {
        return await _context.Payments
            .Where(p => p.UserId == userId)
            .Include(p => p.User)
            .Include(p => p.Booking)
                .ThenInclude(b => b.Helper)
                    .ThenInclude(h => h.HelperSkills)
                        .ThenInclude(hs => hs.Service)
            .ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Payments
            .Where(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate)
            .Include(p => p.User)
            .Include(p => p.Booking)
            .ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(string status)
    {
        return await _context.Payments
            .Where(p => p.PaymentStatus == status)
            .Include(p => p.User)
            .Include(p => p.Booking)
            .ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByMethodAsync(string method)
    {
        return await _context.Payments
            .Where(p => p.PaymentMethod == method)
            .Include(p => p.User)
            .Include(p => p.Booking)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalPaymentsAsync()
    {
        return await _context.Payments
            .SumAsync(p => p.Amount);
    }

    public async Task<decimal> GetSuccessfulPaymentsTotalAsync()
    {
        return await _context.Payments
            .Where(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "Success")
            .SumAsync(p => p.Amount);
    }

    public async Task<int> GetPaymentCountByStatusAsync(string status)
    {
        return await _context.Payments
            .CountAsync(p => p.PaymentStatus == status);
    }

    public async Task<Dictionary<string, decimal>> GetPaymentsByMethodBreakdownAsync()
    {
        return await _context.Payments
            .Where(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "Success")
            .GroupBy(p => p.PaymentMethod)
            .ToDictionaryAsync(g => g.Key, g => g.Sum(p => p.Amount));
    }

    public async Task<Dictionary<string, int>> GetPaymentStatusBreakdownAsync()
    {
        return await _context.Payments
            .GroupBy(p => p.PaymentStatus)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
} 