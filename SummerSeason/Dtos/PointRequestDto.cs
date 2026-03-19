namespace SummerSeason.Dtos;

public class PointRequestDto
{
    public int ReceiverUserId { get; set; }
    public int ChallengeId { get; set; }
    public int LeagueId { get; set; }
    public int PointsRequested { get; set; }
    public List<int> BonusMalusIds { get; set; } 
    public string Status { get; set; } = "Pending"; 
    public string? Notes { get; set; }
}