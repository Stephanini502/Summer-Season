namespace SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;

public class NotificationService
{

    private readonly AppDbContext _ctx;

    public NotificationService(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<List<Notification>> GetForUserAsync(int userId)
    {
        return await _ctx.Notifications
            .Where(n => n.ReceiverUserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(30)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _ctx.Notifications
            .CountAsync(n => n.ReceiverUserId == userId && !n.IsRead);
    }

    public async Task MarkReadAsync(int notificationId)
    {
        var n = await _ctx.Notifications.FindAsync(notificationId);
        if (n == null)
            throw new KeyNotFoundException("Notifica non trovata");

        n.IsRead = true;
        await _ctx.SaveChangesAsync();
    }

    public async Task MarkAllReadAsync(int userId)
    {
        var unread = await _ctx.Notifications
            .Where(n => n.ReceiverUserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unread)
            n.IsRead = true;

        await _ctx.SaveChangesAsync();
    }

    public async Task CreateAsync(int receiverUserId, string type, string message, int? pointRequestId = null)
    {
        var notification = new Notification
        {
            ReceiverUserId = receiverUserId,
            Type = type,
            Message = message,
            PointRequestId = pointRequestId,
            IsRead = false
        };
        await _ctx.Notifications.AddAsync(notification);
        await _ctx.SaveChangesAsync();
    }
}
