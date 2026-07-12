namespace Amigo.Domain.Entities;

public class Delivery
{
    public long Id { get; set; }
    public long? PatientId { get; set; }
    public long? MedicineId { get; set; }
    public long? AssignedRobotId { get; set; }
    public DateTime ScheduledTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? ScannedAt { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Patient? Patient { get; set; }
    public Medicine? Medicine { get; set; }
    public Robot? AssignedRobot { get; set; }
}
