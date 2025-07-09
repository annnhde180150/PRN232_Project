using System;

namespace Services.DTOs.Helper;

public class HelperSkillDto
{
    public int? HelperSkillId { get; set; }
    public int ServiceId { get; set; }
    public int? YearsOfExperience { get; set; }
    public bool? IsPrimarySkill { get; set; }
} 