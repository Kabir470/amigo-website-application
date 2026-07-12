using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Amigo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Repositories;

public class AlertRepository : IAlertRepository
{
    private readonly AmigoDbContext _context;

    public AlertRepository(AmigoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Alert>> GetAllAlertsAsync()
    {
        return await _context.Alerts
            .OrderByDescending(a => a.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetActiveAlertsAsync()
    {
        return await _context.Alerts
            .Where(a => a.IsResolved == false)
            .OrderByDescending(a => a.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Alert?> ResolveAlertAsync(long id)
    {
        var alert = await _context.Alerts.FindAsync(id);
        if (alert == null) return null;

        alert.IsResolved = true;
        await _context.SaveChangesAsync();
        return alert;
    }
}
