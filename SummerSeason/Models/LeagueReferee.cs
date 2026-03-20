namespace SummerSeason.models;

public class LeagueReferee
{
    public int LeagueId { get; set; }
    public League League { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; }
}