using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.OtpVerification
{
    public class OtpVerificationRequestDto
    {
        public string Email { get; set; }
        public string OtpCode { get; set; }
    }
}
