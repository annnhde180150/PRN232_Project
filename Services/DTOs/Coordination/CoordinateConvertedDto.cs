using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Services.DTOs.Coordination
{
    public class CoordinateConvertedDto
    {
        [JsonPropertyName("place_id")]
        public int PlaceId { get; set; }
        [JsonPropertyName("lat")]
        public decimal Latitude { get; set; }
        [JsonPropertyName("lon")]
        public decimal Longitude { get; set; }
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; } = null!;
        [JsonPropertyName("address")]
        public APIAdressDto Address { get; set; } = null!;
    }
}
