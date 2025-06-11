using Repositories.Interfaces;

namespace Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    INotificationRepository Notifications { get; }
    IConnectionRepository Connections { get; }

    Task<int> CompleteAsync();
}