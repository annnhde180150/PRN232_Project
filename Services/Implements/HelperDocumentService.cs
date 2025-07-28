using AutoMapper;
using Repositories.Interfaces;
using Services.DTOs.Helper;
using Services.Interfaces;
using Microsoft.Extensions.Logging;
using Repositories;

namespace Services.Implements;

public class HelperDocumentService : IHelperDocumentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<HelperDocumentService> _logger;

    public HelperDocumentService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<HelperDocumentService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<HelperDocumentDto>> GetDocumentsByHelperIdAsync(int helperId)
    {
        _logger.LogInformation($"Getting documents for helper ID: {helperId}");
        
        var documents = await _unitOfWork.HelperDocuments.GetDocumentsByHelperIdAsync(helperId);
        return _mapper.Map<IEnumerable<HelperDocumentDto>>(documents);
    }

    public async Task<HelperDocumentDto?> GetDocumentByIdAsync(int documentId)
    {
        _logger.LogInformation($"Getting document by ID: {documentId}");
        
        var document = await _unitOfWork.HelperDocuments.GetDocumentByIdAsync(documentId);
        return _mapper.Map<HelperDocumentDto>(document);
    }

    public async Task<bool> UpdateDocumentStatusAsync(int documentId, string verificationStatus, int? verifiedByAdminId, string? notes)
    {
        _logger.LogInformation($"Updating document status for document ID: {documentId}, Status: {verificationStatus}, Admin: {verifiedByAdminId}");

        // Validate verification status
        if (string.IsNullOrEmpty(verificationStatus) || 
            !new[] { "Pending", "Approved", "Rejected", "Under Review" }.Contains(verificationStatus))
        {
            _logger.LogWarning($"Invalid verification status: {verificationStatus}");
            return false;
        }

        var result = await _unitOfWork.HelperDocuments.UpdateDocumentStatusAsync(documentId, verificationStatus, verifiedByAdminId, notes);
        
        if (result)
        {
            _logger.LogInformation($"Successfully updated document status for document ID: {documentId}");
        }
        else
        {
            _logger.LogWarning($"Failed to update document status for document ID: {documentId}");
        }

        return result;
    }

    public async Task<bool> ExistsAsync(int documentId)
    {
        var document = await _unitOfWork.HelperDocuments.GetDocumentByIdAsync(documentId);
        return document != null;
    }
} 