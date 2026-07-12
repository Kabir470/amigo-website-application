namespace Amigo.Domain.Entities;

public class SystemSetting
{
    public long Id { get; set; }
    public string FacilityName { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    public long? DefaultWardId { get; set; }
    public bool? DarkTheme { get; set; }
    public bool? AutoRefresh { get; set; }
    public bool? AutoRecallLowBattery { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Ward? DefaultWard { get; set; }
}
