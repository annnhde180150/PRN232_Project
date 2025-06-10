namespace HomeHelperFinderAPI.Attributes;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class ApiResponseMessageAttribute : Attribute
{
    public ApiResponseMessageAttribute(string message)
    {
        Message = message;
    }

    public string Message { get; }

    public string? SuccessMessage { get; set; }

    public string? ErrorMessage { get; set; }

    public string GetMessageForStatusCode(int statusCode)
    {
        return statusCode switch
        {
            >= 200 and < 300 => SuccessMessage ?? Message,
            >= 400 => ErrorMessage ?? Message,
            _ => Message
        };
    }
}