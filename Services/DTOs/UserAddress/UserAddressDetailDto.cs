using BussinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.UserAddress
{
    public class UserAddressDetailDto
    {
        public int AddressId { get; set; }

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

        public virtual ICollection<BussinessObjects.Models.Booking> Bookings { get; set; } = new List<BussinessObjects.Models.Booking>();

        public virtual ICollection<BussinessObjects.Models.ServiceRequest> ServiceRequests { get; set; } = new List<BussinessObjects.Models.ServiceRequest>();

        public virtual BussinessObjects.Models.User User { get; set; } = null!;
    }
}
