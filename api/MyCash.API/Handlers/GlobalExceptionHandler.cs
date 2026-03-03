using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace MyCash.API.Handlers;

    public class GlobalExceptionHandler : IExceptionHandler
    {
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
    {

        _logger.LogError(exception, "Exception occured: {Message}", exception.Message);

        var problemDetails = new ProblemDetails
        {
            Instance = httpContext.Request.Path
        };

        switch (exception)
        {
            case KeyNotFoundException:
                problemDetails.Status = StatusCodes.Status404NotFound;
                problemDetails.Title = "Resource not found";
                problemDetails.Detail = "The request resource could not be found";
                break;

            case ArgumentException:
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Title = "Invalid Request";
                problemDetails.Detail = exception.Message;
                break;

            case UnauthorizedAccessException:
                problemDetails.Status = StatusCodes.Status401Unauthorized;
                problemDetails.Title = "Unauthorized Access";
                problemDetails.Detail = "You do not have permission to access this resource";
                break;

            default:
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Title = "Internal Server Error";
                problemDetails.Detail = "An unexpected error occurred while processing your request.";
                break;
        }

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    }

