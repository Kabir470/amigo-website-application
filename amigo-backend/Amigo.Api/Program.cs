using System.Text;
using System.Text.Json.Serialization;
using Amigo.Application.Interfaces;
using Amigo.Infrastructure.Data;
using Amigo.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

// ──── JWT Authentication (Supabase) ────
// Read the JWT secret from environment variables.
// This is the secret key Supabase uses to SIGN tokens.
// .NET uses this same key to VERIFY them — if someone forges a token, the signature won't match.
var jwtSecret = Environment.GetEnvironmentVariable("SUPABASE_JWT_SECRET");

if (string.IsNullOrEmpty(jwtSecret))
{
    Console.WriteLine("WARNING: SUPABASE_JWT_SECRET is not set. JWT authentication will fail.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Tell .NET to fetch the public keys directly from Supabase's OpenID Connect endpoint!
        // This is required because Supabase is now using Asymmetric ECC (P-256) keys.
        options.MetadataAddress = "https://xmapjrywkmygxwrctiyi.supabase.co/auth/v1/.well-known/openid-configuration";

        options.TokenValidationParameters = new TokenValidationParameters
        {
            // The OIDC metadata provides the Issuer ("https://xmapjrywkmygxwrctiyi.supabase.co/auth/v1")
            ValidateIssuer = true,
            
            // Supabase puts "authenticated" as the audience for logged-in users
            ValidateAudience = true,
            ValidAudience = "authenticated",
            
            ValidateLifetime = true,
            
            // Allow the signature to be validated using the keys downloaded from MetadataAddress
            ValidateIssuerSigningKey = true
        };
        
        // Log the exact reason WHY authentication fails to the Docker console
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[JWT AUTH FAILED]: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
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

// Authentication MUST come before Authorization.
// UseAuthentication = "Read the token from the request header"
// UseAuthorization  = "Check if the user has permission to access this endpoint"
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

