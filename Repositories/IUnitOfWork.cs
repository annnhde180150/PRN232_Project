using Repositories.Interfaces;

namespace Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IHelperRepository Helpers { get; }
    INotificationRepository Notifications { get; }
    IConnectionRepository Connections { get; }
    IChatRepository Chats { get; }
    IBookingRepository Bookings { get; }
    IPaymentRepository Payments { get; }
    IReviewRepository Reviews { get; }
    IServiceRepository Services { get; }

    Task<int> CompleteAsync();
}