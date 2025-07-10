using System.Collections.Generic;
using System.Threading.Tasks;
using Services.DTOs.Service; // Will create this DTO

namespace Services.Interfaces
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetActiveServicesAsync();
    }
} 