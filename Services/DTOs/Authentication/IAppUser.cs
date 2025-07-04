using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.Authentication
{
    public interface IAppUser
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string Role { get; }
    }
}
