namespace Services;

public interface IBaseService<TDto>
{
    Task<IEnumerable<TDto>> GetAllAsync();
    Task<TDto> GetByIdAsync(int id);
    Task<TDto> CreateAsync(TDto dto);
    Task<TDto> UpdateAsync(int id, TDto dto);
    Task<bool> ExistsAsync(int id);
    Task DeleteAsync(int id);
}