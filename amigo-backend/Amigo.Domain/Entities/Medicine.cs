namespace Amigo.Domain.Entities;

public class Medicine
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int StockQuantity { get; set; }
    public string? Unit { get; set; }
    public int ReorderLevel { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
}
