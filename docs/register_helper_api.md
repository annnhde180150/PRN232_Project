GET {{baseUrl}}/api/Service/active

response
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "serviceId": 1,
      "serviceName": "Cleaning",
      "description": "Clean a house",
      "iconUrl": null,
      "basePrice": 100000,
      "priceUnit": "VND",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 2,
      "serviceName": "Furniture Assembly",
      "description": "Assembly of beds, shelves, tables, and other furniture.",
      "iconUrl": "/icons/furniture.png",
      "basePrice": 180000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 3,
      "serviceName": "Gardening",
      "description": "Lawn mowing, plant trimming, and garden care services.",
      "iconUrl": "/icons/gardening.png",
      "basePrice": 160000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 4,
      "serviceName": "Babysitting",
      "description": "Professional babysitting and childcare service.",
      "iconUrl": "/icons/babysitting.png",
      "basePrice": 220000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 5,
      "serviceName": "Window Cleaning",
      "description": "Cleaning interior and exterior windows of homes.",
      "iconUrl": "/icons/windows.png",
      "basePrice": 200000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 6,
      "serviceName": "Packing & Moving",
      "description": "Help with packing and transporting belongings.",
      "iconUrl": "/icons/moving.png",
      "basePrice": 400000,
      "priceUnit": "VND/job",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 7,
      "serviceName": "Repair",
      "description": "Help repair house ",
      "iconUrl": null,
      "basePrice": 1000000,
      "priceUnit": "VND",
      "isActive": true,
      "parentServiceId": null
    }
  ],
  "timestamp": "2025-07-23T16:27:37.4052964Z",
  "requestId": "0HNEA0N40LGAJ:00000001"
}


{{baseUrl}}/api/Authentication/register/helper POST
request:
{
  "phoneNumber": "0914872568",
  "email": "testRegister8@gmail.com",
  "password": "123456",
  "fullName": "testRegister8",
  "bio": "string",
  "dateOfBirth": "2025-07-25",
  "gender": "Male",
  "skills": [
    {
      "serviceId": 1,
      "yearsOfExperience": 2,
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
      "radiusKm": 2
    }
  ],
  "documents": [
    {
      "documentType": "ID",
      "documentUrl": "https://firebasestorage.googleapis.com/v0/b/homehelperfindersu25.firebasestorage.app/o/cvs%2F1753248654747_msf%3A36?alt=media&token=2b23387e-52a3-4c10-91cf-89c1ad89bfab",
      "uploadDate": "2025-07-25T09:11:29.663Z",
      "verificationStatus": "Pending",
      "verifiedByAdminId": 1,
      "verificationDate": "2025-07-25T09:11:29.663Z",
      "notes": "string"
    }
  ]
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
                "uploadDate": "2025-07-25T09:11:29.663Z",
                "verificationStatus": "string",
                "verifiedByAdminId": 0,
                "verificationDate": "2025-07-25T09:11:29.663Z",
                "notes": "string"
                }
            ]
        }
    },
    "timestamp": "2025-07-23T06:41:17.8633898Z",
    "requestId": "0HNE9H1TTOUOU:00000006"
}



