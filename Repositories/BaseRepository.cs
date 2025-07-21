using System.Linq.Expressions;
using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace Repositories;

public class BaseRepository<T>(Prn232HomeHelperFinderSystemContext context) : IBaseRepository<T>
    where T : class
{
    protected readonly Prn232HomeHelperFinderSystemContext _context = context;
    private readonly DbSet<T> _dbSet = context.Set<T>();

    public virtual IQueryable<T> GetQueryable(params Expression<Func<T, object>>[] includes)
    {
        var result = _dbSet.AsNoTracking();
        foreach(var include in includes)
        {
            result = result.Include(include);
        }
        return result;
    }
    //Users.GetQueryable(u => u.UserRoles, u => u.UserSkills);

    public virtual async Task<T?> GetByIdAsync(int id, bool asNoTracking = false)
    {
        var result = await _dbSet.FindAsync(id);
        if (asNoTracking)
            _dbSet.Entry(result).State = EntityState.Detached;
        return result;
    }

    public async Task<T?> FindFirstAsync(Expression<Func<T, bool>> predicate, bool asNoTracking = false)
    {
        if(asNoTracking)
            return await _dbSet.AsNoTracking().FirstOrDefaultAsync(predicate);
        return await _dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.AsNoTracking().ToListAsync();
    }

    public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AsNoTracking().Where(predicate).ToListAsync();
    }

    public virtual async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public virtual async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
    }

    public virtual void Update(T entity)
    {
        _dbSet.Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }

    public virtual void Delete(T entity)
    {
        if (_context.Entry(entity).State == EntityState.Detached) _dbSet.Attach(entity);

        _dbSet.Remove(entity);
    }

    public virtual async Task DeleteByIdAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null) Delete(entity);
    }

    public virtual void DeleteRange(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public virtual async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.CountAsync(predicate);
    }
}