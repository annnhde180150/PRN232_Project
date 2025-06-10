using BussinessObjects.Models;
using Repositories.Implements;
using Repositories.Interfaces;

namespace Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly Prn232HomeHelperFinderSystemContext _context;

    public UnitOfWork(Prn232HomeHelperFinderSystemContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        Notifications = new NotificationRepository(_context);
    }

    public IUserRepository Users { get; }
    public INotificationRepository Notifications { get; }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}