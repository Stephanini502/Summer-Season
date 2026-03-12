using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.Dtos;

namespace SummerSeason.Controllers
{

[ApiController]
[Route("api/results")]
public class ResultsController : ControllerBase
{
    private readonly ResultService _service;

    public ResultsController(ResultService resultService)
        {
            _service = resultService;
        }
    
    [HttpPost]
    public async Task<IActionResult> addResult([FromBody] ResultRequestDto result)
        {
            try
            {
                await _service.AddResultAsync(result);
                return Ok("Result successfully saved");
            }catch(Exception e)
            {
                return BadRequest("Error during result saving: " + e.Message);
            }
        }
    
    [HttpGet("ranking")]
    public async Task<ActionResult<List<UserResponseDto>>> getRanking()
    {
        var ranking = await _service.GetRankingAsync();
        return Ok(ranking);
    }

    [HttpGet("weeklyResults/{userId}")]
    public async Task<ActionResult<int>> getWeeklyResults(int userId)
        {
            try
            {
                return await _service.GetWeeklyResults(userId);
            }catch(Exception e)
            {
                return BadRequest($"Error loading weekly results for user with id {userId}: " + e.Message);
            }
        }

    }
}