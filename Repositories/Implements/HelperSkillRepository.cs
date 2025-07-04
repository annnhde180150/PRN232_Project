using BussinessObjects.Models;
using Repositories.Interfaces;
using Repositories;

namespace Repositories.Implements;

public class HelperSkillRepository(Prn232HomeHelperFinderSystemContext context)
    : BaseRepository<HelperSkill>(context), IHelperSkillRepository
{
} 