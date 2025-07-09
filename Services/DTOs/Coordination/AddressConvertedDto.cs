using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Services.DTOs.Coordination
{
    public class AddressConvertedDto
    {
        [JsonPropertyName("place_id")]
        public int PlaceId { get; set; }
        [JsonPropertyName("lat")]
        public decimal Latitude { get; set; }
        [JsonPropertyName("lon")]
        public decimal Longitude { get; set; }
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; } = null!;
        [JsonPropertyName("addresstype")]
        public string AddressType { get; set; } = null!;
    }
}
