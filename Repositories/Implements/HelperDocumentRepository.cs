using BussinessObjects.Models;
using Repositories.Interfaces;
using Repositories;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Implements;

public class HelperDocumentRepository(Prn232HomeHelperFinderSystemContext context) : BaseRepository<HelperDocument>(context), IHelperDocumentRepository
{
    public async Task<IEnumerable<HelperDocument>> GetDocumentsByHelperIdAsync(int helperId)
    {
        return await _context.HelperDocuments
            .Where(d => d.HelperId == helperId)
            .Include(d => d.Helper)
            .Include(d => d.VerifiedByAdmin)
            .ToListAsync();
    }

    public async Task<HelperDocument?> GetDocumentByIdAsync(int documentId)
    {
        return await _context.HelperDocuments
            .Include(d => d.Helper)
            .Include(d => d.VerifiedByAdmin)
            .FirstOrDefaultAsync(d => d.DocumentId == documentId);
    }

    public async Task<bool> UpdateDocumentStatusAsync(int documentId, string verificationStatus, int? verifiedByAdminId, string? notes)
    {
        var document = await _context.HelperDocuments.FindAsync(documentId);
        if (document == null)
            return false;

        document.VerificationStatus = verificationStatus;
        document.VerifiedByAdminId = verifiedByAdminId;
        document.VerificationDate = DateTime.Now;
        document.Notes = notes;

        _context.HelperDocuments.Update(document);
        await _context.SaveChangesAsync();
        return true;
    }
} 