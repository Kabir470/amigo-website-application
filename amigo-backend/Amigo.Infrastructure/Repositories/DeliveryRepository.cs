using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Amigo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Repositories;

public class DeliveryRepository : IDeliveryRepository
{
    private readonly AmigoDbContext _context;

    public DeliveryRepository(AmigoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Delivery>> GetAllDeliveriesAsync()
    {
        return await _context.Deliveries
            .Include(d => d.Patient)
            .Include(d => d.Medicine)
            .Include(d => d.AssignedRobot)
            .OrderBy(d => d.ScheduledTime)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Delivery?> UpdateDeliveryStatusAsync(long id, string status)
    {
        var delivery = await _context.Deliveries.FindAsync(id);
        if (delivery == null) return null;

        delivery.Status = status;
        if (status == "Completed")
        {
            delivery.ScannedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return delivery;
    }

    public async Task<Delivery> CreateDeliveryAsync(Delivery delivery)
    {
        _context.Deliveries.Add(delivery);
        await _context.SaveChangesAsync();
        
        // Load the related entities so the return value has them populated (useful for immediate UI rendering)
        return await _context.Deliveries
            .Include(d => d.Patient)
            .Include(d => d.Medicine)
            .Include(d => d.AssignedRobot)
            .FirstOrDefaultAsync(d => d.Id == delivery.Id) ?? delivery;
    }
}
