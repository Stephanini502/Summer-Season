using Microsoft.AspNetCore.Mvc;
using SummerSeason.Services;
using SummerSeason.models;
using SummerSeason.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace SummerSeason.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService _service;

    public UserController(UserService service)
        {
            _service = service;
        }

    [HttpPost]
    public async Task<IActionResult> AddUser([FromBody]UserRequestDto dto)
    {
        try
        {
            var user = await _service.AddUser(dto);
            return Ok(new { message = $"User {dto.Name} successfully created", user });
        }
        catch(Exception e)
        {
            return BadRequest(new { message = $"Error creating user {dto.Name}: {e.Message}" });        
        }
    }

    [HttpPut("{id}")]    
    public async Task<IActionResult> UpdateUser(int id, [FromBody]UserRequestDto dto)
    {
        try
        {
            await _service.UpdateUser(id, dto);
            return Ok($"User {dto.Name} successfully updated");
        }
        catch(Exception e)
        {
            return BadRequest($"Error updating user {dto.Name}: "+  e.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        List<User> users = await _service.GetAllUsers();
        return users;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        User user = await _service.GetUserById(id);
        return user;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveUser(int id)
    {
        try
        {
            await _service.RemoveUserById(id);
            return Ok($"User with id: {id} successfully deleted");
        }
        catch
        {
            return BadRequest($"Error deleting user with id: {id}");
        }
    }

    [HttpPut("{userId}/{role}")]
    public async Task<IActionResult> SetRoleToUser(int userId, String role)
    {
        await _service.SetRoleToUser(userId, role);
        return Ok($"User {userId} role successfully updated");
    }

    [HttpGet("{userId}/roles")]
    public async Task<ActionResult<List<String>>> GetRolesByUserId(int userId)
    {
        List<String> roles = await _service.GetRoleByUserId(userId);

        return Ok(roles);
    }

}