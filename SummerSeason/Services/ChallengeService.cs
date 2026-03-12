// ChallengeService.cs
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Dtos;
using SummerSeason.Mappers;

public class ChallengeService
{
    private readonly AppDbContext _context;

    public ChallengeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ChallengeResponseDto> AddChallenge(ChallengeRequestDto dto)
    {
        var leagues = await _context.Leagues
            .Where(l => dto.LeagueIds.Contains(l.Id))
            .ToListAsync();

        var newChallenge = new Challenge
        {
            Name = dto.Name,
            Description = dto.Description,
            Points = dto.Points,
            Leagues = leagues
        };

        await _context.Challenges.AddAsync(newChallenge);
        await _context.SaveChangesAsync();

        return ToDtoMappers.ToChallengeDto(newChallenge);
    }

    public async Task<List<ChallengeResponseDto>> GetChallenges()
    {
        var challenges = await _context.Challenges
            .Where(c => c.DeletedAt == null || c.DeletedAt == DateTime.MinValue)
            .Include(c => c.Leagues)   
            .ToListAsync();

        return challenges.Select(c => ToDtoMappers.ToChallengeDto(c)).ToList();
    }

    public async Task<List<ChallengeResponseDto>> GetChallengesByLeagueId(int leagueId)
    {
        var challenges = await _context.Challenges
            .Where(c => c.Leagues.Any(l => l.Id == leagueId) &&
                        (c.DeletedAt == null || c.DeletedAt == DateTime.MinValue))
            .Include(c => c.Leagues)
            .ToListAsync();

        return challenges.Select(c => ToDtoMappers.ToChallengeDto(c)).ToList();
    }

    public async Task<ChallengeResponseDto> UpdateChallenges(int id, ChallengeRequestDto dto)
    {
        var challenge = await _context.Challenges
            .Include(c => c.Leagues)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (challenge == null)
            throw new Exception($"Challenge not found with id: {id}");

        challenge.Name = dto.Name;
        challenge.Description = dto.Description;
        challenge.Points = dto.Points;

        var leagues = await _context.Leagues
            .Where(l => dto.LeagueIds.Contains(l.Id))
            .ToListAsync();

        challenge.Leagues = leagues;

        await _context.SaveChangesAsync();

        return ToDtoMappers.ToChallengeDto(challenge);
    }

    public async Task RemoveChallengeById(int id)
    {
        var challenge = await _context.Challenges.FindAsync(id);
        if (challenge == null)
            throw new Exception($"Challenge not found with id: {id}");

        challenge.DeletedAt = DateTime.Now;
        await _context.SaveChangesAsync();
    }
}