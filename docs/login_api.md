{{baseUrl}}/api/Authentication/login/user POST

request:
{
  "email": "user@gmail.com",
  "password": "123123"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTMyNjcyNTAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxOTIiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDA1In0.Ljdu46OUvFBtN8bmYflYC5VU90EhiPy0pt7jo82laSo",
        "user": {
            "id": 3,
            "phoneNumber": "0123123123",
            "email": "user@gmail.com",
            "fullName": "et tempor culpa",
            "profilePictureUrl": null,
            "registrationDate": "2025-07-22T02:43:08.7858535",
            "lastLoginDate": "2025-07-23T04:21:44.6189281",
            "externalAuthProvider": null,
            "externalAuthId": null,
            "isActive": true,
            "defaultAddressId": null,
            "role": "User"
        }
    },
    "timestamp": "2025-07-23T07:40:50.1055137Z",
    "requestId": "0HNE9H1TTOUOV:00000001"
}

{{baseUrl}}/api/Authentication/login/helper POST
request:
{
  "email": "helperSun@gmail.com",
  "password": "123456"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiaGVscGVyU3VuQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkhlbHBlciIsImV4cCI6MTc1MzI2NzQ2MywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE5MiIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcwMDUifQ._VNyDzBbgEuclQXtF9Naw3VKT5snvIDRymIjlYEU0-A",
        "helper": {
            "id": 20,
            "phoneNumber": "0912345674",
            "email": "helperSun@gmail.com",
            "fullName": "Sun Nguyen",
            "profilePictureUrl": null,
            "bio": "Sun Nguyen",
            "dateOfBirth": "2007-07-23",
            "gender": "Male",
            "registrationDate": "2025-07-23T06:01:11.0136479",
            "approvalStatus": "approved",
            "approvedByAdminId": 1,
            "approvalDate": "2025-07-23T06:02:05.9719605",
            "isActive": true,
            "isEmailVerified": true,
            "totalHoursWorked": 0.00,
            "averageRating": 0.00,
            "lastLoginDate": "2025-07-23T06:19:45.7960588",
            "role": "Helper",
            "skills": [],
            "workAreas": [],
            "documents": []
        }
    },
    "timestamp": "2025-07-23T07:44:23.6918268Z",
    "requestId": "0HNE9H1TTOUP0:00000002"
}


{{baseUrl}}/api/Authentication/login/admin POST

request:
{
    "email": "admin@gmail.com",
    "password": "123456"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc1MzI2NzUyMSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE5MiIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcwMDUifQ.gQiYklwNkn4fJ8nQFzXMfEKK21oac6FXbCcnVFxh_kI",
        "admin": {
            "id": 1,
            "username": "nguyen van admin",
            "fullName": "string",
            "email": "admin@gmail.com",
            "creationDate": "2025-07-21T15:56:08.4612888",
            "lastLoginDate": "2025-07-23T06:22:13.4382815",
            "isActive": true,
            "role": "Admin"
        }
    },
    "timestamp": "2025-07-23T07:45:21.7499901Z",
    "requestId": "0HNE9H1TTOUP0:00000003"
}

{{baseUrl}}/api/Authentication/logout POST
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Logout successful"
    },
    "timestamp": "2025-07-23T07:46:03.8366021Z",
    "requestId": "0HNE9H1TTOUP0:00000004"
}