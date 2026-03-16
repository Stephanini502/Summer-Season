using System.Reflection.Metadata.Ecma335;

namespace SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.data;
using Microsoft.EntityFrameworkCore;
using SummerSeason.Dtos;
using SummerSeason.Enums;

public class UserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> AddUser(UserRequestDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Surname = dto.Surname,
            UserName = dto.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Roles = dto.Roles?.Select(r => Enum.Parse<UserType>(r.ToString())).ToList(),
            TotalPoints = dto.TotalPoints
        };
        user.CreatedAt = DateTime.Now;
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<List<User>> GetAllUsers()
    {
        var users = await _context.Users.Where(u => u.DeletedAt == DateTime.MinValue).ToListAsync();

        return users;
    }

    public async Task<List<User>> GetAllUsersByLeagueId(int leagueId)
    {
        var users = await _context.Users.Include(u => u.Leagues)
                                        .Where(u => u.Leagues
                                        .Any(l => l.Id == leagueId)).ToListAsync();
        
        return users;
    }

    public async Task<User> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        
        if (user == null)
            throw new Exception($"User not found with id {id}");

        return user;
    }

public async Task<User> UpdateUser(int id, UserRequestDto updatedUser)
{
    var user = await _context.Users.FindAsync(id);

    if(user == null)
        throw new Exception($"User not found with id: {id}");

    user.Name = updatedUser.Name;
    user.TotalPoints = updatedUser.TotalPoints;

    if (updatedUser.Roles != null)
    {
        user.Roles = updatedUser.Roles
            .Select(r => Enum.Parse<UserType>(r.ToString(), true)) 
            .ToList();
    }
    user.UpdatedAt = DateTime.Now;
    await _context.SaveChangesAsync();
    return user;
}

    public async Task RemoveUserById(int id)
    {
        var user = await _context.Users
                                .Include(u => u.Leagues) 
                                .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            throw new Exception($"User not found with id {id}");

        user.DeletedAt = DateTime.Now;
        user.Name = user.Name + "_DELETED";
        user.UserName = user.UserName + "_DELETED";

        if (user.Leagues != null && user.Leagues.Count > 0)
        {
            foreach (var league in user.Leagues)
            {
                league.Users.Remove(user); 
            }
            user.Leagues.Clear(); 
        }

        await _context.SaveChangesAsync();
    }
public async Task<User> SetRoleToUser(int userId, string role)
{
    User user = await _context.Users.FindAsync(userId);
    if (user == null)
        throw new Exception($"User not found with id {userId}");

    if (!Enum.TryParse<UserType>(role, true, out var userRole))
        throw new Exception($"Invalid role: {role}");

    if (user.Roles == null)
        user.Roles = new List<UserType>();

    if (!user.Roles.Contains(userRole))
        user.Roles.Add(userRole);

    await _context.SaveChangesAsync(); 

    return user;
}

public async Task<List<String>> GetRoleByUserId(int userId)
    {
        User user = await _context.Users.FindAsync(userId);
    if (user == null || user.Roles == null)
        return new List<string>();

    return user.Roles
               .Select(r => r.ToString())
               .ToList();    
    }
}