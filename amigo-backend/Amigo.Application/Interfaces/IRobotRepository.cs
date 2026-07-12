using Amigo.Domain.Entities;

namespace Amigo.Application.Interfaces;

public interface IRobotRepository
{
    Task<IEnumerable<Robot>> GetAllRobotsAsync();
    Task<Robot?> GetRobotByIdAsync(long id);
    Task<Robot> CreateRobotAsync(Robot robot);
    Task<Robot?> UpdateRobotAsync(long id, Robot robot);
    Task<bool> DeleteRobotAsync(long id);
}
