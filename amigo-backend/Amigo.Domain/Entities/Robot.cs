namespace Amigo.Domain.Entities;

public class Robot
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long? WardId { get; set; }
    public string? CurrentLocation { get; set; }
    public string Status { get; set; } = string.Empty;
    public int BatteryLevel { get; set; }
    public string? FirmwareVersion { get; set; }
    public string? NfcModuleStatus { get; set; }
    public int? LineFollowerSensitivity { get; set; }
    public int? NfcReadRange { get; set; }
    public decimal? MaxSpeed { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Ward? Ward { get; set; }
    public ICollection<Patient> AssignedPatients { get; set; } = new List<Patient>();
    public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
}
