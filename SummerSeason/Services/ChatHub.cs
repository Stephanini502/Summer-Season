using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SummerSeason.data;
using SummerSeason.Enums;
using SummerSeason.models;

namespace SummerSeason.Hubs;

public class ChatHub : Hub
{
    private readonly IServiceScopeFactory _scopeFactory;

    public ChatHub(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task JoinLeagueRoom(int leagueId, string roomType)
    {
        var groupName = $"league-{leagueId}-{roomType}";
        Console.WriteLine($"Utente {Context.ConnectionId} si unisce al gruppo {groupName}");
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task LeaveLeagueRoom(int leagueId, string roomType)
    {
        var groupName = $"league-{leagueId}-{roomType}";
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task SendMessage(int leagueId, string roomType, string content, int senderId)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var sender = await context.Users.FindAsync(senderId);
            if (sender == null) return;

            var message = new Chat
            {
                SenderId = senderId,
                Content = content,
                LeagueId = leagueId,
                Type = roomType == "staff" ? ChatRoomType.Staff : ChatRoomType.League,
                CreatedAt = DateTime.Now 
            };

            await context.Chat.AddAsync(message);
            await context.SaveChangesAsync();

            var groupName = $"league-{leagueId}-{roomType}";
            Console.WriteLine($"Invio messaggio al gruppo {groupName}");
            await Clients.All.SendAsync("ReceiveMessage", new
            {
                message.Id,
                message.Content,
                message.CreatedAt,
                Sender = new { sender.Id, sender.Name, sender.Surname, sender.UserName }
            });
        }
        catch (Exception e)
        {
            Console.WriteLine($"Errore SendMessage: {e.Message}");
            Console.WriteLine($"Inner: {e.InnerException?.Message}");
            Console.WriteLine($"Stack: {e.StackTrace}");
            throw;
        }
    }
}