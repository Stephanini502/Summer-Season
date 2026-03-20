using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;

namespace SummerSeason.Controllers;

[ApiController]
[Route("api/leagues")]
public class LeagueRefereeController : ControllerBase
{
    private readonly LeagueRefereeService _service;

    public LeagueRefereeController(LeagueRefereeService service)
    {
        _service = service;
    }

    [HttpGet("{leagueId}/referees")]
    public async Task<IActionResult> GetReferees(int leagueId)
    {
        try
        {
            var referees = await _service.GetRefereesByLeagueAsync(leagueId);
            return Ok(referees);
        }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [HttpPost("{leagueId}/referees/{userId}")]
    public async Task<IActionResult> AssignReferee(int leagueId, int userId)
    {
        try
        {
            await _service.AssignRefereeAsync(leagueId, userId);
            return Ok();
        }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [HttpDelete("{leagueId}/referees/{userId}")]
    public async Task<IActionResult> RemoveReferee(int leagueId, int userId)
    {
        try
        {
            await _service.RemoveRefereeAsync(leagueId, userId);
            return Ok();
        }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [HttpGet("referee/{userId}")]
    public async Task<IActionResult> GetLeaguesByReferee(int userId)
    {
        try
        {
            var leagues = await _service.GetLeaguesByRefereeAsync(userId);
            return Ok(leagues);
        }
        catch (Exception e) { return BadRequest(e.Message); }
    }
}