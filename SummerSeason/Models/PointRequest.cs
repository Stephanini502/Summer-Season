namespace SummerSeason.models;

public class PointRequest : BaseEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int ChallengeId { get; set; }
    public Challenge Challenge { get; set; }
    public int LeagueId { get; set; }
    public int PointsRequested { get; set; }
    public string BonusMalusIds { get; set; } = "[]"; 
    public string Status { get; set; } = "Pending";   
    public string? AdminNote { get; set; }
}