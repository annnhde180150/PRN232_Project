GET /api/Review/user/{userId}

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
    "timestamp": "2025-07-28T08:15:32.7612362Z",
    "requestId": "0HNEDLOCHTFAT:00000001"
}


GET /api/Review/helper/{helperId}
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
  "timestamp": "2025-07-28T08:16:55.6334873Z",
  "requestId": "0HNEDLOCHTFAU:00000001"
}



POST /api/Review
Request:
{
  "bookingId": 0,
  "helperId": 0,
  "rating": 0,
  "comment": "string"
}



GET /api/Review/{id}

{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "reviewId": 4,
        "bookingId": 1,
        "helperId": 8,
        "userId": 3,
        "rating": 5,
        "comment": "nostrud minim cupidatat sint",
        "reviewDate": "2025-07-22T11:11:42.3024062"
    },
    "timestamp": "2025-07-28T08:17:45.4359489Z",
    "requestId": "0HNEDLOCHTFB0:00000002"
}


PUT /api/Review/{id}

{
  "rating": 5,
  "comment": "string"
}


DELETE /api/Review/{id}


/api/Review/booking/{bookingId}
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "reviewId": 4,
        "bookingId": 1,
        "helperId": 8,
        "userId": 3,
        "rating": 5,
        "comment": "nostrud minim cupidatat sint",
        "reviewDate": "2025-07-22T11:11:42.3024062"
    },
    "timestamp": "2025-07-28T08:18:41.0446777Z",
    "requestId": "0HNEDLOCHTFB0:00000003"
}