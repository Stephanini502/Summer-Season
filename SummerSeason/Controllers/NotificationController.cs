using Microsoft.AspNetCore.Mvc;
using SummerSeason.data;
using SummerSeason.Dtos;
using SummerSeason.Enums;
using SummerSeason.Services;
using Microsoft.EntityFrameworkCore;


namespace SummerSeason.Controllers
{
[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _service;

    private readonly AppDbContext _context;

    public NotificationsController(NotificationService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetForUser(int userId)
    {
        var list = await _service.GetForUserAsync(userId);
        return Ok(list);
    }

    [HttpGet("user/{userId}/unread-count")]
    public async Task<IActionResult> UnreadCount(int userId)
    {
        var count = await _service.GetUnreadCountAsync(userId);
        return Ok(new { count });
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        try
        {
            await _service.MarkReadAsync(id);
            return Ok();
        }
        catch (KeyNotFoundException e) { return NotFound(e.Message); }
    }

    [HttpPut("user/{userId}/read-all")]
    public async Task<IActionResult> MarkAllRead(int userId)
    {
        await _service.MarkAllReadAsync(userId);
        return Ok();
    }

    public async Task ProposeChangeAsync(int challengeId, ChallengeRequestDto dto, int refereeId)
    {
        var challenge = await _context.Challenges.FindAsync(challengeId)
            ?? throw new Exception("Sfida non trovata");

        var referee = await _context.Users.FindAsync(refereeId)
            ?? throw new Exception("Arbitro non trovato");
        
        var admins = (await _context.Users.ToListAsync())
            .Where(u => u.Roles.Contains(UserType.Admin))
            .ToList();

        var message = $"L'arbitro {referee.Name} {referee.Surname} propone di modificare la sfida '{challenge.Name}': " +
                    $"Nome: {dto.Name}, Descrizione: {dto.Description}, Punti: {dto.Points}";

        foreach (var admin in admins)
        {
            await _service.CreateAsync(
                admin.Id,
                "ChallengeProposal",
                message
            );
        }
    }
}
}