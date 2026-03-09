using SummerSeason.models;

namespace SummerSeason.Dtos;

public class LeagueRequestDto
{
    public String? Name{get; set;}

    public List<int>? ParticipantIds{get; set;}

    public List<int>? ChallengeIds{get; set;}
}