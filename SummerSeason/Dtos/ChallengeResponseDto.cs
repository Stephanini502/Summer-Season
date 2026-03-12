namespace SummerSeason.Dtos;

public class ChallengeResponseDto
{
    public long Id{get; set;}
    public String? Name{get; set;}
    public String? Description{get; set;}
    public int Points{get; set;}
    public List<int> LeagueIds{get; set;}
    public String LeagueName{get; set;}
}