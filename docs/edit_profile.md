GET /api/Admin/profile/{adminId}
Response body
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": 1,
    "username": "nguyen van admin",
    "fullName": "string",
    "email": "admin@gmail.com",
    "creationDate": "2025-07-21T15:56:08.4612888",
    "lastLoginDate": "2025-07-27T05:43:42.8521113",
    "isActive": true,
    "role": "Admin"
  },
  "timestamp": "2025-07-27T08:17:00.0194247Z",
  "requestId": "0HNECS54MAICJ:00000001"
}

PUT /api/Admin/profile/{adminId}
{
  "username": "string",
  "fullName": "string",
  "email": "user@example.com",
  "role": "string",
  "isActive": true
}

PUT /api/Admin/change-password/{adminId}
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}



GET /api/Helper/profile/{helperId}
Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": 1,
    "phoneNumber": "0919940358",
    "email": "minh@gmail.com",
    "fullName": "Minhaza",
    "profilePictureUrl": "https://firebasestorage.googleapis.com/v0/b/homehelperfindersu25.firebasestorage.app/o/profiles%2F1753244203855_34?alt=media&token=fcb45a1f-7c7e-4c6a-9871-e3c8f5495ede",
    "bio": "nothing",
    "dateOfBirth": null,
    "gender": null,
    "registrationDate": "2025-07-20T08:41:30.5078711",
    "approvalStatus": "approved",
    "approvedByAdminId": 1,
    "approvalDate": "2025-07-21T15:56:59.0887247",
    "isActive": null,
    "isEmailVerified": null,
    "totalHoursWorked": 0,
    "averageRating": 0,
    "lastLoginDate": "2025-07-22T17:38:43.181677",
    "role": "Helper",
    "skills": [
      {
        "helperSkillId": 11,
        "serviceId": 1,
        "yearsOfExperience": 5,
        "isPrimarySkill": true
      }
    ],
    "workAreas": [
      {
        "workAreaId": 6,
        "city": "Đà Nẵng",
        "district": "Hải Châu",
        "ward": "Hải An",
        "latitude": 16.0487652,
        "longitude": 108.2140587,
        "radiusKm": 0
      }
    ],
    "documents": []
  },
  "timestamp": "2025-07-27T08:18:09.1772007Z",
  "requestId": "0HNECS54MAICJ:00000003"
}


PUT /api/Helper/profile/{helperId}

{
  "phoneNumber": "string",
  "email": "user@example.com",
  "fullName": "string",
  "profilePictureUrl": "string",
  "bio": "string",
  "dateOfBirth": "2025-07-27",
  "gender": "string",
  "isActive": true,
  "isEmailVerified": true,
  "skills": [
    {
      "serviceId": 0,
      "yearsOfExperience": 0,
      "isPrimarySkill": true
    }
  ],
  "workAreas": [
    {
      "city": "string",
      "district": "string",
      "ward": "string",
      "latitude": 0,
      "longitude": 0,
      "radiusKm": 0
    }
  ],
  "documents": [
    {
      "documentType": "string",
      "documentUrl": "string",
      "uploadDate": "2025-07-27T08:16:30.239Z",
      "notes": "string",
      "verificationStatus": "string",
      "verifiedByAdminId": 0,
      "verificationDate": "2025-07-27T08:16:30.239Z"
    }
  ]
}

PUT /api/Helper/change-password/{helperId}
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}


GET /api/User/profile/{userId}
Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": 1,
    "phoneNumber": "0914159666",
    "email": "minhdqde180271@fpt.edu.vn",
    "fullName": "Minhaza",
    "profilePictureUrl": null,
    "registrationDate": "2025-07-19T16:16:38.5341856",
    "lastLoginDate": "2025-07-27T07:15:47.731541",
    "externalAuthProvider": null,
    "externalAuthId": null,
    "isActive": true,
    "defaultAddressId": null,
    "role": "User"
  },
  "timestamp": "2025-07-27T08:19:27.9587159Z",
  "requestId": "0HNECS54MAICJ:00000005"
}

PUT /api/User/profile/{userId}
{
  "phoneNumber": "string",
  "email": "string",
  "fullName": "string",
  "profilePictureUrl": "string",
  "isActive": true,
  "defaultAddressId": 0,
  "defaultAddress": {
    "userId": 0,
    "addressLine1": "string",
    "addressLine2": "string",
    "ward": "string",
    "district": "string",
    "city": "string",
    "fullAddress": "string",
    "latitude": 0,
    "longitude": 0,
    "isDefault": true
  }
}


PUT /api/User/change-password/{userId}
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}