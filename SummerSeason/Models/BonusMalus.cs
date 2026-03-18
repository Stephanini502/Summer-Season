using System.Dynamic;
using System.IO.Pipelines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerSeason.models;

public class BonusMalus : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public String? Name{get; set;}
    public String? Description{get; set;}
    public int? Points{get; set;}
    public String? Type{get; set;}
}