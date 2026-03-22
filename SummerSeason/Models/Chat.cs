using SummerSeason.Enums;

namespace SummerSeason.models;

public class Chat : BaseEntity
{
    public int Id{get; set;}
    public int SenderId{get; set;}
    public User Sender{get; set;}
    public String Content{get; set;} = "";
    public ChatRoomType Type{get; set;}
    public int LeagueId{get; set;}
    public League League{get; set;}
    public Boolean IsRead{get; set;} = false;
}