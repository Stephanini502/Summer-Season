namespace SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Dtos;
using SummerSeason.Enums;
using SummerSeason.Mappers;
using Google.Protobuf.WellKnownTypes;

public class LeagueService
{
    private readonly AppDbContext _context;

    public LeagueService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<LeagueResponseDto>> GetLeaguesAsync()
    {
        var leagues = await _context.Leagues
            .Include(l => l.Users)
            .Include(l => l.LeagueAdmin)
            .ToListAsync();

        return leagues.Select(ToDtoMappers.ToLeagueDto).ToList();
    }

    public async Task<LeagueResponseDto?> GetLeagueByIdAsync(int id)
    {
        var league = await _context.Leagues
            .Include(l => l.Users)
            .Include(l => l.LeagueAdmin)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (league == null) return null;

        return ToDtoMappers.ToLeagueDto(league);
    }

    public async Task<List<UserResponseDto>> GetParticipantsByLeagueIdAsync(int leagueId)
    {
        var league = await _context.Leagues
            .Include(l => l.Users)
            .FirstOrDefaultAsync(l => l.Id == leagueId);

        if (league == null)
            throw new Exception($"League not found with id: {leagueId}");

        return league.Users?.Select(ToDtoMappers.ToUserDto).ToList() ?? new List<UserResponseDto>();
    }

    public async Task<LeagueResponseDto> CreateLeagueAsync(LeagueRequestDto dto, int creatorId)
    {
        User user = await _context.Users.FindAsync(creatorId);
        if (user == null)
            throw new Exception($"User not found with id {creatorId}");

        var participants = await _context.Users
            .Where(p => dto.ParticipantIds.Contains(p.Id))
            .ToListAsync();

        foreach (var u in participants)
            if (!u.Roles.Contains(UserType.Participant))
                u.Roles.Add(UserType.Participant);

        League league = new League
        {
            Name = dto.Name,
            Users = participants,
            Challenges = await _context.Challenges
                .Where(c => dto.ChallengeIds.Contains(c.Id))
                .ToListAsync(),
            CreationDate = DateOnly.FromDateTime(DateTime.Now),
            LastUpdate = DateTime.Now,
            LeagueAdmin = user
        };

        if (!user.Roles.Contains(UserType.LeagueAdmin))
            user.Roles.Add(UserType.LeagueAdmin);

        await _context.Leagues.AddAsync(league);
        await _context.SaveChangesAsync();

        return ToDtoMappers.ToLeagueDto(league);
    }

    public async Task<LeagueResponseDto> UpdateLeagueAsync(int id, LeagueRequestDto dto)
    {
        var league = await _context.Leagues
            .Include(l => l.Users)
            .Include(l => l.Challenges)
            .Include(l => l.LeagueAdmin)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (league == null)
            throw new Exception($"League not found with id: {id}");

        league.Name = dto.Name;
        league.Users = await _context.Users
            .Where(u => dto.ParticipantIds.Contains(u.Id))
            .ToListAsync();
        league.Challenges = await _context.Challenges
            .Where(c => dto.ChallengeIds.Contains(c.Id))
            .ToListAsync();
        league.LastUpdate = DateTime.Now;

        await _context.SaveChangesAsync();

        return ToDtoMappers.ToLeagueDto(league);
    }

    public async Task RemoveLeagueByIdAsync(int id)
    {
        var league = await _context.Leagues
            .Include(l => l.Users)
            .ThenInclude(u => u.Leagues)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (league == null)
            throw new Exception($"League not found with id: {id}");

        league.DeletedAt = DateTime.Now;

        foreach (var user in league.Users)
        {
            var hasActiveLeagues = user.Leagues
                .Any(l => l.DeletedAt == DateTime.MinValue && l.Id != id);

            if (!hasActiveLeagues)
            {
                user.Roles.Remove(UserType.Participant);
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<UserResponseDto>> AddUserToLeagueAsync(int userId, int leagueId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new Exception($"User not found with id: {userId}");

        var league = await _context.Leagues
            .Include(l => l.Users)
            .FirstOrDefaultAsync(l => l.Id == leagueId);

        if (league == null)
            throw new Exception($"League not found with id: {leagueId}");

        if (league.Users == null) league.Users = new List<User>();
        league.Users.Add(user);

        await _context.SaveChangesAsync();

        return league.Users.Select(ToDtoMappers.ToUserDto).ToList();
    }
    
    public async Task<List<UserResponseDto>> GetLeagueRankingAsync(int leagueId)
    {
        var league = await _context.Leagues
            .Include(l => l.Users)
            .ThenInclude(u => u.Results) 
            .AsNoTracking()
            .FirstOrDefaultAsync(l => l.Id == leagueId);

        if (league == null)
            throw new Exception($"League not found with id {leagueId}");

        var users = league.Users ?? new List<User>();

        foreach (var u in users)
        {
            Console.WriteLine($"DEBUG: User {u.Id} {u.UserName} TotalPoints={u.TotalPoints}");
        }

        var rankingDto = users
            .OrderByDescending(u => u.TotalPoints)
            .Select(u => ToDtoMappers.ToUserDto(u))
            .ToList();

        return rankingDto;
    }

    public async Task<List<LeagueResponseDto>> GetLeaguesByUserId(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Leagues)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new Exception($"User not found with id {userId}");

        return user.Leagues?.Select(l => ToDtoMappers.ToLeagueDto(l)).ToList();
    }

public async Task RemoveUserFromLeague(int leagueId, int userId)
{
    var league = await _context.Leagues
        .Include(l => l.Users) 
        .FirstOrDefaultAsync(l => l.Id == leagueId);

    if (league == null)
        throw new Exception($"League not found with id {leagueId}");

    var user = await _context.Users.FindAsync(userId);
    if (user == null)
        throw new Exception($"User not found with id {userId}");

    if (!league.Users.Contains(user))
        throw new Exception($"User with id {userId} is not part of league {leagueId}");

    league.Users.Remove(user);

    await _context.SaveChangesAsync();
}

}
