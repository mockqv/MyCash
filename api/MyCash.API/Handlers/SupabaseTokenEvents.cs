using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace MyCash.API.Handlers;

public static class SupabaseTokenEvents
{
    public static Task OnTokenValidated(TokenValidatedContext context)
    {
        var rawToken = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "").Trim();
        var parts = rawToken.Split('.');

        if (parts.Length != 3) return Task.CompletedTask;

        var payload = parts[1];
        payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=')
                         .Replace('-', '+')
                         .Replace('_', '/');

        var json = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(payload));
        var doc = JsonDocument.Parse(json);

        if (doc.RootElement.TryGetProperty("exp", out var expElement))
        {
            var exp = expElement.GetInt64();
            var expirationDate = DateTimeOffset.FromUnixTimeSeconds(exp).UtcDateTime;

            if (expirationDate < DateTime.UtcNow)
            {
                context.Fail("Token expired.");
                return Task.CompletedTask;
            }
        }

        if (doc.RootElement.TryGetProperty("sub", out var subElement))
        {
            var sub = subElement.GetString();
            if (!string.IsNullOrEmpty(sub))
            {
                var identity = (ClaimsIdentity)context.Principal!.Identity!;
                identity.AddClaim(new Claim("sub", sub));
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, sub));
            }
        }

        return Task.CompletedTask;
    }
}