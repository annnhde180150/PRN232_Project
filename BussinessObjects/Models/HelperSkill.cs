namespace BussinessObjects.Models;

public class HelperSkill
{
    public int HelperSkillId { get; set; }

    public int HelperId { get; set; }

    public int ServiceId { get; set; }

    public int? YearsOfExperience { get; set; }

    public bool? IsPrimarySkill { get; set; }

    public virtual Helper Helper { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}