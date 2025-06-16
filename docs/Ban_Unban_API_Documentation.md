# Ban/Unban Profile Management API Documentation

## Overview

This API provides comprehensive profile management capabilities for banning and unbanning both User and Helper profiles. The functionality leverages the existing `IsActive` property in the User and Helper entities without requiring any database schema changes.

## Features

- ✅ Ban User profiles
- ✅ Ban Helper profiles
- ✅ Unban User profiles
- ✅ Unban Helper profiles
- ✅ Get profile status
- ✅ List banned profiles
- ✅ List active profiles
- ✅ Check if profile is banned
- ✅ Bulk ban/unban operations
- ✅ Real-time notifications via SignalR
- ✅ Admin authorization required

## API Endpoints

### Base URL
```
/api/ProfileManagement
```

### Authentication
All endpoints require Admin role authorization: `[Authorize(Roles = "Admin")]`

---

## Endpoints

### 1. Ban Profile
Bans a user or helper profile.

**POST** `/api/ProfileManagement/ban`

**Request Body:**
```json
{
  "profileId": 123,
  "profileType": "User", // or "Helper"
  "reason": "Violation of terms of service",
  "adminId": 1 // Set automatically from current user
}
```

**Response:**
```json
{
  "profileId": 123,
  "profileType": "User",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "isActive": false,
  "registrationDate": "2024-01-15T10:30:00Z",
  "lastLoginDate": "2024-12-20T14:45:00Z"
}
```

### 2. Unban Profile
Unbans a user or helper profile.

**POST** `/api/ProfileManagement/unban`

**Request Body:**
```json
{
  "profileId": 123,
  "profileType": "User", // or "Helper"
  "reason": "Appeal approved",
  "adminId": 1 // Set automatically from current user
}
```

**Response:** Same format as ban response with `isActive: true`

### 3. Get Profile Status
Gets the current status of a profile.

**GET** `/api/ProfileManagement/status/{profileId}/{profileType}`

**Parameters:**
- `profileId`: The ID of the profile
- `profileType`: "User" or "Helper"

**Response:**
```json
{
  "profileId": 123,
  "profileType": "User",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "isActive": true,
  "registrationDate": "2024-01-15T10:30:00Z",
  "lastLoginDate": "2024-12-20T14:45:00Z"
}
```

### 4. Get Banned Profiles
Lists all banned profiles (both users and helpers).

**GET** `/api/ProfileManagement/banned`

**Response:**
```json
[
  {
    "profileId": 123,
    "profileType": "User",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "isActive": false,
    "registrationDate": "2024-01-15T10:30:00Z",
    "lastLoginDate": "2024-12-20T14:45:00Z"
  },
  {
    "profileId": 456,
    "profileType": "Helper",
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "+0987654321",
    "isActive": false,
    "registrationDate": "2024-02-01T09:15:00Z",
    "lastLoginDate": "2024-12-19T16:30:00Z"
  }
]
```

### 5. Get Active Profiles
Lists all active profiles (both users and helpers).

**GET** `/api/ProfileManagement/active`

**Response:** Same format as banned profiles but with `isActive: true`

### 6. Check Ban Status
Checks if a specific profile is banned.

**GET** `/api/ProfileManagement/banned-status/{profileId}/{profileType}`

**Parameters:**
- `profileId`: The ID of the profile
- `profileType`: "User" or "Helper"

**Response:**
```json
true  // if banned
false // if active
```

### 7. Bulk Ban Profiles
Bans multiple profiles in a single operation.

**POST** `/api/ProfileManagement/bulk-ban`

**Request Body:**
```json
[
  {
    "profileId": 123,
    "profileType": "User",
    "reason": "Spam behavior"
  },
  {
    "profileId": 456,
    "profileType": "Helper",
    "reason": "Poor service quality"
  }
]
```

**Response:** Array of ProfileStatusDto objects

### 8. Bulk Unban Profiles
Unbans multiple profiles in a single operation.

**POST** `/api/ProfileManagement/bulk-unban`

**Request Body:** Same format as bulk ban

**Response:** Array of ProfileStatusDto objects

---

## Real-time Notifications

When a profile is banned or unbanned, the affected user/helper receives a real-time notification via SignalR:

### Ban Notification
```json
{
  "recipientUserId": 123, // or null if Helper
  "recipientHelperId": null, // or 456 if Helper
  "title": "Account Suspended",
  "message": "Your account has been suspended. Reason: Violation of terms",
  "notificationType": "AccountSuspension",
  "referenceId": "User_123",
  "isRead": false,
  "creationTime": "2024-12-20T15:30:00Z"
}
```

### Unban Notification
```json
{
  "recipientUserId": 123,
  "recipientHelperId": null,
  "title": "Account Restored",
  "message": "Your account has been restored and is now active. Note: Appeal approved",
  "notificationType": "AccountRestoration",
  "referenceId": "User_123",
  "isRead": false,
  "creationTime": "2024-12-20T15:35:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "ProfileType must be 'User' or 'Helper'"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin role required"
}
```

### 404 Not Found
```json
{
  "error": "User with ID 123 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred while banning the profile"
}
```

---

## Usage Examples

### Example 1: Ban a User
```bash
curl -X POST "https://api.example.com/api/ProfileManagement/ban" \
  -H "Authorization: Bearer {admin_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": 123,
    "profileType": "User",
    "reason": "Multiple violations"
  }'
```

### Example 2: Check if Helper is Banned
```bash
curl -X GET "https://api.example.com/api/ProfileManagement/banned-status/456/Helper" \
  -H "Authorization: Bearer {admin_jwt_token}"
```

### Example 3: Get All Banned Profiles
```bash
curl -X GET "https://api.example.com/api/ProfileManagement/banned" \
  -H "Authorization: Bearer {admin_jwt_token}"
```

---

## Implementation Details

### Database Schema
No database schema changes required. The implementation uses:
- `User.IsActive` property for user ban status
- `Helper.IsActive` property for helper ban status

### Service Architecture
- **ProfileManagementService**: Core business logic
- **ProfileManagementController**: API endpoints
- **IRealtimeNotificationService**: Real-time notifications
- **AutoMapper**: DTO mappings

### Key Components Created
- ✅ `Services/DTOs/Profile/` - Profile management DTOs
- ✅ `Services/DTOs/Helper/` - Helper entity DTOs  
- ✅ `Services/Interfaces/IProfileManagementService.cs`
- ✅ `Services/Implements/ProfileManagementService.cs`
- ✅ `Services/Interfaces/IHelperService.cs`
- ✅ `Services/Implements/HelperService.cs`
- ✅ `Repositories/Interfaces/IHelperRepository.cs`
- ✅ `Repositories/Implements/HelperRepository.cs`
- ✅ `Services/Mappers/HelperProfile.cs`
- ✅ `HomeHelperFinderAPI/Controllers/ProfileManagementController.cs`

### Dependency Injection
All new services are registered in `Program.cs`:
```csharp
// Repository registrations
builder.Services.AddScoped<IHelperRepository, HelperRepository>();

// Service registrations  
builder.Services.AddScoped<IHelperService, HelperService>();
builder.Services.AddScoped<IProfileManagementService, ProfileManagementService>();
```

---

## Security Considerations

1. **Admin Only**: All endpoints require Admin role
2. **Input Validation**: All DTOs include validation attributes
3. **Authorization**: Admin ID is extracted from JWT claims
4. **Audit Trail**: All ban/unban actions are logged with admin ID
5. **Error Handling**: Comprehensive error handling and logging

---

## Testing

### Unit Testing
Test the following scenarios:
- Ban active user/helper
- Unban banned user/helper  
- Invalid profile type
- Non-existent profile ID
- Unauthorized access
- Bulk operations

### Integration Testing
- Test SignalR notifications
- Test with real database
- Test admin authentication flow
- Test API response formats

---

## Future Enhancements

Potential improvements for future versions:
- Ban duration (temporary bans)
- Ban history tracking
- Ban reason categories
- Email notifications
- Appeal system integration
- Batch import/export
- Advanced search and filtering