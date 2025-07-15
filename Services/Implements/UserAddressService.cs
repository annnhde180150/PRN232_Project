using Services.DTOs.UserAddress;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessObjects.Models;
using Repositories.Interfaces;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Repositories;
using Microsoft.Extensions.Configuration;

namespace Services.Implements
{
    public class UserAddressService(IUnitOfWork _unitOfWork, IMapper _mapper, ILogger<UserAddressService> _logger, IConfiguration _config) :
        BaseService<UserAddressDetailDto, UserAddressCreateDto, UserAddressUpdateDto, UserAddress>(_unitOfWork.addressRepository, _mapper, _unitOfWork),
        IUserAddressService
    {

        public async Task<bool> isValidVietnamAddress(int longtitude, int latitude)
        {
            var url = _config["AddressConverter:CoordinateUrl"];
            url = url.Replace("{longtitude}", longtitude.ToString()).Replace("{latitude}", latitude.ToString());
            HttpClient client = new HttpClient()
            {
                BaseAddress = new Uri(url)
            };
            var response = await client.GetAsync("");
            return true;
        }

        public async Task<IEnumerable<UserAddressDetailDto>> GetByUserIdAsync(int userId)
        {
            var addresses = await _unitOfWork.addressRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<UserAddressDetailDto>>(addresses);
        }

        public async Task<UserAddressDetailDto> UpdateUserAddress(int id, UserAddressUpdateDto dto)
        {
            _logger.LogInformation($"Updating user address with ID: {id}");

            var existingAddress = await _unitOfWork.addressRepository.GetByIdAsync(id);
            if (existingAddress == null) throw new ArgumentException($"User address with ID {id} not found");

            _mapper.Map(dto, existingAddress);
            _unitOfWork.addressRepository.Update(existingAddress);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<UserAddressDetailDto>(existingAddress);

        }
    }
}
