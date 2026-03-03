using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyCash.API.Data;
using MyCash.API.Handlers;

var builder = WebApplication.CreateBuilder(args);

// ── Exception Handling ────────────────────────────────────────────────────────
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ── Database ──────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Supabase JWKS ─────────────────────────────────────────────────────────────
var supabaseUrl = builder.Configuration["Supabase:Url"]?.TrimEnd('/')
    ?? throw new InvalidOperationException("Supabase:Url is missing from configuration.");

var signingKeys = await FetchSupabaseSigningKeysAsync($"{supabaseUrl}/auth/v1/.well-known/jwks.json");

// ── Authentication ────────────────────────────────────────────────────────────
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();

    // 1. Forçamos o validador clássico (o único que entende a assinatura ES256 do Supabase)
    options.TokenHandlers.Clear();
    options.TokenHandlers.Add(new JwtSecurityTokenHandler
    {
        MapInboundClaims = false
    });

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = $"{supabaseUrl}/auth/v1",
        ValidateAudience = true,
        ValidAudience = "authenticated",
        ValidateIssuerSigningKey = true,
        IssuerSigningKeys = signingKeys,
        ValidateLifetime = false,
        RequireExpirationTime = false
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = SupabaseTokenEvents.OnTokenValidated
    };
});

// ── Authorization ─────────────────────────────────────────────────────────────
builder.Services.AddAuthorization();

// ── Swagger ───────────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste your Supabase access_token here."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ── Pipeline ──────────────────────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// ── Helpers ───────────────────────────────────────────────────────────────────
static async Task<IList<SecurityKey>> FetchSupabaseSigningKeysAsync(string jwksUrl)
{
    using var http = new HttpClient();
    http.Timeout = TimeSpan.FromSeconds(10);

    try
    {
        var json = await http.GetStringAsync(jwksUrl);
        return new JsonWebKeySet(json).GetSigningKeys();
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException(
            $"Failed to fetch Supabase signing keys from {jwksUrl}.", ex);
    }
}