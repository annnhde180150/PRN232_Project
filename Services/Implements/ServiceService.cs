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

namespace Services.Implements
{
    public class ServiceService : IServiceService
    {
        private readonly ILogger<ServiceService> _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public ServiceService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ServiceService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ServiceDto>> GetActiveServicesAsync()
        {
            var services = await _unitOfWork.Services.GetActiveServicesAsync();
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }
    }
} 
