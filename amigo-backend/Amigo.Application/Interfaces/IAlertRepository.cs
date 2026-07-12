using Amigo.Domain.Entities;

namespace Amigo.Application.Interfaces;

public interface IAlertRepository
{
    Task<IEnumerable<Alert>> GetAllAlertsAsync();
    Task<IEnumerable<Alert>> GetActiveAlertsAsync();
    Task<Alert?> ResolveAlertAsync(long id);
}
