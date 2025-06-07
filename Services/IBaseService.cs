namespace Services;

public interface IBaseService<TDto>
{
    Task<IEnumerable<TDto>> GetAllAsync();
    Task<TDto> GetByIdAsync(int id);
    Task DeleteAsync(int id);
}