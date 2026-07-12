using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Amigo.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WardsController : ControllerBase
{
    private readonly IWardRepository _wardRepository;

    public WardsController(IWardRepository wardRepository)
    {
        _wardRepository = wardRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ward>>> GetWards()
    {
        return Ok(await _wardRepository.GetAllWardsAsync());
    }
}
