using BussinessObjects.Models;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class UserAddressRepository(Prn232HomeHelperFinderSystemContext _context) :
        BaseRepository<UserAddress>(_context), IUserAddressRepository
    {
    }
}
