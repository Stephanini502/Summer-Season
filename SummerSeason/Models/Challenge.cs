using System.Dynamic;
using System.IO.Pipelines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerSeason.models;

public class Challenge : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id{get; set;}
    public String? Name{get; set;}
    public String? Description{get; set;}
    public int Points{get; set;}

    public List<Media> Media { get; set; } = new();

    public List<Result>? Results{get; set;}
    public List<League> Leagues { get; set; } = new();

    [NotMapped]
    public List<int> LeagueIds => Leagues?.Select(l => l.Id).ToList() ?? new(); 
}