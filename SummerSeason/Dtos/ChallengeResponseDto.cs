namespace SummerSeason.Dtos;

public class ChallengeResponseDto
{
    public long id;
    public String? Name{get; set;}
    public String? Description{get; set;}
    public int Points{get; set;}
    public int LeagueId{get; set;}
    public String LeagueName{get; set;}
}