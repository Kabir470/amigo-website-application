using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Amigo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Repositories;

public class WardRepository : IWardRepository
{
    private readonly AmigoDbContext _context;

    public WardRepository(AmigoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ward>> GetAllWardsAsync()
    {
        return await _context.Wards
            .AsNoTracking()
            .ToListAsync();
    }
}
