namespace SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Mappers;
using SummerSeason.Dtos;

public class ResultService
{
        private readonly AppDbContext _context;

    public ResultService(AppDbContext context)
    {
        _context = context;
    }

public async Task AddResultAsync(ResultRequestDto requestResult)
{
    var user = await _context.Users.FindAsync(requestResult.UserId);
    if (user == null)
        throw new Exception("User not found");

    var challenge = await _context.Challenges.FindAsync(requestResult.ChallengeId);
    if (challenge == null)
        throw new Exception("Challenge not found");

    var result = new Result
    {
        UserId = requestResult.UserId,
        User = user,
        ChallengeId = requestResult.ChallengeId,
        Challenge = challenge,
        PointsAwarded = requestResult.PointsAwarded
    };

    _context.Results.Add(result);

    user.TotalPoints += result.PointsAwarded;

    await _context.SaveChangesAsync();
}

    public async Task<List<UserResponseDto>> GetRankingAsync()
    {
        List<User> users = await _context.Users
            .OrderByDescending(p => p.TotalPoints)
            .ToListAsync();

        List<UserResponseDto> usersDto = users
            .Select(u => ToDtoMappers.ToUserDto(u))
            .ToList();

        return usersDto;
    }

}