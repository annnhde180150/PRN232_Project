namespace Services.DTOs.Chat;

public class MarkAsReadDto
{
    public List<long> ChatIds { get; set; } = new List<long>();
} 