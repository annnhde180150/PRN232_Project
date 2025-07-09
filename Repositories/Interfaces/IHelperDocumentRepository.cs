using BussinessObjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces;

public interface IHelperDocumentRepository
{
    Task AddAsync(HelperDocument entity);
    Task AddRangeAsync(IEnumerable<HelperDocument> entities);
} 