namespace Services;

public interface IBaseService<TDetailDto, in TCreateDto, in TUpdateDto>
{
    Task<IEnumerable<TDetailDto>> GetAllAsync();
    Task<TDetailDto> GetByIdAsync(int id, bool asNoTracking = false);
    Task<TDetailDto> CreateAsync(TCreateDto dto);
    Task<TDetailDto> UpdateAsync(int id, TUpdateDto dto);
    Task<bool> ExistsAsync(int id);
    Task DeleteAsync(int id);
}