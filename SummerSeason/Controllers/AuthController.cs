using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using SummerSeason.Dtos;
using SummerSeason.data;
using SummerSeason.Enums;
using SummerSeason.models;
using System.Text.Encodings.Web;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string key = "KEY_TEST_0000_ASDFGHJKLASDFGHJKL";

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.UserName == dto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password)|| user.DeletedAt > user.CreatedAt)
            return Unauthorized("Invalid credentials");

        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName)
        };

        foreach(var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
        }

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256)
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new 
        {
            token = tokenString,
            user = new 
            {
                id = user.Id,
                username = user.UserName,
                name = user.Name,
                surname = user.Surname,
                roles = user.Roles
            }
        });    
        }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == dto.Username);

        if (existingUser != null && existingUser.DeletedAt == null)
            return BadRequest("Username already exists");

        var user = new User
        {
            UserName = dto.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name = dto.Name,
            Surname = dto.Surname,
            Roles = new List<UserType> { UserType.Guest }, 
            status = UserStatus.Online
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok("Logged out successfully");
    }
}
