namespace Services.DTOs.FavoriteHelper;

public class FavoriteHelperDetailsDto
{
    public int FavoriteId { get; set; }
    public int UserId { get; set; }
    public int HelperId { get; set; }
    public DateTime? DateAdded { get; set; }

    // Add this nested class for helper info
    public HelperInfoDto? HelperInfo { get; set; }
}

public class HelperInfoDto
{
    public int HelperId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? ProfilePictureUrl { get; set; }
} 