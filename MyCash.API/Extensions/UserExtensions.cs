using System.Security.Claims;

namespace MyCash.API.Extensions;

public static class UserExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var userIdString = user.FindFirst("sub")?.Value
                        ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            throw new UnauthorizedAccessException("Invalid user or not authorized.");

        return userId;
    }
}