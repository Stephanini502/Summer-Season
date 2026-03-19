namespace SummerSeason.Dtos;

public class NotificationDto
{
    public int ReceiverUserId { get; set; }       
    public string Type { get; set; }
    public string Message { get; set; }
    public int? PointRequestId { get; set; }
    public bool IsRead { get; set; } = false;
}