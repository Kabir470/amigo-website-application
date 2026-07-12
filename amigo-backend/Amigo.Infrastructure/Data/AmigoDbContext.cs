using Amigo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Amigo.Infrastructure.Data;

public class AmigoDbContext : DbContext
{
    public AmigoDbContext(DbContextOptions<AmigoDbContext> options) : base(options)
    {
    }

    public DbSet<Ward> Wards { get; set; } = null!;
    public DbSet<UserProfile> UserProfiles { get; set; } = null!;
    public DbSet<Robot> Robots { get; set; } = null!;
    public DbSet<Patient> Patients { get; set; } = null!;
    public DbSet<Medicine> Medicines { get; set; } = null!;
    public DbSet<Delivery> Deliveries { get; set; } = null!;
    public DbSet<Alert> Alerts { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Map Table names to snake_case to match Supabase schema
        modelBuilder.Entity<Ward>().ToTable("wards");
        modelBuilder.Entity<UserProfile>().ToTable("user_profiles");
        modelBuilder.Entity<Robot>().ToTable("robots");
        modelBuilder.Entity<Patient>().ToTable("patients");
        modelBuilder.Entity<Medicine>().ToTable("medicines");
        modelBuilder.Entity<Delivery>().ToTable("deliveries");
        modelBuilder.Entity<Alert>().ToTable("alerts");
        modelBuilder.Entity<SystemSetting>().ToTable("system_settings");

        // We will rely on EFCore.NamingConventions package to map all properties to snake_case automatically
    }
}
