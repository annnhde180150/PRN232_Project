using System.Linq.Expressions;

namespace Repositories;

public interface IBaseRepository<T> where T : class
{
    IQueryable<T> GetQueryable();

    Task<T?> GetByIdAsync(int id);

    Task<IEnumerable<T>> GetAllAsync();

    Task<T?> FindFirstAsync(Expression<Func<T, bool>> predicate);

    Task AddAsync(T entity);

    Task AddRangeAsync(IEnumerable<T> entities);

    void Update(T entity);

    void Delete(T entity);

    Task DeleteByIdAsync(int id);

    void DeleteRange(IEnumerable<T> entities);
}