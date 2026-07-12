using Amigo.Application.Interfaces;
using Amigo.Domain.Entities;
using Amigo.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Repositories;

public class UserProfileRepository : IUserProfileRepository
{
    private readonly AmigoDbContext _context;

    public UserProfileRepository(AmigoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserProfile>> GetAllUsersAsync()
    {
        return await _context.UserProfiles
            .OrderByDescending(u => u.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<UserProfile?> GetUserByIdAsync(long id)
    {
        return await _context.UserProfiles.FindAsync(id);
    }

    public async Task<UserProfile> CreateUserAsync(UserProfile user)
    {
        user.CreatedAt = DateTime.UtcNow;
        _context.UserProfiles.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task DeleteUserAsync(long id)
    {
        var user = await _context.UserProfiles.FindAsync(id);
        if (user != null)
        {
            _context.UserProfiles.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
