namespace BussinessObjects.Models;

public class HelperDocument
{
    public int DocumentId { get; set; }

    public int HelperId { get; set; }

    public string DocumentType { get; set; } = null!;

    public string DocumentUrl { get; set; } = null!;

    public DateTime? UploadDate { get; set; }

    public string? VerificationStatus { get; set; }

    public int? VerifiedByAdminId { get; set; }

    public DateTime? VerificationDate { get; set; }

    public string? Notes { get; set; }

    public virtual Helper Helper { get; set; } = null!;

    public virtual AdminUser? VerifiedByAdmin { get; set; }
}