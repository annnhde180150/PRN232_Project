using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessObjects.Models;

namespace Services.DTOs.Helper
{
    public class SearchHelperDto
    {
        public int helperId { get; set; }
        public string helperName { get; set; }

        public string serviceName { get; set; }

        public string? bio { get; set; }

        public decimal? rating { get; set; }

        public virtual ICollection<HelperWorkArea> HelperWorkAreas { get; set; } = new List<HelperWorkArea>();

        public decimal? basePrice { get; set; }
        public string? availableStatus { get; set; }
    }
}
