using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessObjects.Models;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class HelperWalletRepository(Prn232HomeHelperFinderSystemContext context)
    : BaseRepository<HelperWallet>(context), IHelperWalletRepository
    {
    }
}
