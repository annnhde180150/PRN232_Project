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

