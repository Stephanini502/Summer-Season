using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace SummerSeason.Controllers;

[ApiController]
[Route("api/challenges")]
public class ChallengeController : ControllerBase
{
    private readonly ChallengeService _service;

    public ChallengeController(ChallengeService service)
        {
            _service = service;
        }

    [HttpPost]
    public async Task<IActionResult> AddChallenge(ChallengeRequestDto dto)
    {
        try
        {
            await _service.AddChallenge(dto);
            return Ok("Challenge successfully created");
        }catch(Exception e)
        {
            return BadRequest($"Error creating challenge {dto.Name}");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<ChallengeResponseDto>>> GetChallenges()
    {
        List<ChallengeResponseDto> challenges = await _service.GetChallenges();

        return challenges;
    }

    [HttpGet("{leagueId}")]
    public async Task<List<ChallengeResponseDto>> GetChallengesByLeagueId(int leagueId)
    {
        return await _service.GetChallengesByLeagueId(leagueId);
    }

    [HttpPut("{challengeId}")]
    public async Task<ChallengeResponseDto> UpdateChallenge(int challengeId, [FromBody] ChallengeRequestDto dto)
    {
        return await _service.UpdateChallenges(challengeId, dto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveChallenge(int id)
    {
        await _service.RemoveChallengeById(id);
        return Ok($"Challenge with id: {id} successfully deleted");
    }      
}