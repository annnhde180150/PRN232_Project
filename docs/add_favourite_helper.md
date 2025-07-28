GET /api/FavoriteHelper/user/{userId}

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "favoriteId": 2,
      "userId": 1,
      "helperId": 1,
      "dateAdded": "2025-07-21T12:59:00.3037609",
      "helperInfo": {
        "helperId": 1,
        "fullName": "Minhaza",
        "email": "minh@gmail.com",
        "profilePictureUrl": "https://firebasestorage.googleapis.com/v0/b/homehelperfindersu25.firebasestorage.app/o/profiles%2F1753244203855_34?alt=media&token=fcb45a1f-7c7e-4c6a-9871-e3c8f5495ede"
      }
    }
  ],
  "timestamp": "2025-07-28T11:05:40.1880639Z",
  "requestId": "0HNEDON106RRB:00000001"
}

POST /api/FavoriteHelper

{
  "userId": 0,
  "helperId": 0
}

DELETE 

{
  "userId": 0,
  "helperId": 0
}