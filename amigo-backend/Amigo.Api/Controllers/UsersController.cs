using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Amigo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserProfileRepository _userRepository;

    public UsersController(IUserProfileRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserProfile>>> GetUsers()
    {
        return Ok(await _userRepository.GetAllUsersAsync());
    }

    [HttpPost]
    public async Task<ActionResult<UserProfile>> CreateUser([FromBody] UserProfile user)
    {
        var created = await _userRepository.CreateUserAsync(user);
        return CreatedAtAction(nameof(GetUsers), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(long id)
    {
        await _userRepository.DeleteUserAsync(id);
        return NoContent();
    }
}
