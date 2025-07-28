<!-- ======Post Request====== -->
<!-- condition : UserId valid, ServiceId valid, 1 <= duration <=8 -->

<!-- fetch user addresses -->
curl -X 'GET' \
  'https://localhost:7192/api/Address/User/1' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "addressId": 1,
      "userId": 1,
      "addressLine1": "123 Le Loi",
      "addressLine2": "",
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
      "latitude": 10.7768891,
      "longitude": 106.7008064,
      "isDefault": true,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 3,
      "userId": 1,
      "addressLine1": "789 Nguyen Trai",
      "addressLine2": "",
      "ward": "Nguyen Cu Trinh",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "789 Nguyen Trai, District 1, HCMC",
      "latitude": 10.764912,
      "longitude": 106.680961,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 4,
      "userId": 1,
      "addressLine1": "88 Pasteur",
      "addressLine2": null,
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "88 Pasteur, District 1, HCMC",
      "latitude": 10.776529,
      "longitude": 106.700981,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 5,
      "userId": 1,
      "addressLine1": "15 Cach Mang Thang 8",
      "addressLine2": null,
      "ward": "Ben Thanh",
      "district": "District 3",
      "city": "Ho Chi Minh City",
      "fullAddress": "15 Cach Mang Thang 8, District 3, HCMC",
      "latitude": 10.77352,
      "longitude": 106.68808,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    }
  ],
  "timestamp": "2025-07-27T17:48:54.8469196Z",
  "requestId": "0HNED6KTGU19O:00000001"
}

<!-- fetch services -->
curl -X 'GET' \
  'https://localhost:7192/api/Service/active' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

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
      "description": "Assembly of beds, shelves.",
      "iconUrl": "/icons/furniture.png",
      "basePrice": 180000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 3,
      "serviceName": "Gardening",
      "description": "Lawn mowing, plant trimming.",
      "iconUrl": "/icons/gardening.png",
      "basePrice": 160000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 4,
      "serviceName": "Babysitting",
      "description": "Professional childcare service.",
      "iconUrl": "/icons/babysitting.png",
      "basePrice": 220000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 5,
      "serviceName": "Window Cleaning",
      "description": "Cleaning windows of homes.",
      "iconUrl": "/icons/windows.png",
      "basePrice": 200000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 6,
      "serviceName": "Packing & Moving",
      "description": "Packing and transporting.",
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
  "timestamp": "2025-07-27T17:50:09.4026818Z",
  "requestId": "0HNED6KTGU19O:00000003"
}

<!-- create api -->
curl -X 'POST' \
  'https://localhost:7192/api/ServiceRequests/CreateRequest' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "userId": 1,
  "serviceId": 1,
  "addressId": 1,
  "requestedStartTime": "2025-07-25T08:54:12.929Z",
  "requestedDurationHours": 2,
  "specialNotes": "string"
}'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "requestId": 22,
    "userId": 1,
    "serviceId": 1,
    "addressId": 1,
    "requestedStartTime": "2025-07-25T08:54:12.929",
    "requestedDurationHours": 2,
    "specialNotes": "string",
    "status": "Pending",
    "requestCreationTime": "2025-07-25T15:54:30.0937412",
    "latitude": null,
    "longitude": null
  },
  "timestamp": "2025-07-25T08:54:30.613646Z",
  "requestId": "0HNEBB2PHSDES:00000011"
}

<!-- ==================================================================================== -->
<!-- ======Edit Request====== -->
<!-- condition : UserId valid, ServiceId valid, 1 <= duration <=8, valid status string, valid addressId, request mustnt be booked, must not change userId -->

<!-- fetch request -->
curl -X 'GET' \
  'https://localhost:7192/api/ServiceRequests/GetRequest/1' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "requestId": 1,
    "userId": 1,
    "serviceId": 1,
    "addressId": 1,
    "requestedStartTime": "2025-07-22T00:00:00",
    "requestedDurationHours": 2,
    "specialNotes": "please be careful",
    "status": "Cancelled",
    "requestCreationTime": null,
    "latitude": null,
    "longitude": null
  },
  "timestamp": "2025-07-25T09:22:17.0343337Z",
  "requestId": "0HNEBBIPGDG3Q:00000009"
}

<!-- fetch user addresses -->
curl -X 'GET' \
  'https://localhost:7192/api/Address/User/1' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "addressId": 1,
      "userId": 1,
      "addressLine1": "123 Le Loi",
      "addressLine2": "",
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
      "latitude": 10.7768891,
      "longitude": 106.7008064,
      "isDefault": true,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 3,
      "userId": 1,
      "addressLine1": "789 Nguyen Trai",
      "addressLine2": "",
      "ward": "Nguyen Cu Trinh",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "789 Nguyen Trai, District 1, HCMC",
      "latitude": 10.764912,
      "longitude": 106.680961,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 4,
      "userId": 1,
      "addressLine1": "88 Pasteur",
      "addressLine2": null,
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "88 Pasteur, District 1, HCMC",
      "latitude": 10.776529,
      "longitude": 106.700981,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 5,
      "userId": 1,
      "addressLine1": "15 Cach Mang Thang 8",
      "addressLine2": null,
      "ward": "Ben Thanh",
      "district": "District 3",
      "city": "Ho Chi Minh City",
      "fullAddress": "15 Cach Mang Thang 8, District 3, HCMC",
      "latitude": 10.77352,
      "longitude": 106.68808,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    }
  ],
  "timestamp": "2025-07-27T17:48:54.8469196Z",
  "requestId": "0HNED6KTGU19O:00000001"
}

<!-- fetch services -->
curl -X 'GET' \
  'https://localhost:7192/api/Service/active' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

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
      "description": "Assembly of beds, shelves.",
      "iconUrl": "/icons/furniture.png",
      "basePrice": 180000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 3,
      "serviceName": "Gardening",
      "description": "Lawn mowing, plant trimming.",
      "iconUrl": "/icons/gardening.png",
      "basePrice": 160000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 4,
      "serviceName": "Babysitting",
      "description": "Professional childcare service.",
      "iconUrl": "/icons/babysitting.png",
      "basePrice": 220000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 5,
      "serviceName": "Window Cleaning",
      "description": "Cleaning windows of homes.",
      "iconUrl": "/icons/windows.png",
      "basePrice": 200000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 6,
      "serviceName": "Packing & Moving",
      "description": "Packing and transporting.",
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
  "timestamp": "2025-07-27T17:50:09.4026818Z",
  "requestId": "0HNED6KTGU19O:00000003"
}

<!-- edit api -->
curl -X 'PUT' \
  'https://localhost:7192/api/ServiceRequests/EditRequest' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "requestId": 1,
  "userId": 1,
  "serviceId": 1,
  "addressId": 1,
  "requestedStartTime": "2025-07-22T00:00:00",
  "requestedDurationHours": 2,
  "specialNotes": "please be careful",
  "status": "Cancelled",
  "latitude": 0,
  "longitude": 0
}'

{
  "success": false,
  "statusCode": 400,
  "message": "Yêu cầu không hợp lệ",
  "data": "Invalid request",
  "timestamp": "2025-07-27T15:06:32.4805787Z",
  "requestId": "0HNED3N4IT0NV:0000000B"
}


<!-- ==================================================================================== -->
<!-- ======Delete Request====== -->
<!-- condition : Request must be pending and exist -->

<!-- fetch request -->
curl -X 'GET' \
  'https://localhost:7192/api/ServiceRequests/GetRequest/1' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "requestId": 1,
    "userId": 1,
    "serviceId": 1,
    "addressId": 1,
    "requestedStartTime": "2025-07-22T00:00:00",
    "requestedDurationHours": 2,
    "specialNotes": "please be careful",
    "status": "Cancelled",
    "requestCreationTime": null,
    "latitude": null,
    "longitude": null
  },
  "timestamp": "2025-07-25T09:22:17.0343337Z",
  "requestId": "0HNEBBIPGDG3Q:00000009"
}

<!-- delete request -->
curl -X 'DELETE' \
  'https://localhost:7192/api/ServiceRequests/DeleteRequest/20' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": "Delete Successfully",
  "timestamp": "2025-07-27T15:32:33.1382636Z",
  "requestId": "0HNED3N4IT0NV:0000000D"
}

<!-- ==================================================================================== -->
<!-- ======Book Helper====== -->
<!-- condition : UserId valid, ServiceId valid, 1 <= duration <=8, helperId valid, helper is available in booked time -->

<!-- fetch helper available service -->
curl -X 'GET' \
  'https://localhost:7192/api/Helper/GetHelperServices/1' \
  -H 'accept: */*'

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
      "parentServiceId": null,
      "bookings": [],
      "helperSkills": [],
      "inverseParentService": [],
      "parentService": null,
      "serviceRequests": []
    }
  ],
  "timestamp": "2025-07-27T17:55:17.2024072Z",
  "requestId": "0HNED6KTGU19O:00000009"
}

<!-- fetch user addresses -->
curl -X 'GET' \
  'https://localhost:7192/api/Address/User/1' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "addressId": 1,
      "userId": 1,
      "addressLine1": "123 Le Loi",
      "addressLine2": "",
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
      "latitude": 10.7768891,
      "longitude": 106.7008064,
      "isDefault": true,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 3,
      "userId": 1,
      "addressLine1": "789 Nguyen Trai",
      "addressLine2": "",
      "ward": "Nguyen Cu Trinh",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "789 Nguyen Trai, District 1, HCMC",
      "latitude": 10.764912,
      "longitude": 106.680961,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 4,
      "userId": 1,
      "addressLine1": "88 Pasteur",
      "addressLine2": null,
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "88 Pasteur, District 1, HCMC",
      "latitude": 10.776529,
      "longitude": 106.700981,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 5,
      "userId": 1,
      "addressLine1": "15 Cach Mang Thang 8",
      "addressLine2": null,
      "ward": "Ben Thanh",
      "district": "District 3",
      "city": "Ho Chi Minh City",
      "fullAddress": "15 Cach Mang Thang 8, District 3, HCMC",
      "latitude": 10.77352,
      "longitude": 106.68808,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    }
  ],
  "timestamp": "2025-07-27T17:48:54.8469196Z",
  "requestId": "0HNED6KTGU19O:00000001"
}

<!-- book helper api -->
curl -X 'POST' \
  'https://localhost:7192/api/Bookings/BookHelper/1' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "userId": 1,
  "serviceId": 1,
  "addressId": 1,
  "requestedStartTime": "2025-08-05T17:53:26.760Z",
  "requestedDurationHours": 2,
  "specialNotes": "please be fast"
}'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "bookingId": 16,
    "userId": 1,
    "serviceId": 1,
    "requestId": 23,
    "helperId": 1,
    "scheduledStartTime": "2025-08-05T17:53:26.76",
    "scheduledEndTime": "2025-08-05T19:53:26.76",
    "actualStartTime": null,
    "actualEndTime": null,
    "status": "Pending",
    "cancellationReason": null,
    "cancelledBy": null,
    "cancellationTime": null,
    "freeCancellationDeadline": "2025-08-05T05:53:26.76",
    "estimatedPrice": 200000,
    "finalPrice": null,
    "bookingCreationTime": "2025-07-27T17:54:12.4381721"
  },
  "timestamp": "2025-07-27T17:54:14.6423633Z",
  "requestId": "0HNED6KTGU19O:00000007"
}


<!-- ==================================================================================== -->
<!-- ======edit booking====== -->
<!-- condition : bookginId valid, userId valid, 1 <= duration <=8, helper available at booked time -->

<!-- fetch booking -->
curl -X 'GET' \
  'https://localhost:7192/api/Bookings/getBooking/1' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "bookingId": 1,
    "userId": 3,
    "serviceId": 1,
    "requestId": 1,
    "helperId": 20,
    "scheduledStartTime": "2025-07-22T00:00:00",
    "scheduledEndTime": "2025-07-22T02:00:00",
    "actualStartTime": null,
    "actualEndTime": null,
    "status": "Cancelled",
    "cancellationReason": null,
    "cancelledBy": null,
    "cancellationTime": "2025-07-25T09:18:13.9311267",
    "freeCancellationDeadline": "2025-07-22T14:56:52",
    "estimatedPrice": 300000,
    "finalPrice": 300000,
    "bookingCreationTime": "2025-07-21T17:03:56.6866667"
  },
  "timestamp": "2025-07-27T17:57:16.2707337Z",
  "requestId": "0HNED6KTGU19O:0000000B"
}

<!-- fetch helper available service -->
curl -X 'GET' \
  'https://localhost:7192/api/Helper/GetHelperServices/1' \
  -H 'accept: */*'

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
      "parentServiceId": null,
      "bookings": [],
      "helperSkills": [],
      "inverseParentService": [],
      "parentService": null,
      "serviceRequests": []
    }
  ],
  "timestamp": "2025-07-27T17:55:17.2024072Z",
  "requestId": "0HNED6KTGU19O:00000009"
}

<!-- fetch user addresses -->
curl -X 'GET' \
  'https://localhost:7192/api/Address/User/1' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "addressId": 1,
      "userId": 1,
      "addressLine1": "123 Le Loi",
      "addressLine2": "",
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "123 Le Loi, Ben Nghe, District 1, HCMC",
      "latitude": 10.7768891,
      "longitude": 106.7008064,
      "isDefault": true,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 3,
      "userId": 1,
      "addressLine1": "789 Nguyen Trai",
      "addressLine2": "",
      "ward": "Nguyen Cu Trinh",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "789 Nguyen Trai, District 1, HCMC",
      "latitude": 10.764912,
      "longitude": 106.680961,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 4,
      "userId": 1,
      "addressLine1": "88 Pasteur",
      "addressLine2": null,
      "ward": "Ben Nghe",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "88 Pasteur, District 1, HCMC",
      "latitude": 10.776529,
      "longitude": 106.700981,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 5,
      "userId": 1,
      "addressLine1": "15 Cach Mang Thang 8",
      "addressLine2": null,
      "ward": "Ben Thanh",
      "district": "District 3",
      "city": "Ho Chi Minh City",
      "fullAddress": "15 Cach Mang Thang 8, District 3, HCMC",
      "latitude": 10.77352,
      "longitude": 106.68808,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    }
  ],
  "timestamp": "2025-07-27T17:48:54.8469196Z",
  "requestId": "0HNED6KTGU19O:00000001"
}

<!-- update booking api -->
curl -X 'PUT' \
  'https://localhost:7192/api/Bookings/EditBookedRequest' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "bookingId": 8,
  "userId": 1,
  "serviceId": 1,
  "requestId": 11,
  "helperId": 1,
  "scheduledStartTime": "2025-07-30T17:06:00",
    "scheduledEndTime": "2025-07-30T19:06:00",
    "actualStartTime": null,
    "actualEndTime": null,
    "status": "InProgress",
    "cancellationReason": null,
    "cancelledBy": null,
    "cancellationTime": null,
    "freeCancellationDeadline": "2025-07-27T02:17:00",
    "estimatedPrice": 300000,
    "finalPrice": 300000
}'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "bookingId": 8,
    "userId": 1,
    "serviceId": 1,
    "requestId": 11,
    "helperId": 1,
    "scheduledStartTime": "2025-07-30T17:06:00",
    "scheduledEndTime": "2025-07-30T19:06:00",
    "actualStartTime": null,
    "actualEndTime": null,
    "status": "InProgress",
    "cancellationReason": null,
    "cancelledBy": null,
    "cancellationTime": null,
    "freeCancellationDeadline": "2025-07-27T02:17:00",
    "estimatedPrice": 200000,
    "finalPrice": 200000,
    "bookingCreationTime": null
  },
  "timestamp": "2025-07-27T18:01:35.0180584Z",
  "requestId": "0HNED6KTGU19O:00000011"
}

<!-- ==================================================================================== -->
<!-- ======Cancel Booking====== -->
<!-- condition : bookingId valid, must have reason and by, time cannot pass cancellation deadline(12 hours before start)a-->

<!-- fetch booking -->
curl -X 'GET' \
  'https://localhost:7192/api/Bookings/getBooking/1' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "bookingId": 1,
    "userId": 3,
    "serviceId": 1,
    "requestId": 1,
    "helperId": 20,
    "scheduledStartTime": "2025-07-22T00:00:00",
    "scheduledEndTime": "2025-07-22T02:00:00",
    "actualStartTime": null,
    "actualEndTime": null,
    "status": "Cancelled",
    "cancellationReason": null,
    "cancelledBy": null,
    "cancellationTime": "2025-07-25T09:18:13.9311267",
    "freeCancellationDeadline": "2025-07-22T14:56:52",
    "estimatedPrice": 300000,
    "finalPrice": 300000,
    "bookingCreationTime": "2025-07-21T17:03:56.6866667"
  },
  "timestamp": "2025-07-27T17:57:16.2707337Z",
  "requestId": "0HNED6KTGU19O:0000000B"
}

<!-- cancel booking api -->
curl -X 'POST' \
  'https://localhost:7192/api/Bookings/CancelBooking' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "bookingId": 16,
  "cancellationReason": "dont like it",
  "cancelledBy": "User"
}'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": "Booking cancelled successfully",
  "timestamp": "2025-07-27T18:06:00.426711Z",
  "requestId": "0HNED6KTGU19O:00000021"
}


<!-- ==================================================================================== -->
<!-- ======View User Schedule ( co the da trung UC cua danh)====== -->

<!-- ==================================================================================== -->
<!-- ======View Feedback====== -->
<!-- fetch the completed booking service names because review dont have service name (fetch to get Service name because in feedback doesnt have serviceName) -->
curl -X 'GET' \
  'https://localhost:7192/api/Bookings/GetHelperBookingServiceNames/1' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "bookingId": 10,
      "serviceName": "Cleaning"
    }
  ],
  "timestamp": "2025-07-27T18:09:36.8820117Z",
  "requestId": "0HNED6KTGU19O:00000025"
}

<!-- fetch feedbacks -->
curl -X 'GET' \
  'https://localhost:7192/api/Review/helper/8' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "reviewId": 4,
      "bookingId": 1,
      "helperId": 8,
      "userId": 3,
      "rating": 5,
      "comment": "nostrud minim cupidatat sint",
      "reviewDate": "2025-07-22T11:11:42.3024062"
    }
  ],
  "timestamp": "2025-07-27T18:12:32.7193199Z",
  "requestId": "0HNED6KTGU19O:0000002F"
}

<!-- ==================================================================================== -->
<!-- ======Browse Request====== -->

<!-- fetch services to display service name due to no name of service in request -->
curl -X 'GET' \
  'https://localhost:7192/api/Service/active' \
  -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'

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
      "description": "Assembly of beds, shelves.",
      "iconUrl": "/icons/furniture.png",
      "basePrice": 180000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 3,
      "serviceName": "Gardening",
      "description": "Lawn mowing, plant trimming.",
      "iconUrl": "/icons/gardening.png",
      "basePrice": 160000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 4,
      "serviceName": "Babysitting",
      "description": "Professional childcare service.",
      "iconUrl": "/icons/babysitting.png",
      "basePrice": 220000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 5,
      "serviceName": "Window Cleaning",
      "description": "Cleaning windows of homes.",
      "iconUrl": "/icons/windows.png",
      "basePrice": 200000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 6,
      "serviceName": "Packing & Moving",
      "description": "Packing and transporting.",
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
  "timestamp": "2025-07-27T18:14:58.174772Z",
  "requestId": "0HNED6KTGU19O:00000033"
}

<!-- fetch request -->
curl -X 'GET' \
  'https://localhost:7192/api/ServiceRequests/GetAvailableRequests' \
  -H 'accept: */*'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "requestId": 4,
      "userId": 1,
      "serviceId": 1,
      "addressId": 1,
      "requestedStartTime": "2025-07-22T00:00:00",
      "requestedDurationHours": 2,
      "specialNotes": "please be careful",
      "status": "Pending",
      "requestCreationTime": null,
      "latitude": null,
      "longitude": null,
      "helperId": null,
      "address": null,
      "bookings": [],
      "service": null,
      "user": null,
      "helper": null
    },
    {
      "requestId": 5,
      "userId": 1,
      "serviceId": 1,
      "addressId": 1,
      "requestedStartTime": "2025-07-22T00:00:00",
      "requestedDurationHours": 2,
      "specialNotes": "please be careful",
      "status": "Pending",
      "requestCreationTime": null,
      "latitude": null,
      "longitude": null,
      "helperId": null,
      "address": null,
      "bookings": [],
      "service": null,
      "user": null,
      "helper": null
    }
  ],
  "timestamp": "2025-07-27T18:13:22.2102187Z",
  "requestId": "0HNED6KTGU19O:00000031"
}

<!-- ==================================================================================== -->
<!-- ======Browse Accepted Request by Helper(User main actor)====== -->

<!-- get temp bookings -->
curl -X 'POST' \
  'https://localhost:7192/api/Bookings/AcceptHelper' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "bookingId": 31,
  "isAccepted": true
}'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "bookingId": 32,
      "userId": 1,
      "serviceId": 1,
      "requestId": 39,
      "helperId": 36,
      "scheduledStartTime": "2025-08-08T17:42:49.332",
      "scheduledEndTime": "2025-08-08T19:42:49.332",
      "actualStartTime": null,
      "actualEndTime": null,
      "status": "TemporaryAccepted",
      "cancellationReason": null,
      "cancelledBy": null,
      "cancellationTime": null,
      "freeCancellationDeadline": "2025-08-08T05:42:49.332",
      "estimatedPrice": 200000,
      "finalPrice": null,
      "bookingCreationTime": "2025-07-29T00:43:25.6102107",
      "serviceName": "Dọn nhà",
      "helperName": "testRegister16",
      "address": "123 Le Loi, Ben Nghe, District 1, HCMC",
      "paymentStatus": null
    }
  ],
  "timestamp": "2025-07-29T00:44:18.5806336+07:00",
  "requestId": "0HNEDVNMGM27Q:00000013"
}

<!-- ==================================================================================== -->
<!-- ======User Accept Helper apply for request====== -->

curl -X 'POST' \
  'https://localhost:7192/api/Bookings/AcceptHelper' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json;odata.metadata=minimal;odata.streaming=true' \
  -d '{
  "bookingId": 32,
  "isAccepted": false
}'

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "bookingId": 32,
    "userId": 1,
    "serviceId": 1,
    "requestId": 39,
    "helperId": 36,
    "scheduledStartTime": "2025-08-08T17:42:49.332",
    "scheduledEndTime": "2025-08-08T19:42:49.332",
    "actualStartTime": null,
    "actualEndTime": null,
    "status": "Cancelled",
    "cancellationReason": null,
    "cancelledBy": null,
    "cancellationTime": null,
    "freeCancellationDeadline": "2025-08-08T05:42:49.332",
    "estimatedPrice": 200000,
    "finalPrice": null,
    "bookingCreationTime": "2025-07-29T00:43:25.6102107",
    "serviceName": "",
    "helperName": "",
    "address": null,
    "paymentStatus": null
  },
  "timestamp": "2025-07-29T00:46:50.9238097+07:00",
  "requestId": "0HNEDVNMGM27Q:00000015"
}