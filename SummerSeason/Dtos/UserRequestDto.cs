using SummerSeason.Enums;

namespace SummerSeason.Dtos;

public class UserRequestDto
{
    public String? Name{get; set;}

    public String? Surname{get; set;}

    public String? Username{get; set;}

    public String? Password{get; set;}

    public List<String>? Roles{get; set;}

    public int TotalPoints{get; set;}
}