{{baseUrl}}/api/Chat/send POST
request:
{
  "messageContent": "voluptate eiusmod",
  "bookingId": 1,
  "receiverUserId": 1,
  "receiverHelperId": 1
}
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "chatId": 42,
        "bookingId": 1,
        "senderUserId": null,
        "senderHelperId": 20,
        "receiverUserId": 1,
        "receiverHelperId": 1,
        "messageContent": "voluptate eiusmod",
        "timestamp": "2025-07-24T14:18:59.0074493Z",
        "isReadByReceiver": false,
        "readTimestamp": null,
        "isModerated": false,
        "moderatorAdminId": null,
        "senderName": "Sun Nguyen",
        "senderProfilePicture": null,
        "senderType": "Helper"
    },
    "timestamp": "2025-07-24T14:18:59.1692822Z",
    "requestId": "0HNE9H1TTOURF:00000002"
}

{{baseUrl}}/api/Chat/conversation?bookingId=1&otherUserId=1&otherHelperId=1 GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "chatId": 42,
            "bookingId": 1,
            "senderUserId": null,
            "senderHelperId": 20,
            "receiverUserId": 1,
            "receiverHelperId": 1,
            "messageContent": "voluptate eiusmod",
            "timestamp": "2025-07-24T14:18:59.0074493",
            "isReadByReceiver": false,
            "readTimestamp": null,
            "isModerated": false,
            "moderatorAdminId": null,
            "senderName": "Sun Nguyen",
            "senderProfilePicture": null,
            "senderType": "Helper"
        }
    ],
    "timestamp": "2025-07-24T14:20:13.6150644Z",
    "requestId": "0HNE9H1TTOURF:00000004"
}

{{baseUrl}}/api/Chat/conversations GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "conversationId": "H20_U1_B1",
            "bookingId": 1,
            "participantUserId": 1,
            "participantHelperId": 1,
            "participantName": "Minhaza",
            "participantProfilePicture": null,
            "participantType": "User",
            "lastMessage": {
                "chatId": 42,
                "bookingId": 1,
                "senderUserId": null,
                "senderHelperId": 20,
                "receiverUserId": 1,
                "receiverHelperId": 1,
                "messageContent": "voluptate eiusmod",
                "timestamp": "2025-07-24T14:18:59.0074493",
                "isReadByReceiver": false,
                "readTimestamp": null,
                "isModerated": false,
                "moderatorAdminId": null,
                "senderName": "Sun Nguyen",
                "senderProfilePicture": null,
                "senderType": "Helper"
            },
            "unreadCount": 0,
            "lastActivity": "2025-07-24T14:18:59.0074493"
        },
        {
            "conversationId": "H20_H6",
            "bookingId": null,
            "participantUserId": null,
            "participantHelperId": 6,
            "participantName": "Helper2",
            "participantProfilePicture": null,
            "participantType": "Helper",
            "lastMessage": {
                "chatId": 41,
                "bookingId": null,
                "senderUserId": null,
                "senderHelperId": 6,
                "receiverUserId": null,
                "receiverHelperId": 20,
                "messageContent": "hi",
                "timestamp": "2025-07-23T06:21:51.7972557",
                "isReadByReceiver": false,
                "readTimestamp": null,
                "isModerated": false,
                "moderatorAdminId": null,
                "senderName": "Helper2",
                "senderProfilePicture": null,
                "senderType": "Helper"
            },
            "unreadCount": 2,
            "lastActivity": "2025-07-23T06:21:51.7972557"
        }
    ],
    "timestamp": "2025-07-24T14:32:19.7018683Z",
    "requestId": "0HNE9H1TTOURG:00000002"
}

{{baseUrl}}/api/Chat/unread/count GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": 2,
    "timestamp": "2025-07-24T14:33:09.7414515Z",
    "requestId": "0HNE9H1TTOURG:00000004"
}

{{baseUrl}}/api/Chat/unread GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "chatId": 41,
            "bookingId": null,
            "senderUserId": null,
            "senderHelperId": 6,
            "receiverUserId": null,
            "receiverHelperId": 20,
            "messageContent": "hi",
            "timestamp": "2025-07-23T06:21:51.7972557",
            "isReadByReceiver": false,
            "readTimestamp": null,
            "isModerated": false,
            "moderatorAdminId": null,
            "senderName": "Helper2",
            "senderProfilePicture": null,
            "senderType": "Helper"
        },
        {
            "chatId": 40,
            "bookingId": null,
            "senderUserId": null,
            "senderHelperId": 6,
            "receiverUserId": null,
            "receiverHelperId": 20,
            "messageContent": "hi",
            "timestamp": "2025-07-23T06:21:27.0552032",
            "isReadByReceiver": false,
            "readTimestamp": null,
            "isModerated": false,
            "moderatorAdminId": null,
            "senderName": "Helper2",
            "senderProfilePicture": null,
            "senderType": "Helper"
        }
    ],
    "timestamp": "2025-07-24T14:33:49.9082441Z",
    "requestId": "0HNE9H1TTOURG:00000006"
}

{{baseUrl}}/api/Chat/mark-as-read POST
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "message": "Messages marked as read successfully"
    },
    "timestamp": "2025-07-24T14:34:14.2509987Z",
    "requestId": "0HNE9H1TTOURG:00000007"
}

{{baseUrl}}/api/Chat/booking/:bookingId GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "chatId": 42,
            "bookingId": 1,
            "senderUserId": null,
            "senderHelperId": 20,
            "receiverUserId": 1,
            "receiverHelperId": 1,
            "messageContent": "voluptate eiusmod",
            "timestamp": "2025-07-24T14:18:59.0074493",
            "isReadByReceiver": false,
            "readTimestamp": null,
            "isModerated": false,
            "moderatorAdminId": null,
            "senderName": "Sun Nguyen",
            "senderProfilePicture": null,
            "senderType": "Helper"
        }
    ],
    "timestamp": "2025-07-24T14:34:52.6570631Z",
    "requestId": "0HNE9H1TTOURG:00000009"
}

/api/Chat/search POST

request:
{
"searchType": "users" or "helpers",
"searchTerm": "",
"email": "",
"isActive": true,
"pageSize": 1,
"pageNumber": 1,
"availabilityStatus": "Available" or "Busy" or "Offline",
"minimumRating": 3.383167854289595
}

response:
{
"success": true,
"statusCode": 200,
"message": "Tìm kiếm người dùng để chat thành công",
"data": {
"users": [
{
"userId": 4,
"fullName": "et tempor culpa",
"email": "user1@gmail.com",
"phoneNumber": "0231323123",
"profilePictureUrl": null,
"isActive": true,
"lastLoginDate": null,
"hasExistingConversation": false,
"lastConversationDate": null
},
{
"userId": 5,
"fullName": "et tempor culpa",
"email": "user2@gmail.com",
"phoneNumber": "0231123123",
"profilePictureUrl": null,
"isActive": true,
"lastLoginDate": null,
"hasExistingConversation": false,
"lastConversationDate": null
},
{
"userId": 6,
"fullName": "et tempor culpa",
"email": "user3@gmail.com",
"phoneNumber": "0231123523",
"profilePictureUrl": null,
"isActive": true,
"lastLoginDate": null,
"hasExistingConversation": false,
"lastConversationDate": null
},
{
"userId": 1,
"fullName": "Minhaza",
"email": "minhdqde180271@fpt.edu.vn",
"phoneNumber": "0914159666",
"profilePictureUrl": null,
"isActive": true,
"lastLoginDate": "2025-07-19T16:18:19.8000623",
"hasExistingConversation": false,
"lastConversationDate": null
},
{
"userId": 2,
"fullName": "nguyen van danh",
"email": "danhvannguyen000@gmail.com",
"phoneNumber": "0919940359",
"profilePictureUrl": null,
"isActive": true,
"lastLoginDate": "2025-07-21T15:25:25.7800542",
"hasExistingConversation": false,
"lastConversationDate": null
}
],
"helpers": [
{
"helperId": 1,
"fullName": "123456",
"email": "danhvannguyen001@gmail.com",
"phoneNumber": "0919940358",
"profilePictureUrl": null,
"bio": "nothing",
"isActive": true,
"averageRating": 0.00,
"lastLoginDate": null,
"availableStatus": 0,
"hasExistingConversation": false,
"lastConversationDate": null,
"skills": [
"Cleaning"
]
},
{
"helperId": 3,
"fullName": "nguyen van danh",
"email": "danhvannguyen002@gmail.com",
"phoneNumber": "0919940357",
"profilePictureUrl": null,
"bio": "string",
"isActive": true,
"averageRating": 0.00,
"lastLoginDate": null,
"availableStatus": 2,
"hasExistingConversation": false,
"lastConversationDate": null,
"skills": []
},
{
"helperId": 6,
"fullName": "nguyen van helper",
"email": "helper@gmail.com",
"phoneNumber": "0919940356",
"profilePictureUrl": null,
"bio": "string",
"isActive": true,
"averageRating": 0.00,
"lastLoginDate": null,
"availableStatus": 2,
"hasExistingConversation": false,
"lastConversationDate": null,
"skills": []
},
{
"helperId": 7,
"fullName": "nguyen van helper",
"email": "danhnvde180668@fpt.edu.vn",
"phoneNumber": "0919940355",
"profilePictureUrl": null,
"bio": "string",
"isActive": true,
"averageRating": 0.00,
"lastLoginDate": "2025-07-21T16:05:53.2684762",
"availableStatus": 2,
"hasExistingConversation": false,
"lastConversationDate": null,
"skills": []
}
],
"totalUsers": 5,
"totalHelpers": 4,
"currentPage": 1,
"pageSize": 20,
"totalPages": 1,
"hasNextPage": false,
"hasPreviousPage": false
},
"timestamp": "2025-07-22T03:17:44.2027827Z",
"requestId": "0HNE8OUNSRR8F:00000002"
}
