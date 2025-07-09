using BussinessObjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces;

public interface IHelperSkillRepository
{
    Task AddAsync(HelperSkill entity);
    Task AddRangeAsync(IEnumerable<HelperSkill> entities);
} 