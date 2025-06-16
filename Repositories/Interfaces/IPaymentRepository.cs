using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IPaymentRepository : IBaseRepository<Payment>
{
    Task<IEnumerable<Payment>> GetPaymentsByUserIdAsync(int userId);
    Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(string status);
    Task<IEnumerable<Payment>> GetPaymentsByMethodAsync(string method);
    Task<decimal> GetTotalPaymentsAsync();
    Task<decimal> GetSuccessfulPaymentsTotalAsync();
    Task<int> GetPaymentCountByStatusAsync(string status);
    Task<Dictionary<string, decimal>> GetPaymentsByMethodBreakdownAsync();
    Task<Dictionary<string, int>> GetPaymentStatusBreakdownAsync();
} 