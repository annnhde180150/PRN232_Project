using System;

namespace Services.DTOs.Helper;

public class HelperDocumentDto
{
    public int? DocumentId { get; set; }
    public string DocumentType { get; set; } = null!;
    public string DocumentUrl { get; set; } = null!;
    public DateTime? UploadDate { get; set; }
    public string? VerificationStatus { get; set; }
    public int? VerifiedByAdminId { get; set; }
    public DateTime? VerificationDate { get; set; }
    public string? Notes { get; set; }
} 