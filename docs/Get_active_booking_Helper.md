url GET {{baseURL}}/api/Bookings/ActiveByHelper/1
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "bookingId": 8,
            "requestId": 11,
            "userId": 1,
            "serviceId": 1,
            "addressId": 1,
            "status": "InProgress",
            "scheduledStartTime": "2025-07-30T17:06:00",
            "scheduledEndTime": "2025-07-30T19:06:00",
            "latitude": null,
            "longitude": null,
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh City",
            "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
            "fullName": "Minhaza",
            "estimatedPrice": 300000.00,
            "serviceName": "Cleaning"
        },
        {
            "bookingId": 9,
            "requestId": 12,
            "userId": 1,
            "serviceId": 1,
            "addressId": 1,
            "status": "Accepted",
            "scheduledStartTime": "2025-07-27T17:07:00",
            "scheduledEndTime": "2025-07-27T20:52:00",
            "latitude": null,
            "longitude": null,
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh City",
            "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
            "fullName": "Minhaza",
            "estimatedPrice": 300000.00,
            "serviceName": "Cleaning"
        },
        {
            "bookingId": 10,
            "requestId": 6,
            "userId": 1,
            "serviceId": 1,
            "addressId": 1,
            "status": "Completed",
            "scheduledStartTime": "2025-07-22T00:00:00",
            "scheduledEndTime": "2025-07-22T02:00:00",
            "latitude": null,
            "longitude": null,
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh City",
            "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
            "fullName": "Minhaza",
            "estimatedPrice": 300000.00,
            "serviceName": "Cleaning"
        }
    ],
    "timestamp": "2025-07-27T17:51:19.7791946Z",
    "requestId": "0HNECTG4S90U0:00000040"
}

url: put {{baseURL}}/api/Bookings/2/status
request
    "bookingId" : 2,
    "helperId" : 9,
    "status" : "Completed"
{
    {
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "bookingId": 2,
        "userId": 3,
        "serviceId": 1,
        "requestId": 2,
        "helperId": 9,
        "scheduledStartTime": "2025-07-22T00:00:00",
        "scheduledEndTime": "2025-07-22T02:00:00",
        "actualStartTime": null,
        "actualEndTime": null,
        "status": "Completed",
        "cancellationReason": null,
        "cancelledBy": null,
        "cancellationTime": null,
        "freeCancellationDeadline": "2025-07-22T14:57:00",
        "estimatedPrice": 300000.00,
        "finalPrice": 300000.00,
        "bookingCreationTime": "2025-07-22T06:36:25.8166667"
    },
    "timestamp": "2025-07-27T18:01:08.1380323Z",
    "requestId": "0HNECTG4S90U6:00000016"
}
}



