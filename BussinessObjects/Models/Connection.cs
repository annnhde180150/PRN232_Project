namespace BussinessObjects.Models;

public class Connection
{
    public long Id { get; set; }

    public string UserId { get; set; } = null!;

    public string UserType { get; set; } = null!; // "User" or "Helper"

    public string ConnectionId { get; set; } = null!;

    public DateTime ConnectedAt { get; set; }

    public DateTime? DisconnectedAt { get; set; }

    public bool IsActive { get; set; }

    public string? DeviceInfo { get; set; }

    public string? IpAddress { get; set; }
}