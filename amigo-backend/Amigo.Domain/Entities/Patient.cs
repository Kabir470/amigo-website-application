namespace Amigo.Domain.Entities;

public class Patient
{
    public long Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int? Age { get; set; }
    public long? WardId { get; set; }
    public string? RoomNumber { get; set; }
    public string? Condition { get; set; }
    public string? NfcTag { get; set; }
    public long? AssignedRobotId { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Ward? Ward { get; set; }
    public Robot? AssignedRobot { get; set; }
    public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
}
