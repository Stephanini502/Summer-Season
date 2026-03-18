using Microsoft.AspNetCore.Mvc;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Dtos;

namespace SummerSeason.Controllers;

[ApiController]
[Route("api/bonusmalus")]
public class BonusMalusController : ControllerBase
{
    private readonly AppDbContext _context;

    public BonusMalusController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.BonusMalus
            .Where(b => b.DeletedAt == default)
            .Select(b => new { b.Id, b.Name, b.Description, b.Points, b.Type })
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("bonus")]
    public async Task<IActionResult> GetBonus()
    {
        var items = await _context.BonusMalus
            .Where(b => b.DeletedAt == default && b.Type == "Bonus")
            .Select(b => new { b.Id, b.Name, b.Description, b.Points })
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("malus")]
    public async Task<IActionResult> GetMalus()
    {
        var items = await _context.BonusMalus
            .Where(b => b.DeletedAt == default && b.Type == "Malus")
            .Select(b => new { b.Id, b.Name, b.Description, b.Points })
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.BonusMalus
            .Where(b => b.Id == id && b.DeletedAt == default)
            .Select(b => new { b.Id, b.Name, b.Description, b.Points, b.Type })
            .FirstOrDefaultAsync();

        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BonusMalusRequestDto dto)
    {
        var item = new BonusMalus
        {
            Name = dto.Name,
            Description = dto.Description,
            Points = dto.Points,
            Type = dto.Type
        };

        await _context.BonusMalus.AddAsync(item);
        await _context.SaveChangesAsync();

        return Ok(new { item.Id, item.Name, item.Description, item.Points, item.Type });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BonusMalusRequestDto dto)
    {
        var item = await _context.BonusMalus.FindAsync(id);
        if (item == null) return NotFound();

        item.Name = dto.Name;
        item.Description = dto.Description;
        item.Points = dto.Points;
        item.Type = dto.Type;

        await _context.SaveChangesAsync();
        return Ok(new { item.Id, item.Name, item.Description, item.Points, item.Type });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.BonusMalus.FindAsync(id);
        if (item == null) return NotFound();

        item.DeletedAt = DateTime.Now;
        await _context.SaveChangesAsync();
        return Ok($"BonusMalus con id {id} eliminato");
    }

    [HttpPost("reload")]
    public async Task<IActionResult> ReloadFromJson()
    {
        try
        {
            var service = new BonusMalusService(_context);
            await service.ParseJson();
            return Ok("BonusMalus aggiornati dal file JSON");
        }
        catch (Exception ex)
        {
            return BadRequest($"Errore: {ex.Message}");
        }
    }
}