using Services.DTOs.Helper;

namespace Services.Interfaces;

public interface IHelperDocumentService
{
    Task<IEnumerable<HelperDocumentDto>> GetDocumentsByHelperIdAsync(int helperId);
    Task<HelperDocumentDto?> GetDocumentByIdAsync(int documentId);
    Task<bool> UpdateDocumentStatusAsync(int documentId, string verificationStatus, int? verifiedByAdminId, string? notes);
    Task<bool> ExistsAsync(int documentId);
} 