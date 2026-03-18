using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Dtos;
using SummerSeason.Mappers;
using System.Text.Json;

public class BonusMalusService
{
    private readonly AppDbContext _context;

    public BonusMalusService(AppDbContext context)
    {
        _context = context;
    }

    public async Task ParseJson()
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "bonusMalus.json");
        var json = await File.ReadAllTextAsync(path);        
        Console.WriteLine($"Cercando file in: {path}");
            Console.WriteLine($"JSON letto: {json}");
        var data = JsonSerializer.Deserialize<BonusMalusFile>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        Console.WriteLine($"Items deserializzati: {data?.bonusMalus?.Count ?? 0}");

        if (data?.bonusMalus == null) return;

        foreach (var item in data.bonusMalus)
        {
            Console.WriteLine($"Processing: {item.Name} - {item.Points} - {item.Type}");
            var existing = await _context.BonusMalus
                .FirstOrDefaultAsync(b => b.Name == item.Name);

            if (existing == null)
            {
                await _context.BonusMalus.AddAsync(new BonusMalus
                {
                    Name = item.Name,
                    Description = item.Description,
                    Points = item.Points,
                    Type = item.Type
                });
            }
            else
            {
                existing.Name = item.Name;
                existing.Description = item.Description;
                existing.Points = item.Points;
                existing.Type = item.Type;
            }
        }

        await _context.SaveChangesAsync();
    }
}

public class BonusMalusFile
{
    public List<BonusMalusDto> bonusMalus { get; set; } = new();
}

public class BonusMalusDto
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public int Points { get; set; }
    public string Type { get; set; } = "";
}
