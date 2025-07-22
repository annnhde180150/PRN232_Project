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
        Admins = new AdminRepository(_context);
        Users = new UserRepository(_context);
        Helpers = new HelperRepository(_context);
        Notifications = new NotificationRepository(_context);
        Connections = new ConnectionRepository(_context);
        Chats = new ChatRepository(_context);
        Bookings = new BookingRepository(_context);
        Payments = new PaymentRepository(_context);
        Reviews = new ReviewRepository(_context);
        Services = new ServiceRepository(_context);
        ServiceRequest = new ServiceRequestRepository(_context);
        addressRepository = new UserAddressRepository(_context);
        HelperSkills = new HelperSkillRepository(_context);
        HelperWorkAreas = new HelperWorkAreaRepository(_context);
        HelperDocuments = new HelperDocumentRepository(_context);
        FavoriteHelpers = new FavoriteHelperRepository(context);
        ReviewReports = new ReviewReportRepository(_context);
        HelperWallets = new HelperWalletRepository(_context);
    }

    public IAdminRepository Admins { get; }
    public IUserRepository Users { get; }
    public IHelperRepository Helpers { get; }
    public INotificationRepository Notifications { get; }
    public IConnectionRepository Connections { get; }
    public IChatRepository Chats { get; }
    public IBookingRepository Bookings { get; }
    public IPaymentRepository Payments { get; }
    public IReviewRepository Reviews { get; }
    public IServiceRepository Services { get; }
    public IFavoriteHelperRepository FavoriteHelpers { get; }
    public IReviewReportRepository ReviewReports { get; }

    public IServiceRequestRepository ServiceRequest { get; }

    public IUserAddressRepository addressRepository { get; }

    public IHelperSkillRepository HelperSkills { get; }
    public IHelperWorkAreaRepository HelperWorkAreas { get; }
    public IHelperDocumentRepository HelperDocuments { get; }
    public IHelperWalletRepository HelperWallets { get; }

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