GET {{baseUrl}}/api/Review/helper/:helperId

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": [
{
"reviewId": 3,
"bookingId": 1,
"helperId": 8,
"userId": 3,
"rating": 5,
"comment": "nostrud minim cupidatat sint",
"reviewDate": "2025-07-22T10:59:29.7940689"
}
],
"timestamp": "2025-07-22T11:09:34.9028746Z",
"requestId": "0HNE920HT8T0L:00000002"
}

{{baseUrl}}/api/Review/user/:userId

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": [
{
"reviewId": 3,
"bookingId": 1,
"helperId": 8,
"userId": 3,
"rating": 5,
"comment": "nostrud minim cupidatat sint",
"reviewDate": "2025-07-22T10:59:29.7940689"
}
],
"timestamp": "2025-07-22T11:09:03.912414Z",
"requestId": "0HNE920HT8T0L:00000001"
}

{{baseUrl}}/api/Review

request body:
{
"bookingId": 1,
"helperId": 8,
"rating": 5,
"comment": "nostrud minim cupidatat sint"
}

response:
{
"success": true,
"statusCode": 201,
"message": "Tạo mới thành công",
"data": {
"reviewId": 4,
"bookingId": 1,
"helperId": 8,
"userId": 3,
"rating": 5,
"comment": "nostrud minim cupidatat sint",
"reviewDate": "2025-07-22T11:11:42.3024062Z"
},
"timestamp": "2025-07-22T11:11:42.8690317Z",
"requestId": "0HNE920HT8T0N:00000002"
}