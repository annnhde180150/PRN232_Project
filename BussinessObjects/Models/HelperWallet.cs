namespace BussinessObjects.Models;

public class HelperWallet
{
    public int WalletId { get; set; }

    public int HelperId { get; set; }

    public decimal? Balance { get; set; }

    public DateTime? LastUpdatedTime { get; set; }

    public string? CurrencyCode { get; set; }

    public virtual Helper Helper { get; set; } = null!;

    public virtual ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();

    public virtual ICollection<WithdrawalRequest> WithdrawalRequests { get; set; } = new List<WithdrawalRequest>();
}