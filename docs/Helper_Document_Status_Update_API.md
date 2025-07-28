# Helper Document Status Update API

This document describes the API endpoints for managing helper document verification status.

## Overview

The Helper Document Status Update API allows administrators to update the verification status of helper documents. This includes approving, rejecting, or marking documents as under review.

## Endpoints

### 1. Get Documents by Helper ID

**GET** `/api/AdminHelperDocument/helper/{helperId}`

Retrieves all documents for a specific helper.

**Parameters:**
- `helperId` (int): The ID of the helper

**Response:**
```json
[
  {
    "documentId": 1,
    "documentType": "ID Card",
    "documentUrl": "https://example.com/document1.pdf",
    "uploadDate": "2024-01-15T10:30:00",
    "verificationStatus": "Pending",
    "verifiedByAdminId": null,
    "verificationDate": null,
    "notes": null
  }
]
```

### 2. Get Document by ID

**GET** `/api/AdminHelperDocument/{documentId}`

Retrieves a specific document by its ID.

**Parameters:**
- `documentId` (int): The ID of the document

**Response:**
```json
{
  "documentId": 1,
  "documentType": "ID Card",
  "documentUrl": "https://example.com/document1.pdf",
  "uploadDate": "2024-01-15T10:30:00",
  "verificationStatus": "Pending",
  "verifiedByAdminId": null,
  "verificationDate": null,
  "notes": null
}
```

### 3. Update Document Status

**PUT** `/api/AdminHelperDocument/{documentId}/status`

Updates the verification status of a helper document.

**Parameters:**
- `documentId` (int): The ID of the document to update

**Request Body:**
```json
{
  "documentId": 1,
  "verificationStatus": "Approved",
  "verifiedByAdminId": 1,
  "notes": "Document verified successfully"
}
```

**Verification Status Options:**
- `"Pending"`: Document is awaiting review
- `"Approved"`: Document has been approved
- `"Rejected"`: Document has been rejected
- `"Under Review"`: Document is currently being reviewed

**Response:**
```json
{
  "message": "Document status updated successfully",
  "document": {
    "documentId": 1,
    "documentType": "ID Card",
    "documentUrl": "https://example.com/document1.pdf",
    "uploadDate": "2024-01-15T10:30:00",
    "verificationStatus": "Approved",
    "verifiedByAdminId": 1,
    "verificationDate": "2024-01-16T14:30:00",
    "notes": "Document verified successfully"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid document ID"
}
```

### 404 Not Found
```json
{
  "message": "Document with ID 1 not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while updating the document status"
}
```

## Authentication

The API endpoints require authentication. The admin ID is extracted from the JWT token claims.

## Notifications

When a document status is updated, a notification is automatically sent to the helper with the following details:

- **Title**: "Document Approved", "Document Rejected", "Document Under Review", or "Document Status Updated"
- **Message**: Appropriate message based on the status change
- **Type**: "DocumentStatus"

## Usage Examples

### cURL Example

```bash
# Update document status to approved
curl -X PUT "https://api.example.com/api/AdminHelperDocument/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "documentId": 1,
    "verificationStatus": "Approved",
    "verifiedByAdminId": 1,
    "notes": "Document verified successfully"
  }'
```

### JavaScript Example

```javascript
const updateDocumentStatus = async (documentId, status, notes) => {
  const response = await fetch(`/api/AdminHelperDocument/${documentId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      documentId: documentId,
      verificationStatus: status,
      verifiedByAdminId: adminId,
      notes: notes
    })
  });
  
  return await response.json();
};
```

## Notes

- The `verifiedByAdminId` is automatically extracted from the JWT token if not provided
- The `verificationDate` is automatically set to the current timestamp when updating
- Invalid verification statuses will result in a 400 Bad Request response
- Notifications are sent asynchronously and failures don't affect the main operation 