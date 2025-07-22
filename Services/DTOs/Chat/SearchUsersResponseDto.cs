namespace Services.DTOs.Chat;

public class SearchUsersResponseDto
{
    public List<UserSearchDto> Users { get; set; } = new List<UserSearchDto>();
    public List<HelperSearchDto> Helpers { get; set; } = new List<HelperSearchDto>();
    public int TotalUsers { get; set; }
    public int TotalHelpers { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}
