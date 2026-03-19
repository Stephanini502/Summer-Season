using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;
using SummerSeason.Dtos;
using SummerSeason.models;

namespace SummerSeason.Controllers;

[ApiController]
[Route("api/leagues")]
public class LeagueController : ControllerBase
{
    private readonly LeagueService _service;

    public LeagueController(LeagueService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLeague([FromBody] LeagueRequestDto dto)
    {
        Console.WriteLine($"Claims ricevuti: {string.Join(", ", User.Claims.Select(c => c.Type + "=" + c.Value))}");

        try
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            Console.WriteLine($"userIdClaim: {userIdClaim}");
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID missing in token");

            int userId = int.Parse(userIdClaim);

            var leagueDto = await _service.CreateLeagueAsync(dto, userId);

            return Ok(leagueDto); 
        }
        catch (Exception e)
        {
            return BadRequest($"Error saving league {dto.Name}: " + e.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLeague(int id, [FromBody] LeagueRequestDto dto)
    {
        try
        {
            var leagueDto = await _service.UpdateLeagueAsync(id, dto);
            return Ok(leagueDto); 
        }
        catch (Exception e)
        {
            return BadRequest($"Error updating league {dto.Name}: " + e.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLeagueById(int id)
    {
        try
        {
            var leagueDto = await _service.GetLeagueByIdAsync(id);
            if (leagueDto == null) return NotFound();
            return Ok(leagueDto);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetLeagues()
    {
        var leaguesDto = await _service.GetLeaguesAsync();
        return Ok(leaguesDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveLeague(int id)
    {
        try
        {
            await _service.RemoveLeagueByIdAsync(id);
            return Ok($"League with id {id} successfully deleted");
        }
        catch (Exception e)
        {
            return BadRequest($"Error deleting league with id {id}: " + e.Message);
        }
    }

    [HttpPost("{leagueId}/participants/{participantId}")]
    public async Task<IActionResult> AddUserToLeague(int participantId, int leagueId)
    {
        try
        {
            var participantsDto = await _service.AddUserToLeagueAsync(participantId, leagueId);
            return Ok(participantsDto); 
        }
        catch (Exception e)
        {
            return BadRequest($"Error inserting participant with id {participantId}: " + e.Message);
        }
    }

    [HttpGet("{leagueId:int}/participants")]
    public async Task<IActionResult> GetParticipantsByLeagueId(int leagueId)
    {
        try
        {
            var participantsDto = await _service.GetParticipantsByLeagueIdAsync(leagueId);
            return Ok(participantsDto);
        }
        catch (Exception e)
        {
            return BadRequest($"Error loading participants for League {leagueId}: " + e.Message);
        }

        
    }
    [HttpGet("{leagueId}/ranking")]
    public async Task<ActionResult<List<UserResponseDto>>> GetLeagueRanking(int leagueId)
    {
        try
        {
            var ranking = await _service.GetLeagueRankingAsync(leagueId);
            return Ok(ranking);
        }
        catch(Exception e)
        {
            return BadRequest($"Error loading ranking for league {leagueId}: {e.Message}");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<LeagueResponseDto>>> GetLeaguesByUser(int userId)
    {
        try
        {
            List<LeagueResponseDto> dtos = await _service.GetLeaguesByUserId(userId);
            return Ok(dtos);
        }
        catch(Exception e)
        {
            return BadRequest($"Error loading League for user {userId}: " + e.Message);
        }
    }

    [HttpDelete("{leagueId}/{userId}")]
    public async Task<ActionResult> RemoveUserFromLeague(int leagueId, int userId)
    {
        try
        {
            await _service.RemoveUserFromLeague(leagueId, userId);
            return Ok($"User with id {userId} successfully deleted from league with id {leagueId}");
        }
        catch(Exception e)
        {
            return BadRequest($"Error removing user {userId} from league {leagueId}: " + e.Message);
        }
    }
}
