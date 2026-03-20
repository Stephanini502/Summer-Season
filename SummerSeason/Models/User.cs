namespace SummerSeason.models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using SummerSeason.Enums;

public class User : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id{get; set;}
    public String? Name{get; set;}
    public String? Surname{get; set;}
    public String? UserName{get; set;}
    public String? Password{get; set;}
    public long TotalPoints{get; set;}
    public List<UserType>? Roles{get; set;}
    public UserStatus status{get; set;}
    public List<Result>? Results{get; set;}
    public List<League>? Leagues{get; set;}
    public List<League>? AdminLeagues{get; set;}
    public List<LeagueReferee>? LeagueReferees{get; set;} = new List<LeagueReferee>();
    public string? AvatarUrl { get; set; }


}