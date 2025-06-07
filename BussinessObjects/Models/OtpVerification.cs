namespace BussinessObjects.Models;

public class OtpVerification
{
    public int OtpId { get; set; }

    public string Identifier { get; set; } = null!;

    public string OtpCode { get; set; } = null!;

    public DateTime ExpiryDateTime { get; set; }

    public bool? IsVerified { get; set; }

    public int? AttemptCount { get; set; }

    public DateTime? CreationDateTime { get; set; }
}