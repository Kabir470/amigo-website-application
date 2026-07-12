namespace Amigo.Domain.Entities;

public class UserProfile
{
    public long Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? EmployeeId { get; set; }
    public DateTime CreatedAt { get; set; }
}
