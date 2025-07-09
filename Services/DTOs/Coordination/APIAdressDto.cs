using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Services.DTOs.Coordination
{
    public class APIAdressDto
    {
        [JsonPropertyName("road")]
        public string Road { get; set; } = null!;
        [JsonPropertyName("quarter")]
        public string Quarter { get; set; } = null!;
        [JsonPropertyName("suburb")]
        public string Suburb { get; set; } = null!;
        [JsonPropertyName("city")]
        public string City { get; set; } = null!;
        [JsonPropertyName("county")]
        public string county { get; set; } = null!;
        [JsonPropertyName("state")]
        public string State { get; set; } = null!;
        [JsonPropertyName("postcode")]
        public string Postcode { get; set; } = null!;
        [JsonPropertyName("country")]
        public string Country { get; set; } = null!;
        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; } = null!;

    }
}
