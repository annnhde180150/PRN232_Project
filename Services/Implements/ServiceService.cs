using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Repositories.Interfaces;
using Services.DTOs.Service;
using Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BussinessObjects.Models;

namespace Services.Implements
{
    public class ServiceService(ILogger<ServiceService> _logger, IMapper _mapper, IUnitOfWork _unitOfWork) : BaseService<ServiceDto,ServiceDto,ServiceDto,Service>(_unitOfWork.Services, _mapper, _unitOfWork),IServiceService
    {

        public async Task<IEnumerable<ServiceDto>> GetActiveServicesAsync()
        {
            var services = await _unitOfWork.Services.GetActiveServicesAsync();
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }
    }
} 
