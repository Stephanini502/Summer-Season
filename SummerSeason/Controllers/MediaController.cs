using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.Dtos;
namespace SummerSeason.Controllers
{

[ApiController]
[Route("api/media")]
public class MediaController : ControllerBase
{
    private readonly MediaService _mediaService;

    public MediaController(MediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost("league/{leagueId}")]
    public async Task<IActionResult> UploadForLeague(int leagueId, IFormFile file, [FromQuery] string type = "image")
    {
        if (file == null || file.Length == 0) return BadRequest("File mancante");
        var folder = $"summerseason/leagues/{type}s";
        var media = await _mediaService.UploadAndSaveAsync(file, type, leagueId, null, folder);
        return Ok(new { media.Id, media.Url, media.Type });
    }

    [HttpPost("challenge/{challengeId}")]
    public async Task<IActionResult> UploadForChallenge(int challengeId, IFormFile file, [FromQuery] string type = "image")
    {
        if (file == null || file.Length == 0) return BadRequest("File mancante");
        var folder = $"summerseason/challenges/{type}s";
        var media = await _mediaService.UploadAndSaveAsync(file, type, null, challengeId, folder);
        return Ok(new { media.Id, media.Url, media.Type });
    }

    [HttpDelete("{mediaId}")]
    public async Task<IActionResult> Delete(int mediaId)
    {
        await _mediaService.DeleteAsync(mediaId);
        return Ok();
    }

    [HttpGet("league/{leagueId}")]
    public async Task<IActionResult> GetByLeague(int leagueId)
    {
        var media = await _mediaService.GetByLeagueAsync(leagueId);
        return Ok(media.Select(m => new { m.Id, m.Url, m.Type }));
    }
}
}