using System.Dynamic;
using System.IO.Pipelines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerSeason.models;

public class League : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id{get; set;}

    public String? Name{get; set;}
    public int LeagueAdminId { get; set; }
    
    [ForeignKey("LeagueAdminId")]
    public User? LeagueAdmin{get; set;}

    public List<User>? Users{get; set;}

    public List<Challenge>? Challenges{get; set;}

    public DateOnly CreationDate{get; set;}

    public DateTime LastUpdate{get; set;}

    public List<Media> Media { get; set; } = new();
    public List<LeagueReferee>? LeagueReferees{get; set;} = new List<LeagueReferee>();

}