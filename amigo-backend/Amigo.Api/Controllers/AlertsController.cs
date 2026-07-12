using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Amigo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IAlertRepository _alertRepository;

    public AlertsController(IAlertRepository alertRepository)
    {
        _alertRepository = alertRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Alert>>> GetAlerts([FromQuery] bool? active)
    {
        if (active == true)
            return Ok(await _alertRepository.GetActiveAlertsAsync());
        return Ok(await _alertRepository.GetAllAlertsAsync());
    }

    [HttpPatch("{id}/resolve")]
    public async Task<IActionResult> ResolveAlert(long id)
    {
        var alert = await _alertRepository.ResolveAlertAsync(id);
        if (alert == null) return NotFound();
        return Ok(alert);
    }
}
