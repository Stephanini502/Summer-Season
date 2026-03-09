namespace SummerSeason.models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Result : BaseEntity
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id{get; set;}
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User? User{get; set;}
    public int ChallengeId{get; set;}
    
    [ForeignKey("ChallengeId")]
    public Challenge? Challenge{get; set;}
    public long PointsAwarded{get; set;}
}