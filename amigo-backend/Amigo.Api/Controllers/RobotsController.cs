using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Amigo.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RobotsController : ControllerBase
{
    private readonly IRobotRepository _robotRepository;

    public RobotsController(IRobotRepository robotRepository)
    {
        _robotRepository = robotRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Robot>>> GetRobots()
    {
        return Ok(await _robotRepository.GetAllRobotsAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Robot>> GetRobot(long id)
    {
        var robot = await _robotRepository.GetRobotByIdAsync(id);
        if (robot == null) return NotFound();
        return Ok(robot);
    }

    [HttpPost]
    public async Task<ActionResult<Robot>> CreateRobot([FromBody] Robot robot)
    {
        var created = await _robotRepository.CreateRobotAsync(robot);
        return CreatedAtAction(nameof(GetRobot), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Robot>> UpdateRobot(long id, [FromBody] Robot robot)
    {
        var updated = await _robotRepository.UpdateRobotAsync(id, robot);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRobot(long id)
    {
        var deleted = await _robotRepository.DeleteRobotAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
