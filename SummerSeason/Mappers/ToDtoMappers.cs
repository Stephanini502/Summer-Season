namespace SummerSeason.Mappers;
using SummerSeason.models;
using SummerSeason.Dtos;

public class ToDtoMappers
{
    
    public static UserResponseDto ToUserDto(User u) =>
        new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name ?? "-",
            Surname = u.Surname ?? "",
            UserName = u.UserName ?? "-",
            TotalPoints = u.TotalPoints.ToString()
        };

    public static LeagueResponseDto ToLeagueDto(League l) =>
        new LeagueResponseDto
        {
            Id = l.Id,
            Name = l.Name ?? "-",
            LeagueAdminId = l.LeagueAdminId,
            LeagueAdminName = l.LeagueAdmin != null ? $"{l.LeagueAdmin.Name} {l.LeagueAdmin.Surname}" : "-",
            Users = l.Users?.Select(ToUserDto).ToList() ?? new List<UserResponseDto>(),
            CreationDate = l.CreationDate
        };

    public static ChallengeResponseDto ToChallengeDto(Challenge c) =>
        new ChallengeResponseDto
        {
        id = c.Id,
        Name = c.Name ?? "-",
        Description = c.Description ?? "-",
        Points = c.Points,
        LeagueId = c.LeagueId,
        LeagueName = c.League?.Name ?? "-"
        };

}