namespace Amigo.Domain.Entities;

public class Alert
{
    public long Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool? IsResolved { get; set; }
    public DateTime CreatedAt { get; set; }
}
