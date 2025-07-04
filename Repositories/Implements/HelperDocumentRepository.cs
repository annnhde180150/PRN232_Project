using BussinessObjects.Models;
using Repositories.Interfaces;
using Repositories;

namespace Repositories.Implements;

public class HelperDocumentRepository(Prn232HomeHelperFinderSystemContext context) : BaseRepository<HelperDocument>(context), IHelperDocumentRepository
{
} 