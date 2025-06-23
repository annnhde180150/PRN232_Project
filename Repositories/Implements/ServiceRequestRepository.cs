using BussinessObjects.Models;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class ServiceRequestRepository(Prn232HomeHelperFinderSystemContext context)
        : BaseRepository<ServiceRequest>(context), IServiceRequestRepository
    {

    }
}
