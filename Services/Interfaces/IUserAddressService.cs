using Services.DTOs.UserAddress;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IUserAddressService : IBaseService<UserAddressDetailDto, UserAddressCreateDto, UserAddressUpdateDto>
    {
        public Task<bool> isValidVietnamAddress(int longtitude, int latitude);
    }
}
