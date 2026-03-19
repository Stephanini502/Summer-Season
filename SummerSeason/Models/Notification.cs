namespace SummerSeason.models;

public class Notification : BaseEntity{
    public int Id { get; set; }
    public int ReceiverUserId { get; set; }       
    public string Type { get; set; }      
    public string Message { get; set; }
    public int? PointRequestId { get; set; }
    public bool IsRead { get; set; } = false;
}