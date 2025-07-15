using System.Collections.Generic;
using System.Threading.Tasks;
using Services.DTOs.Service; 

namespace Services.Interfaces
{
    public interface IServiceService : IBaseService<ServiceDto, ServiceDto, ServiceDto>
    {
        Task<IEnumerable<ServiceDto>> GetActiveServicesAsync();
    }
} 
