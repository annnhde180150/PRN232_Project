using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Chat;
using Services.Interfaces;
using HomeHelperFinderAPI.Attributes;

namespace HomeHelperFinderAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IUserService _userService;
    private readonly IHelperService _helperService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, IUserService userService, IHelperService helperService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _userService = userService;
        _helperService = helperService;
        _logger = logger;
    }

    [HttpPost("send")]
    public async Task<ActionResult<ChatMessageDto>> SendMessage([FromBody] SendMessageDto sendMessageDto)
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var message = await _chatService.SendMessageAsync(sendMessageDto, currentUserId, currentHelperId);
            return Ok(message);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid request for sending message");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, "An error occurred while sending the message");
        }
    }

    [HttpGet("conversation")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetConversationMessages(
        [FromQuery] int? bookingId,
        [FromQuery] int? otherUserId,
        [FromQuery] int? otherHelperId)
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            var messages = await _chatService.GetConversationMessagesAsync(
                bookingId, currentUserId, currentHelperId, otherUserId, otherHelperId);

            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation messages");
            return StatusCode(500, "An error occurred while retrieving conversation messages");
        }
    }

    [HttpGet("conversations")]
    public async Task<ActionResult<IEnumerable<ChatConversationDto>>> GetConversations()
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            IEnumerable<ChatConversationDto> conversations;

            if (currentUserId.HasValue)
            {
                conversations = await _chatService.GetUserConversationsAsync(currentUserId.Value);
            }
            else if (currentHelperId.HasValue)
            {
                conversations = await _chatService.GetHelperConversationsAsync(currentHelperId.Value);
            }
            else
            {
                return BadRequest("Unable to determine user type");
            }

            return Ok(conversations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversations");
            return StatusCode(500, "An error occurred while retrieving conversations");
        }
    }

    [HttpGet("unread")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetUnreadMessages()
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            var messages = await _chatService.GetUnreadMessagesAsync(currentUserId, currentHelperId);
            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unread messages");
            return StatusCode(500, "An error occurred while retrieving unread messages");
        }
    }

    [HttpGet("unread/count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            var count = await _chatService.GetUnreadCountAsync(currentUserId, currentHelperId);
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unread count");
            return StatusCode(500, "An error occurred while retrieving unread count");
        }
    }

    [HttpPost("mark-as-read")]
    public async Task<ActionResult> MarkMessagesAsRead([FromBody] MarkAsReadDto markAsReadDto)
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _chatService.MarkMessagesAsReadAsync(markAsReadDto, currentUserId, currentHelperId);
            
            if (success)
                return Ok(new { message = "Messages marked as read successfully" });
            else
                return BadRequest("No messages were marked as read");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking messages as read");
            return StatusCode(500, "An error occurred while marking messages as read");
        }
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetBookingChat(int bookingId)
    {
        try
        {
            var messages = await _chatService.GetBookingChatAsync(bookingId);
            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting booking chat for booking {BookingId}", bookingId);
            return StatusCode(500, "An error occurred while retrieving booking chat");
        }
    }

    private (int?, int?) GetCurrentUserInfo()
    {
        var userType = User.FindFirst(ClaimTypes.Role)?.Value;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userType) || string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User authentication information not found");
        }

        if (!int.TryParse(userIdClaim, out int parsedUserId))
        {
            throw new UnauthorizedAccessException("Invalid user ID format");
        }

        return userType switch
        {
            "User" => (parsedUserId, null),
            "Helper" => (null, parsedUserId),
            _ => throw new UnauthorizedAccessException("Invalid user type")
        };
    }

    [HttpPost("search")]
    [ApiResponseMessage("Tìm kiếm người dùng để chat thành công")]
    public async Task<ActionResult<SearchUsersResponseDto>> SearchUsersForChat([FromBody] SearchUsersRequestDto request)
    {
        try
        {
            var (currentUserId, currentHelperId) = GetCurrentUserInfo();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = new SearchUsersResponseDto
            {
                CurrentPage = request.PageNumber,
                PageSize = request.PageSize
            };

            // Search users if requested
            if (request.SearchType == "users" || request.SearchType == "all")
            {
                var (users, userCount) = await _userService.SearchUsersForChatAsync(
                    request.SearchTerm,
                    request.Email,
                    request.IsActive,
                    currentUserId, // Exclude current user if they are a user
                    currentUserId,
                    currentHelperId,
                    request.PageNumber,
                    request.PageSize);

                response.Users = users.ToList();
                response.TotalUsers = userCount;
            }

            // Search helpers if requested
            if (request.SearchType == "helpers" || request.SearchType == "all")
            {
                var (helpers, helperCount) = await _helperService.SearchHelpersForChatAsync(
                    request.SearchTerm,
                    request.Email,
                    request.IsActive,
                    request.AvailabilityStatus,
                    request.MinimumRating,
                    currentHelperId, // Exclude current helper if they are a helper
                    currentUserId,
                    currentHelperId,
                    request.PageNumber,
                    request.PageSize);

                response.Helpers = helpers.ToList();
                response.TotalHelpers = helperCount;
            }

            // Calculate pagination info
            var totalResults = response.TotalUsers + response.TotalHelpers;
            response.TotalPages = (int)Math.Ceiling((double)totalResults / request.PageSize);
            response.HasNextPage = request.PageNumber < response.TotalPages;
            response.HasPreviousPage = request.PageNumber > 1;

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching users for chat");
            return StatusCode(500, "An error occurred while searching for users");
        }
    }
}