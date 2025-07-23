{{baseUrl}}/api/Authentication/register/user POST

request:
{
  "email": "user@gmail.com",
  "fullName": "et tempor culpa",
  "password": "123123",
  "phoneNumber": "0123123123"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Registration successful. Please check your email for the OTP to verify your account.",
        "user": {
            "id": 10,
            "phoneNumber": "0123232123",
            "email": "user20@gmail.com",
            "fullName": "et tempor culpa",
            "profilePictureUrl": null,
            "registrationDate": "2025-07-23T06:39:54.7050552Z",
            "lastLoginDate": null,
            "externalAuthProvider": null,
            "externalAuthId": null,
            "isActive": false,
            "defaultAddressId": null,
            "role": "User"
        }
    },
    "timestamp": "2025-07-23T06:39:56.8912036Z",
    "requestId": "0HNE9H1TTOUOU:00000004"
}

{{baseUrl}}/api/Authentication/register/helper POST
request:
{
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "password": "securepassword123",
  "phoneNumber": "1234567890",
  "bio": "This is a sample bio.",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Registration successful. Please check your email for the OTP to verify your account.",
        "helper": {
            "id": 21,
            "phoneNumber": "1234567890",
            "email": "john.doe@example.com",
            "fullName": "John Doe",
            "profilePictureUrl": null,
            "bio": "This is a sample bio.",
            "dateOfBirth": "1990-01-01",
            "gender": "male",
            "registrationDate": "2025-07-23T06:41:15.7016443Z",
            "approvalStatus": "Pending",
            "approvedByAdminId": null,
            "approvalDate": null,
            "isActive": false,
            "isEmailVerified": false,
            "totalHoursWorked": 0,
            "averageRating": 0.00,
            "lastLoginDate": null,
            "role": "Helper",
            "skills": [],
            "workAreas": [],
            "documents": []
        }
    },
    "timestamp": "2025-07-23T06:41:17.8633898Z",
    "requestId": "0HNE9H1TTOUOU:00000006"
}