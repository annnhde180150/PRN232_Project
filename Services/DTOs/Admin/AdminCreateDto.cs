using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Admin;

public class AdminCreateDto
{
    [Required]
    [StringLength(100)]
    public string Username { get; set; } = null!;

    [Required]
    [StringLength(200)]
    public string PasswordHash { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string Role { get; set; } = null!;

    public bool? IsActive { get; set; } = true;
}
