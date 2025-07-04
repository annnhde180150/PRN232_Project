using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Helper
{
    public class HelperViewIncomeDto
    {
        public int WalletId { get; set; }

        public int HelperId { get; set; }

        public decimal? Balance { get; set; }

        public DateTime? LastUpdatedTime { get; set; }

        public string? CurrencyCode { get; set; }
    }
}
