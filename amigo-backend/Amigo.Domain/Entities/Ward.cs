namespace Amigo.Domain.Entities;

public class Ward
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<Robot> Robots { get; set; } = new List<Robot>();
    public ICollection<Patient> Patients { get; set; } = new List<Patient>();
}
