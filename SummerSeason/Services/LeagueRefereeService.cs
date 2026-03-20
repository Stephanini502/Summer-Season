using SummerSeason.data;
using SummerSeason.models;
using SummerSeason.Enums;
using Microsoft.EntityFrameworkCore;

namespace SummerSeason.Services;

public class LeagueRefereeService
{
    private readonly AppDbContext _context;

    public LeagueRefereeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<object>> GetRefereesByLeagueAsync(int leagueId)
    {
        return await _context.LeagueReferees
            .Where(lr => lr.LeagueId == leagueId)
            .Include(lr => lr.User)
            .Select(lr => (object)new {
                lr.User.Id,
                lr.User.Name,
                lr.User.Surname,
                lr.User.UserName
            })
            .ToListAsync();
    }

    public async Task AssignRefereeAsync(int leagueId, int userId)
    {
        var already = await _context.LeagueReferees
            .AnyAsync(lr => lr.LeagueId == leagueId && lr.UserId == userId);
        if (already) throw new Exception("Arbitro già assegnato a questa lega");

        var user = await _context.Users.FindAsync(userId)
            ?? throw new Exception("Utente non trovato");

        if (!user.Roles.Contains(UserType.Referee))
            user.Roles.Add(UserType.Referee);

        _context.LeagueReferees.Add(new LeagueReferee
        {
            LeagueId = leagueId,
            UserId = userId
        });

        await _context.SaveChangesAsync();
    }

    public async Task RemoveRefereeAsync(int leagueId, int userId)
    {
        var lr = await _context.LeagueReferees
            .FirstOrDefaultAsync(lr => lr.LeagueId == leagueId && lr.UserId == userId)
            ?? throw new Exception("Arbitro non trovato in questa lega");

        _context.LeagueReferees.Remove(lr);
        await _context.SaveChangesAsync();
    }

    public async Task<List<object>> GetLeaguesByRefereeAsync(int userId)
    {
        return await _context.LeagueReferees
            .Where(lr => lr.UserId == userId)
            .Include(lr => lr.League)
            .Select(lr => (object)new {
                lr.League.Id,
                lr.League.Name,
                lr.League.CreationDate
            })
            .ToListAsync();
    }
}