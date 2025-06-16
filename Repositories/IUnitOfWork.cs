using Repositories.Interfaces;

namespace Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IHelperRepository Helpers { get; }
    INotificationRepository Notifications { get; }
    IConnectionRepository Connections { get; }
    IChatRepository Chats { get; }

    Task<int> CompleteAsync();
}