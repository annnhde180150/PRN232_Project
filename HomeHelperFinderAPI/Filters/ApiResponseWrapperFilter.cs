using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Query;

namespace HomeHelperFinderAPI.Middleware;

public class ApiResponseWrapperFilter : IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        if (context.Result is not ObjectResult objectResult)
        {
            await next();
            return;
        }

        var apiResponse = new ApiResponse<object>
        {
            Data = objectResult.Value,
            RequestId = context.HttpContext.TraceIdentifier
        };

        if (context.HttpContext.Items.TryGetValue(typeof(ODataQueryOptions), out var odataItems)
            && odataItems is ODataQueryOptions options)
        {
            var metadata = new ResponseMetadata();
            var hasMetadata = false;

            var count = context.HttpContext.Request.HttpContext.ODataFeature().TotalCount;
            if (count.HasValue)
            {
                metadata.ODataCount = count;
                hasMetadata = true;
            }

            var nextLink = context.HttpContext.Request.HttpContext.ODataFeature().NextLink;
            if (nextLink != null)
            {
                metadata.ODataNextLink = nextLink.ToString();
                hasMetadata = true;
            }

            if (hasMetadata) apiResponse.Metadata = metadata;

            if (objectResult.Value?.GetType().GetProperty("Value")?.GetValue(objectResult.Value) is { } value)
                apiResponse.Data = value;
        }

        objectResult.Value = apiResponse;

        objectResult.StatusCode = objectResult.StatusCode ?? context.HttpContext.Response.StatusCode;

        await next();
    }
}