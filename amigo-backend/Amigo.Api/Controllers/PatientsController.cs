using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Amigo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientRepository _patientRepository;

    public PatientsController(IPatientRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
    {
        return Ok(await _patientRepository.GetAllPatientsAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetPatient(long id)
    {
        var patient = await _patientRepository.GetPatientByIdAsync(id);
        if (patient == null) return NotFound();
        return Ok(patient);
    }

    [HttpPost]
    public async Task<ActionResult<Patient>> CreatePatient([FromBody] Patient patient)
    {
        var created = await _patientRepository.CreatePatientAsync(patient);
        return CreatedAtAction(nameof(GetPatient), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Patient>> UpdatePatient(long id, [FromBody] Patient patient)
    {
        var updated = await _patientRepository.UpdatePatientAsync(id, patient);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(long id)
    {
        var deleted = await _patientRepository.DeletePatientAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
