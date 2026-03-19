using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;
using SummerSeason.Dtos;
using SummerSeason.models;

namespace SummerSeason.Controllers;


[ApiController]
[Route("api/pointrequests")]
public class PointRequestController : ControllerBase
{
    private readonly PointRequestService _service;

    public PointRequestController(PointRequestService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PointRequestDto dto)
    {
        var req = await _service.CreateAsync(dto);
        return Ok(new { req.Id, req.Status });
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var list = await _service.GetPendingAsync();
        return Ok(list);
    }

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(int id, [FromBody] AdminNoteDto? dto)
    {
        Console.WriteLine($"Approve chiamato per id={id}, dto={dto?.AdminNote}");

        try
        {
            await _service.ApproveAsync(id, dto?.AdminNote);
            return Ok();
        }
        catch (KeyNotFoundException e)   { return NotFound(e.Message); }
        catch (InvalidOperationException e) { return BadRequest(e.Message); }
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id, [FromBody] AdminNoteDto? dto)
    {
        try
        {
            await _service.RejectAsync(id, dto?.AdminNote);
            return Ok();
        }
        catch (KeyNotFoundException e)      { return NotFound(e.Message); }
        catch (InvalidOperationException e) { return BadRequest(e.Message); }
    }
}
