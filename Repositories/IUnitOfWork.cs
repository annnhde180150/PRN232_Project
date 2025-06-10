using Repositories.Interfaces;

namespace Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    INotificationRepository Notifications { get; }

    Task<int> CompleteAsync();
}