Get {{baseURL}}/api/Bookings/GetBookingByHelperId/20
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "bookingId": 2,
            "requestId": 2,
            "userId": 3,
            "serviceId": 1,
            "addressId": 1,
            "status": "Pending",
            "scheduledStartTime": "2025-07-22T00:00:00",
            "scheduledEndTime": "2025-07-22T02:00:00",
            "latitude": null,
            "longitude": null,
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh City",
            "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
            "fullName": "et tempor culpa",
            "estimatedPrice": 300000.00,
            "serviceName": "Cleaning"
        },
        {
            "bookingId": 3,
            "requestId": 3,
            "userId": 3,
            "serviceId": 1,
            "addressId": 1,
            "status": "Pending",
            "scheduledStartTime": "2025-07-22T00:00:00",
            "scheduledEndTime": "2025-07-22T02:00:00",
            "latitude": null,
            "longitude": null,
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh City",
            "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
            "fullName": "et tempor culpa",
            "estimatedPrice": 300000.00,
            "serviceName": "Cleaning"
        },
        {
            "bookingId": 5,
            "requestId": 5,
            "userId": 3,
            "serviceId": 1,
            "addressId": 1,
            "status": "Pending",
            "scheduledStartTime": "2025-07-22T00:00:00",
            "scheduledEndTime": "2025-07-22T02:00:00",
            "latitude": null,
            "longitude": null,
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh City",
            "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
            "fullName": "et tempor culpa",
            "estimatedPrice": 300000.00,
            "serviceName": "Cleaning"
        }
    ],
    "timestamp": "2025-07-25T08:28:01.5464849Z",
    "requestId": "0HNE9H1TTOUSV:00000001"
}

url Put {{baseURL}}/api/ServiceRequests/UpdateRequestStatus
request:
{
  "requestId": 2,
  "bookingId": 2,
  "action": "Accept"
}
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "success": true,
        "message": "Request accepted successfully"
    },
    "timestamp": "2025-07-25T08:33:55.1452498Z",
    "requestId": "0HNE9H1TTOUT1:00000001"
}