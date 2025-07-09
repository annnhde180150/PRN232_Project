using Services.DTOs.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Admin
{
    public class AdminDetailsDto : IAppUser
    {
        public int Id { get; set; }

        public string Username { get; set; } = null!;

        public string? FullName { get; set; }

        public string? Email { get; set; }

        public DateTime? CreationDate { get; set; }

        public DateTime? LastLoginDate { get; set; }

        public bool? IsActive { get; set; }

        public string Role => "Admin";
    }
}
