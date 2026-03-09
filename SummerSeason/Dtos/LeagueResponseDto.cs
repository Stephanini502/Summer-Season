namespace SummerSeason.Dtos;

public class LeagueResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int LeagueAdminId { get; set; }
    public string LeagueAdminName { get; set; }
    public List<UserResponseDto> Users { get; set; }
    public DateOnly CreationDate { get; set; }
}