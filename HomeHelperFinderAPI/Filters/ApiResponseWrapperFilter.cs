using System.Reflection;
using HomeHelperFinderAPI.Attributes;
using HomeHelperFinderAPI.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Query;

namespace HomeHelperFinderAPI.Filters;

public class ApiResponseWrapperFilter : IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        if (context.Result is not ObjectResult objectResult)
        {
            await next();
            return;
        }

        // Lấy custom message từ attribute
        var customMessage =
            GetCustomMessage(context, objectResult.StatusCode ?? context.HttpContext.Response.StatusCode);

        var apiResponse = new ApiResponse<object>
        {
            Success = objectResult.StatusCode is >= 200 and < 300,
            StatusCode = objectResult.StatusCode ?? context.HttpContext.Response.StatusCode,
            Message = customMessage ??
                      GetDefaultMessage(objectResult.StatusCode ?? context.HttpContext.Response.StatusCode),
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

    private string? GetCustomMessage(ResultExecutingContext context, int statusCode)
    {
        // Tìm attribute trên action method trước
        var actionAttribute = context.ActionDescriptor.EndpointMetadata
            .OfType<ApiResponseMessageAttribute>()
            .FirstOrDefault();

        if (actionAttribute != null) return actionAttribute.GetMessageForStatusCode(statusCode);

        // Nếu không có trên action, tìm trên controller
        var controllerAttribute = context.Controller.GetType()
            .GetCustomAttribute<ApiResponseMessageAttribute>();

        if (controllerAttribute != null) return controllerAttribute.GetMessageForStatusCode(statusCode);

        return null;
    }

    private string GetDefaultMessage(int statusCode)
    {
        return statusCode switch
        {
            200 => "Thành công",
            201 => "Tạo mới thành công",
            204 => "Không có nội dung",
            400 => "Yêu cầu không hợp lệ",
            401 => "Không có quyền truy cập",
            403 => "Truy cập bị từ chối",
            404 => "Không tìm thấy",
            422 => "Dữ liệu không hợp lệ",
            500 => "Lỗi máy chủ nội bộ",
            _ => "Trạng thái không xác định"
        };
    }
}