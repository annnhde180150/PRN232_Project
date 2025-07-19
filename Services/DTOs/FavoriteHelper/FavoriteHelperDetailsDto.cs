namespace Services.DTOs.FavoriteHelper;

public class FavoriteHelperDetailsDto
{
    public int FavoriteId { get; set; }
    public int UserId { get; set; }
    public int HelperId { get; set; }
    public DateTime? DateAdded { get; set; }
} 