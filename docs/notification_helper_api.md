{{baseUrl}}/api/Notification/helper/:helperId/unread GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "notificationId": 42,
            "recipientUserId": null,
            "recipientHelperId": 1,
            "title": "Profile Updated",
            "message": "Your helper profile has been successfully updated.",
            "notificationType": "ProfileUpdate",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-23T04:16:57.723336",
            "sentTime": "2025-07-23T04:16:57.7233368"
        },
        {
            "notificationId": 2,
            "recipientUserId": null,
            "recipientHelperId": 1,
            "title": "Application Approved",
            "message": "Congratulations! Your helper application has been approved. You can now start accepting bookings.",
            "notificationType": "ApplicationStatus",
            "referenceId": null,
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-21T15:56:59.0990048",
            "sentTime": "2025-07-21T15:56:59.0990052"
        }
    ],
    "timestamp": "2025-07-24T13:19:50.6636878Z",
    "requestId": "0HNE9H1TTOUR8:00000005"
}

{{baseUrl}}/api/Notification/helper/:helperId/unread-count
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": 0,
    "timestamp": "2025-07-24T13:20:33.9665288Z",
    "requestId": "0HNE9H1TTOUR8:00000006"
}

{{baseUrl}}/api/Notification/helper/:helperId/mark-all-read PATCH
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": "All notifications for helper 1 have been marked as read.",
    "timestamp": "2025-07-24T13:20:58.5925825Z",
    "requestId": "0HNE9H1TTOUR8:00000007"
}

{{baseUrl}}/api/Notification/helper/:helperId GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "notificationId": 42,
            "recipientUserId": null,
            "recipientHelperId": 1,
            "title": "Profile Updated",
            "message": "Your helper profile has been successfully updated.",
            "notificationType": "ProfileUpdate",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:20:58.5590153",
            "creationTime": "2025-07-23T04:16:57.723336",
            "sentTime": "2025-07-23T04:16:57.7233368"
        },
        {
            "notificationId": 2,
            "recipientUserId": null,
            "recipientHelperId": 1,
            "title": "Application Approved",
            "message": "Congratulations! Your helper application has been approved. You can now start accepting bookings.",
            "notificationType": "ApplicationStatus",
            "referenceId": null,
            "isRead": true,
            "readTime": "2025-07-24T13:20:58.5590144",
            "creationTime": "2025-07-21T15:56:59.0990048",
            "sentTime": "2025-07-21T15:56:59.0990052"
        }
    ],
    "timestamp": "2025-07-24T13:21:28.6429459Z",
    "requestId": "0HNE9H1TTOUR8:00000008"
}