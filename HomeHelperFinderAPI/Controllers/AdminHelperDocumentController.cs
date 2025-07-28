using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Helper;
using Services.Interfaces;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Services.DTOs.Notification;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminHelperDocumentController : ControllerBase
    {
        private readonly IHelperDocumentService _helperDocumentService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<AdminHelperDocumentController> _logger;

        public AdminHelperDocumentController(
            IHelperDocumentService helperDocumentService,
            INotificationService notificationService,
            ILogger<AdminHelperDocumentController> logger)
        {
            _helperDocumentService = helperDocumentService;
            _notificationService = notificationService;
            _logger = logger;
        }

        /// <summary>
        /// Get all documents for a specific helper
        /// </summary>
        /// <param name="helperId">Helper ID</param>
        /// <returns>List of helper documents</returns>
        [HttpGet("helper/{helperId}")]
        public async Task<IActionResult> GetDocumentsByHelperId(int helperId)
        {
            try
            {
                _logger.LogInformation($"Getting documents for helper ID: {helperId}");

                if (helperId <= 0)
                {
                    return BadRequest(new { message = "Invalid helper ID" });
                }

                var documents = await _helperDocumentService.GetDocumentsByHelperIdAsync(helperId);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting documents for helper {helperId}: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving documents" });
            }
        }

        /// <summary>
        /// Get a specific document by ID
        /// </summary>
        /// <param name="documentId">Document ID</param>
        /// <returns>Document details</returns>
        [HttpGet("{documentId}")]
        public async Task<IActionResult> GetDocumentById(int documentId)
        {
            try
            {
                _logger.LogInformation($"Getting document by ID: {documentId}");

                if (documentId <= 0)
                {
                    return BadRequest(new { message = "Invalid document ID" });
                }

                var document = await _helperDocumentService.GetDocumentByIdAsync(documentId);
                if (document == null)
                {
                    return NotFound(new { message = $"Document with ID {documentId} not found" });
                }

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting document {documentId}: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving the document" });
            }
        }

        /// <summary>
        /// Update the verification status of a helper document
        /// </summary>
        /// <param name="documentId">Document ID</param>
        /// <param name="updateDto">Update details</param>
        /// <returns>Success or error response</returns>
        [HttpPut("{documentId}/status")]
        public async Task<IActionResult> UpdateDocumentStatus(int documentId, [FromBody] HelperDocumentStatusUpdateDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Updating document status for document ID: {documentId}");

                // Validate input
                if (documentId <= 0)
                {
                    return BadRequest(new { message = "Invalid document ID" });
                }

                if (updateDto == null)
                {
                    return BadRequest(new { message = "Update data cannot be null" });
                }

                if (documentId != updateDto.DocumentId)
                {
                    return BadRequest(new { message = "Document ID mismatch" });
                }

                // Validate verification status
                if (string.IsNullOrEmpty(updateDto.VerificationStatus))
                {
                    return BadRequest(new { message = "Verification status is required" });
                }

                // Check if document exists
                if (!await _helperDocumentService.ExistsAsync(documentId))
                {
                    return NotFound(new { message = $"Document with ID {documentId} not found" });
                }

                // Get admin ID from claims (if authentication is implemented)
                var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? adminId = null;
                if (!string.IsNullOrEmpty(adminIdClaim) && int.TryParse(adminIdClaim, out int parsedAdminId))
                {
                    adminId = parsedAdminId;
                }

                // Update document status
                var result = await _helperDocumentService.UpdateDocumentStatusAsync(
                    documentId, 
                    updateDto.VerificationStatus, 
                    adminId, 
                    updateDto.Notes);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to update document status" });
                }

                // Get updated document for response
                var updatedDocument = await _helperDocumentService.GetDocumentByIdAsync(documentId);

                // Send notification to helper (if notification service is available)
                try
                {
                    if (updatedDocument != null)
                    {
                        var notificationTitle = updateDto.VerificationStatus switch
                        {
                            "Approved" => "Document Approved",
                            "Rejected" => "Document Rejected",
                            "Under Review" => "Document Under Review",
                            _ => "Document Status Updated"
                        };

                        var notificationMessage = updateDto.VerificationStatus switch
                        {
                            "Approved" => "Your document has been approved.",
                            "Rejected" => $"Your document has been rejected. {(string.IsNullOrEmpty(updateDto.Notes) ? "" : $"Reason: {updateDto.Notes}")}",
                            "Under Review" => "Your document is currently under review.",
                            _ => "Your document status has been updated."
                        };

                        // Note: You would need to get the helper ID from the document
                        // This is a simplified example - you might need to adjust based on your data structure
                        var notificationDto = new NotificationCreateDto
                        {
                            Title = notificationTitle,
                            Message = notificationMessage,
                            NotificationType = "DocumentStatus",
                            ReferenceId = documentId.ToString()
                        };

                        await _notificationService.CreateAsync(notificationDto);
                        _logger.LogInformation($"Notification sent for document status update: {documentId}");
                    }
                }
                catch (Exception notificationEx)
                {
                    _logger.LogWarning($"Failed to send notification for document {documentId}: {notificationEx.Message}");
                }

                return Ok(new { 
                    message = "Document status updated successfully", 
                    document = updatedDocument 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating document status for document {documentId}: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the document status" });
            }
        }
    }
} 