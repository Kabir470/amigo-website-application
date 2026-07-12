using Amigo.Domain.Entities;

namespace Amigo.Application.Interfaces;

public interface IUserProfileRepository
{
    Task<IEnumerable<UserProfile>> GetAllUsersAsync();
    Task<UserProfile?> GetUserByIdAsync(long id);
    Task<UserProfile> CreateUserAsync(UserProfile user);
    Task DeleteUserAsync(long id);
}
