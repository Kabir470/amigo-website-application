using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Amigo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Repositories;

public class RobotRepository : IRobotRepository
{
    private readonly AmigoDbContext _context;

    public RobotRepository(AmigoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Robot>> GetAllRobotsAsync()
    {
        return await _context.Robots
            .Include(r => r.Ward)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Robot?> GetRobotByIdAsync(long id)
    {
        return await _context.Robots
            .Include(r => r.Ward)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Robot> CreateRobotAsync(Robot robot)
    {
        robot.CreatedAt = DateTime.UtcNow;
        _context.Robots.Add(robot);
        await _context.SaveChangesAsync();
        return robot;
    }

    public async Task<Robot?> UpdateRobotAsync(long id, Robot updated)
    {
        var robot = await _context.Robots.FindAsync(id);
        if (robot == null) return null;

        robot.Name = updated.Name;
        robot.WardId = updated.WardId;
        robot.CurrentLocation = updated.CurrentLocation;
        robot.Status = updated.Status;
        robot.BatteryLevel = updated.BatteryLevel;
        robot.FirmwareVersion = updated.FirmwareVersion;
        robot.NfcModuleStatus = updated.NfcModuleStatus;
        robot.LineFollowerSensitivity = updated.LineFollowerSensitivity;
        robot.NfcReadRange = updated.NfcReadRange;
        robot.MaxSpeed = updated.MaxSpeed;

        await _context.SaveChangesAsync();
        return robot;
    }

    public async Task<bool> DeleteRobotAsync(long id)
    {
        var robot = await _context.Robots.FindAsync(id);
        if (robot == null) return false;
        _context.Robots.Remove(robot);
        await _context.SaveChangesAsync();
        return true;
    }
}
