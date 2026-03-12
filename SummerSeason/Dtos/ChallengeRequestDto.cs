namespace SummerSeason.Dtos;

public class ChallengeRequestDto
{
    public String? Name{get; set;}

    public String? Description{get; set;}

    public int Points{get; set;}

    public List<int> LeagueIds{get; set;}
}