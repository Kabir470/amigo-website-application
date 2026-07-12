using Amigo.Domain.Entities;

namespace Amigo.Application.Interfaces;

public interface IWardRepository
{
    Task<IEnumerable<Ward>> GetAllWardsAsync();
}
