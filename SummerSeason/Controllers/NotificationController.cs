using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;

namespace SummerSeason.Controllers
{
[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _service;

    public NotificationsController(NotificationService service)
    {
        _service = service;
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
}
}