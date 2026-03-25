namespace SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Dtos;
using SummerSeason.Enums;

public class PointRequestService
{
    private readonly AppDbContext _ctx;

    public PointRequestService(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<PointRequest> CreateAsync(PointRequestDto dto)
    {
        var req = new PointRequest
        {
            UserId          = dto.ReceiverUserId,
            ChallengeId     = dto.ChallengeId,
            LeagueId        = dto.LeagueId,
            PointsRequested = dto.PointsRequested,
            BonusMalusIds   = System.Text.Json.JsonSerializer.Serialize(dto.BonusMalusIds ?? new List<int>())
        };

        _ctx.PointRequests.Add(req);
        await _ctx.SaveChangesAsync();

        var user      = await _ctx.Users.FindAsync(dto.ReceiverUserId);
        var challenge = await _ctx.Challenges.FindAsync(dto.ChallengeId);
        var allUsers = await _ctx.Users.ToListAsync();
        var admins = allUsers
            .Where(u => u.Roles.Contains(UserType.Admin) || u.Roles.Contains(UserType.Referee))
            .ToList();

        foreach (var admin in admins)
        {
            _ctx.Notifications.Add(new Notification
            {
                ReceiverUserId           = admin.Id,
                Type             = "PointRequest",
                Message          = $"{user?.Name} {user?.Surname} ha completato \"{challenge?.Name}\" ({dto.PointsRequested} pts)",
                PointRequestId   = req.Id
            });
        }

        await _ctx.SaveChangesAsync();
        return req;
    }

    public async Task<List<object>> GetPendingAsync()
    {
        return await _ctx.PointRequests
            .Where(r => r.Status == "Pending")
            .Include(r => r.User)
            .Include(r => r.Challenge)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => (object) new
            {
                r.Id,
                r.Status,
                r.PointsRequested,
                r.CreatedAt,
                r.AdminNote,
                User      = new { r.User.Id, r.User.Name, r.User.Surname, r.User.UserName },
                Challenge = new { r.Challenge.Id, r.Challenge.Name, r.Challenge.Points },
                r.LeagueId
            })
            .ToListAsync();
    }

    public async Task<List<PointRequest>> GetPendingByRefereeAsync(int refereeId)
    {
        var leagueIds = await _ctx.LeagueReferees
            .Where(lr => lr.UserId == refereeId)
            .Select(lr => lr.LeagueId)
            .ToListAsync();

        return await _ctx.PointRequests
            .Where(pr => pr.Status == "Pending" && leagueIds.Contains(pr.LeagueId))
            .Include(pr => pr.User)
            .Include(pr => pr.Challenge)
            .ToListAsync();
    }

    public async Task ApproveAsync(int id, string? note)
    {
        var req = await _ctx.PointRequests
        .Include(r => r.Challenge)
        .FirstOrDefaultAsync(r => r.Id == id);

        if (req == null)
            throw new KeyNotFoundException("Richiesta non trovata");

        if (req.Status != "Pending")
            throw new InvalidOperationException("Richiesta già processata");

        req.Status    = "Approved";
        req.AdminNote = note;

        _ctx.Results.Add(new Result
        {
            UserId        = req.UserId,
            ChallengeId   = req.ChallengeId,
            PointsAwarded = req.PointsRequested
        });

        var user = await _ctx.Users.FindAsync(req.UserId);
        if (user != null)
            user.TotalPoints += req.PointsRequested;

        _ctx.Notifications.Add(new Notification
        {
            ReceiverUserId = req.UserId,
            Type           = "Approved",
            Message        = $"✓ La tua sfida \"{req.Challenge?.Name}\" è stata approvata! +{req.PointsRequested} pts" +
                            (string.IsNullOrEmpty(note) ? "" : $" — Nota: {note}"),
            PointRequestId = req.Id
        });

        await _ctx.SaveChangesAsync();
    }

    public async Task RejectAsync(int id, string? note)
    {
        var req = await _ctx.PointRequests
            .Include(r => r.Challenge)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (req == null)
            throw new KeyNotFoundException("Richiesta non trovata");

        if (req.Status != "Pending")
            throw new InvalidOperationException("Richiesta già processata");

        req.Status    = "Rejected";
        req.AdminNote = note;

        _ctx.Notifications.Add(new Notification
        {
            ReceiverUserId         = req.UserId,
            Type           = "Rejected",
            Message        = $"✕ La tua sfida \"{req.Challenge?.Name}\" è stata rifiutata.{(note != null ? " — Nota: " + note : "")}",
            PointRequestId = req.Id
        });

        await _ctx.SaveChangesAsync();
    }
}

