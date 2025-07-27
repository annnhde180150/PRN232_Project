GET /api/Address/UserAddress/{id}
Response
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "addressId": 1,
    "userId": 1,
    "addressLine1": "123 Le Loi",
    "addressLine2": null,
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
  "timestamp": "2025-07-27T08:58:17.9881629Z",
  "requestId": "0HNECS54MAICO:00000001"
}


PUT /api/Address/UserAddress/{id}
{
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

DELETE /api/Address/UserAddress/{id}


POST /api/Address/UserAddress

{
  "userId": 0,
  "addressLine1": "string",
  "addressLine2": "string",
  "ward": "string",
  "district": "string",
  "city": "string",
  "fullAddress": "string"
}

GET /api/Address/User/{userId}

Response
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "addressId": 1,
      "userId": 1,
      "addressLine1": "123 Le Loi",
      "addressLine2": null,
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
      "addressId": 2,
      "userId": 1,
      "addressLine1": "456 Tran Hung Dao",
      "addressLine2": "Apt 2B",
      "ward": "Pham Ngu Lao",
      "district": "District 1",
      "city": "Ho Chi Minh City",
      "fullAddress": "456 Tran Hung Dao, Apt 2B, District 1, HCMC",
      "latitude": 10.762622,
      "longitude": 106.68211,
      "isDefault": false,
      "bookings": [],
      "serviceRequests": [],
      "user": null
    },
    {
      "addressId": 3,
      "userId": 1,
      "addressLine1": "789 Nguyen Trai",
      "addressLine2": null,
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
  "timestamp": "2025-07-27T09:00:48.4253303Z",
  "requestId": "0HNECS54MAICP:00000001"
}