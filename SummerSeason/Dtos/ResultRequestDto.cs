namespace SummerSeason.models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ResultRequestDto
{
    public int UserId{get; set;}

    public int ChallengeId{get; set;}

    public long PointsAwarded{get; set;}
}