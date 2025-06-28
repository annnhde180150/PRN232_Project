using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Admin;

public class AdminUpdateDto
{
    [StringLength(100)]
    public string? Username { get; set; }

    [StringLength(100)]
    public string? FullName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? Role { get; set; }

    public bool? IsActive { get; set; }
}
