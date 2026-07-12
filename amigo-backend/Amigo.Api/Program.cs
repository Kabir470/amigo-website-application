using System.Text.Json.Serialization;
using Amigo.Application.Interfaces;
using Amigo.Infrastructure.Data;
using Amigo.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

// Load environment variables from the .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Configure JSON to ignore object cycles (to prevent Ward -> Robot -> Ward infinite loops)
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Configure open CORS for local development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Read connection string from Environment Variables (.env file)
var connectionString = Environment.GetEnvironmentVariable("SUPABASE_CONNECTION");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Supabase connection string is missing from the .env file.");
}

// Configure Entity Framework Core with PostgreSQL & SnakeCase Naming Convention
builder.Services.AddDbContext<AmigoDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention());

// Dependency Injection Registrations
builder.Services.AddScoped<IRobotRepository, RobotRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IDeliveryRepository, DeliveryRepository>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddScoped<IWardRepository, WardRepository>();

var app = builder.Build();

app.UseCors();

app.UseAuthorization();
app.MapControllers();

app.Run();
