using Amigo.Domain.Entities;

namespace Amigo.Application.Interfaces;

public interface IDeliveryRepository
{
    Task<IEnumerable<Delivery>> GetAllDeliveriesAsync();
    Task<Delivery?> UpdateDeliveryStatusAsync(long id, string status);
    Task<Delivery> CreateDeliveryAsync(Delivery delivery);
}
