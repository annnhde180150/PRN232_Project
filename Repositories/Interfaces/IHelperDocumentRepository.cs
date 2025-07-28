using BussinessObjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces;

public interface IHelperDocumentRepository : IBaseRepository<HelperDocument>
{
    Task<IEnumerable<HelperDocument>> GetDocumentsByHelperIdAsync(int helperId);
    Task<HelperDocument?> GetDocumentByIdAsync(int documentId);
    Task<bool> UpdateDocumentStatusAsync(int documentId, string verificationStatus, int? verifiedByAdminId, string? notes);
} 