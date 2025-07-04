using BussinessObjects.Models;
using Repositories.Interfaces;
using Repositories;

namespace Repositories.Implements;

public class HelperWorkAreaRepository(Prn232HomeHelperFinderSystemContext context) 
    : BaseRepository<HelperWorkArea>(context), IHelperWorkAreaRepository
{
} 