﻿using BussinessObjects.Models;
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
        Helpers = new HelperRepository(_context);
        Notifications = new NotificationRepository(_context);
        Connections = new ConnectionRepository(_context);
        Chats = new ChatRepository(_context);
        Bookings = new BookingRepository(_context);
        Payments = new PaymentRepository(_context);
        Reviews = new ReviewRepository(_context);
        Services = new ServiceRepository(_context);
    }

    public IUserRepository Users { get; }
    public IHelperRepository Helpers { get; }
    public INotificationRepository Notifications { get; }
    public IConnectionRepository Connections { get; }
    public IChatRepository Chats { get; }
    public IBookingRepository Bookings { get; }
    public IPaymentRepository Payments { get; }
    public IReviewRepository Reviews { get; }
    public IServiceRepository Services { get; }

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