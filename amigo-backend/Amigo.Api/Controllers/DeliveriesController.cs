using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Amigo.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DeliveriesController : ControllerBase
{
    private readonly IDeliveryRepository _deliveryRepository;

    public DeliveriesController(IDeliveryRepository deliveryRepository)
    {
        _deliveryRepository = deliveryRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Delivery>>> GetDeliveries()
    {
        return Ok(await _deliveryRepository.GetAllDeliveriesAsync());
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] StatusUpdateDto dto)
    {
        var delivery = await _deliveryRepository.UpdateDeliveryStatusAsync(id, dto.Status);
        if (delivery == null) return NotFound();
        return Ok(delivery);
    }

    [HttpPost]
    public async Task<ActionResult<Delivery>> CreateDelivery([FromBody] CreateDeliveryDto dto)
    {
        var delivery = new Delivery
        {
            PatientId = dto.PatientId,
            MedicineId = dto.MedicineId,
            AssignedRobotId = dto.AssignedRobotId,
            ScheduledTime = dto.ScheduledTime,
            Status = "Pending", // Default status for new deliveries
            CreatedAt = DateTime.UtcNow
        };

        var createdDelivery = await _deliveryRepository.CreateDeliveryAsync(delivery);
        return CreatedAtAction(nameof(GetDeliveries), new { id = createdDelivery.Id }, createdDelivery);
    }
}

public class StatusUpdateDto
{
    public string Status { get; set; } = string.Empty;
}

public class CreateDeliveryDto
{
    public long PatientId { get; set; }
    public long MedicineId { get; set; }
    public long AssignedRobotId { get; set; }
    public DateTime ScheduledTime { get; set; }
}
