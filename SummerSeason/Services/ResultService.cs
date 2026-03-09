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

    public async Task AddResultAsync(Result result)
    {
        _context.Results.Add(result);

        var user = await _context.Users
            .FirstOrDefaultAsync(p => p.Id == result.User.Id);

        if (user == null)
            throw new Exception("Participant not found");

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