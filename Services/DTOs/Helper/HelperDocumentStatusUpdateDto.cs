using System;

namespace Services.DTOs.Helper;

public class HelperDocumentStatusUpdateDto
{
    public int DocumentId { get; set; }
    public string VerificationStatus { get; set; } = null!;
    public int? VerifiedByAdminId { get; set; }
    public string? Notes { get; set; }
} 