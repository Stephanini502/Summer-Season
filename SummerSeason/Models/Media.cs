using System.Dynamic;
using System.IO.Pipelines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerSeason.models;

public class Media : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Url { get; set; } = "";          
    public string Type { get; set; } = "";        
    public string? PublicId { get; set; }          

    public int? ChallengeId { get; set; }
    [ForeignKey("ChallengeId")]
    public Challenge? Challenge { get; set; }

    public int? LeagueId { get; set; }
    [ForeignKey("LeagueId")]
    public League? League { get; set; }
}