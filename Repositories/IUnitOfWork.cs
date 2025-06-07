using Repositories.Interfaces;

namespace Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }

    Task<int> CompleteAsync();
}