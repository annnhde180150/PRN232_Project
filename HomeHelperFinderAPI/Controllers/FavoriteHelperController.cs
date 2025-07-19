using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.FavoriteHelper;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class FavoriteHelperController : ControllerBase
{
    private readonly IFavoriteHelperService _favoriteHelperService;

    public FavoriteHelperController(IFavoriteHelperService favoriteHelperService)
    {
        _favoriteHelperService = favoriteHelperService;
    }

    [HttpPost]
    public async Task<ActionResult<FavoriteHelperDetailsDto>> AddFavorite([FromBody] FavoriteHelperCreateDto dto)
    {
        var result = await _favoriteHelperService.AddFavoriteAsync(dto);
        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<FavoriteHelperDetailsDto>>> GetFavoritesByUser(int userId)
    {
        var result = await _favoriteHelperService.GetFavoritesByUserAsync(userId);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteFavorite([FromBody] FavoriteHelperDeleteDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _favoriteHelperService.DeleteFavoriteAsync(dto);
        if (!result) 
            return NotFound(new { message = "Helper not found or already deleted" });
        
        return Ok(new { message = "Helper moved successfully" });
    }
} 