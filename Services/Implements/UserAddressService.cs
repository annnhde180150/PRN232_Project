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
using System.Text.Json;
using Services.DTOs.Coordination;

namespace Services.Implements
{
    public class UserAddressService(IUnitOfWork _unitOfWork, IMapper _mapper, ILogger<UserAddressService> _logger, IConfiguration _config) :
        BaseService<UserAddressDetailDto, UserAddressCreateDto, UserAddressUpdateDto, UserAddress>(_unitOfWork.addressRepository, _mapper, _unitOfWork),
        IUserAddressService
    {

        public async Task<bool> isValidVietnamAddress(decimal longtitude, decimal latitude)
        {
            if (longtitude < 102.144m || longtitude > 109.455m || latitude < 8.337m || latitude > 23.392m)
            {
                _logger.LogWarning("Coordinates out of Vietnam bounds: {longtitude}, {latitude}", longtitude, latitude);
                return false;
            }
            var url = _config["AddressConverter:CoordinateUrl"];
            url = url.Replace("{longtitude}", longtitude.ToString()).Replace("{latitude}", latitude.ToString());
            HttpClient client = new HttpClient()
            {
                BaseAddress = new Uri(url)
            };
            client.DefaultRequestHeaders.UserAgent.ParseAdd("TestApp/1.0 (contact@example.com)");
            var response = await client.GetAsync("");
            var content = JsonSerializer.Deserialize<CoordinateConvertedDto>(await response.Content.ReadAsStringAsync());
            if(content == null || !content.Address.CountryCode.Equals("vn"))
            {
                _logger.LogWarning("Invalid address conversion response for coordinates: {longtitude}, {latitude}", longtitude, latitude);
                return false;
            }
            return true;
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
