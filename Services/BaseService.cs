using AutoMapper;
using Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class BaseService<TDetailDto, TCreateDto, TUpdateDto, TEntity>(IBaseRepository<TEntity> baseRepository, IMapper mapper, IUnitOfWork _unitOfWork)
        : IBaseService<TDetailDto, TCreateDto, TUpdateDto> where TEntity : class
    {
        public async Task<TDetailDto> CreateAsync(TCreateDto dto)
        {
            try{
                await baseRepository.AddAsync(mapper.Map<TEntity>(dto));
            }
            catch
            {
                // Log the exception
                throw new Exception("An error occurred while creating the entity.");
            }
            finally
            {
                await _unitOfWork.CompleteAsync();
            }
            return default;
        }

        public async Task DeleteAsync(int id)
        {
            if (!await ExistsAsync(id)) return;
            try
            {
                // in case using fan in fan out pattern
                await baseRepository.DeleteByIdAsync(id);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("An error occurred while deleting the entity.", ex);
            }
            finally
            {
                await _unitOfWork.CompleteAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return (await baseRepository.GetByIdAsync(id, true)) != null;
        }

        public async Task<IEnumerable<TDetailDto>> GetAllAsync()
        {
            var entities = await baseRepository.GetAllAsync();
            return mapper.Map<IEnumerable<TDetailDto>>(entities);
        }

        public async Task<TDetailDto> GetByIdAsync(int id, bool asNoTracking = false)
        {
            var entity = await baseRepository.GetByIdAsync(id, asNoTracking);
            return mapper.Map<TDetailDto>(entity);
        }

        public async Task<TDetailDto> UpdateAsync(int id, TUpdateDto dto)
        {
            if (!await ExistsAsync(id)) return default;
            try
            {
                baseRepository.Update(mapper.Map<TEntity>(dto));
            } catch (Exception ex)
            {
                // Log the exception
                throw new Exception("An error occurred while updating the entity.", ex);
            }
            finally
            {
                await _unitOfWork.CompleteAsync();
            }
            return default;
        }
    }
}
