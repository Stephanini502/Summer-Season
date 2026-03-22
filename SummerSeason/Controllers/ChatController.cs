using Microsoft.AspNetCore.Mvc;
using SummerSeason.data;
using SummerSeason.Enums;
using Microsoft.EntityFrameworkCore;

namespace SummerSeason.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChatController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("league/{leagueId}/{roomType}")]
    public async Task<IActionResult> GetMessages(int leagueId, string roomType)
    {
        var type = roomType == "staff" ? ChatRoomType.Staff : ChatRoomType.League;
        var messages = await _context.Chat
            .Where(m => m.LeagueId == leagueId && m.Type == type)
            .Include(m => m.Sender)
            .OrderBy(m => m.CreatedAt)
            .Take(100)
            .Select(m => new {
                m.Id, m.Content, m.CreatedAt,
                Sender = new { m.Sender.Id, m.Sender.Name, m.Sender.Surname, m.Sender.UserName }
            })
            .ToListAsync();
        return Ok(messages);
    }
}