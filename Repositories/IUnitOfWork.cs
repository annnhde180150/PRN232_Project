using Repositories.Interfaces;

namespace Repositories;

public interface IUnitOfWork
{
    IAdminRepository Admins { get; }
    IUserRepository Users { get; }
    IHelperRepository Helpers { get; }
    INotificationRepository Notifications { get; }
    IConnectionRepository Connections { get; }
    IChatRepository Chats { get; }
    IBookingRepository Bookings { get; }
    IPaymentRepository Payments { get; }
    IReviewRepository Reviews { get; }
    IServiceRepository Services { get; }
    IServiceRequestRepository ServiceRequest { get; }
    IUserAddressRepository addressRepository { get; }
    IHelperSkillRepository HelperSkills { get; }
    IHelperWorkAreaRepository HelperWorkAreas { get; }
    IHelperDocumentRepository HelperDocuments { get; }
    IFavoriteHelperRepository FavoriteHelpers { get; }
    IReviewReportRepository ReviewReports { get; }
    IHelperWalletRepository HelperWallets { get; }

    Task<int> CompleteAsync();
}