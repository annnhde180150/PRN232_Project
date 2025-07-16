using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.UserAddress
{
    public class UserAddressUpdateDto
    {

        public int UserId { get; set; }

        public string AddressLine1 { get; set; } = null!;

        public string? AddressLine2 { get; set; }

        public string? Ward { get; set; }

        public string District { get; set; } = null!;

        public string City { get; set; } = null!;

        public string? FullAddress { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public bool? IsDefault { get; set; }
    }
}
