using AutoMapper;
using Repositories;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessObjects.Models;

namespace Services.Implements
{
    public class ServiceService(IServiceRepository _serviceRepo, IMapper _mapper, IUnitOfWork _unitofWork) :BaseService<Service, Service, Service, Service>(_serviceRepo, _mapper, _unitofWork), Services.Interfaces.IServiceService
    {
    }
}
