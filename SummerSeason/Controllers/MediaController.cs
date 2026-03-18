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
    private readonly UserService _userService;

    public MediaController(MediaService mediaService, UserService userService)
    {
        _mediaService = mediaService;
        _userService = userService;
    }

    [HttpPost("league/{leagueId}")]
    [RequestSizeLimit(524288000)]     
    [RequestFormLimits(MultipartBodyLengthLimit = 524288000)]
    public async Task<IActionResult> UploadForLeague(int leagueId, IFormFile file, [FromQuery] string type = "image")
    {
        if (file == null || file.Length == 0) return BadRequest("File mancante");
        var folder = $"summerseason/leagues/{type}s";
        var media = await _mediaService.UploadAndSaveAsync(file, type, leagueId, null, folder);
        return Ok(new { media.Id, media.Url, media.Type });
    }

    [HttpPost("challenge/{challengeId}")]
    [RequestSizeLimit(524288000)]     
    [RequestFormLimits(MultipartBodyLengthLimit = 524288000)]
    public async Task<IActionResult> UploadForChallenge(int challengeId, int leagueId, IFormFile file, [FromQuery] string type = "image")
    {
        if (file == null || file.Length == 0) return BadRequest("File mancante");
        var folder = $"summerseason/challenges/{type}s";
        var media = await _mediaService.UploadAndSaveAsync(file, type, leagueId, challengeId, folder);
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
    
    [HttpPost("user/{userId}/avatar")]
    [RequestSizeLimit(10485760)] // 10MB
    [RequestFormLimits(MultipartBodyLengthLimit = 10485760)]
    public async Task<IActionResult> UploadAvatar(int userId, IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File mancante");
        var folder = "summerseason/avatars";
        var media = await _mediaService.UploadAndSaveAsync(file, "image", null, null, folder);
        // salva l'url sull'utente — aggiungi AvatarUrl al modello User e un endpoint PUT
        await _userService.SetAvatarAsync(userId, media.Url);
        return Ok(new { media.Url });
    }
}
}