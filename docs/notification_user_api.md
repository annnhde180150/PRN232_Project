{{baseUrl}}/api/Notification/user/:userId/unread GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "notificationId": 66,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Account Restored",
            "message": "Your account has been restored and is now active. Note: fugiat in",
            "notificationType": "AccountRestoration",
            "referenceId": "User_1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-23T09:59:08.7024258",
            "sentTime": "2025-07-23T09:59:08.7024268"
        },
        {
            "notificationId": 64,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Account Suspended",
            "message": "Your account has been suspended. Reason: fugiat in",
            "notificationType": "AccountSuspension",
            "referenceId": "User_1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-23T09:58:23.1552469",
            "sentTime": "2025-07-23T09:58:23.1552472"
        },
        {
            "notificationId": 35,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been cancelled",
            "message": "Your Booking has been cancelled, please check for more detail",
            "notificationType": "BookingCancelled",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T19:53:45.2432863",
            "sentTime": "2025-07-22T19:53:45.2432866"
        },
        {
            "notificationId": 34,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been updated",
            "message": "An Booking of your has been updated, please check for detail",
            "notificationType": "BookingUpdate",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T19:52:39.6648581",
            "sentTime": "2025-07-22T19:52:39.6648586"
        },
        {
            "notificationId": 33,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been updated",
            "message": "An Booking of your has been updated, please check for detail",
            "notificationType": "BookingUpdate",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T19:46:01.3839121",
            "sentTime": "2025-07-22T19:46:01.3839125"
        },
        {
            "notificationId": 32,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been updated",
            "message": "An Booking of your has been updated, please check for detail",
            "notificationType": "BookingUpdate",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T19:43:21.8612662",
            "sentTime": "2025-07-22T19:43:21.8612885"
        },
        {
            "notificationId": 31,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "new Request",
            "message": "You have a new Request, please check for detail",
            "notificationType": "NewBooking",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T18:16:55.8856233",
            "sentTime": "2025-07-22T18:16:55.8856619"
        },
        {
            "notificationId": 25,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Password Changed",
            "message": "Your password has been successfully changed. If you didn't make this change, please contact support immediately.",
            "notificationType": "PasswordChange",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T12:23:17.2417264",
            "sentTime": "2025-07-22T12:23:17.241727"
        },
        {
            "notificationId": 24,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Password Changed",
            "message": "Your password has been successfully changed. If you didn't make this change, please contact support immediately.",
            "notificationType": "PasswordChange",
            "referenceId": "1",
            "isRead": false,
            "readTime": null,
            "creationTime": "2025-07-22T12:22:11.4910547",
            "sentTime": "2025-07-22T12:22:11.4913755"
        }
    ],
    "timestamp": "2025-07-24T13:17:22.4221698Z",
    "requestId": "0HNE9H1TTOUR8:00000001"
}

{{baseUrl}}/api/Notification/user/:userId/unread-count GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": 9,
    "timestamp": "2025-07-24T13:18:08.3736532Z",
    "requestId": "0HNE9H1TTOUR8:00000002"
}

{{baseUrl}}/api/Notification/user/:userId/mark-all-read PATCH
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": "All notifications for user 1 have been marked as read.",
    "timestamp": "2025-07-24T13:18:28.153872Z",
    "requestId": "0HNE9H1TTOUR8:00000003"
}

{{baseUrl}}/api/Notification/user/:userId GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "notificationId": 66,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Account Restored",
            "message": "Your account has been restored and is now active. Note: fugiat in",
            "notificationType": "AccountRestoration",
            "referenceId": "User_1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707338",
            "creationTime": "2025-07-23T09:59:08.7024258",
            "sentTime": "2025-07-23T09:59:08.7024268"
        },
        {
            "notificationId": 64,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Account Suspended",
            "message": "Your account has been suspended. Reason: fugiat in",
            "notificationType": "AccountSuspension",
            "referenceId": "User_1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707338",
            "creationTime": "2025-07-23T09:58:23.1552469",
            "sentTime": "2025-07-23T09:58:23.1552472"
        },
        {
            "notificationId": 35,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been cancelled",
            "message": "Your Booking has been cancelled, please check for more detail",
            "notificationType": "BookingCancelled",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707337",
            "creationTime": "2025-07-22T19:53:45.2432863",
            "sentTime": "2025-07-22T19:53:45.2432866"
        },
        {
            "notificationId": 34,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been updated",
            "message": "An Booking of your has been updated, please check for detail",
            "notificationType": "BookingUpdate",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707335",
            "creationTime": "2025-07-22T19:52:39.6648581",
            "sentTime": "2025-07-22T19:52:39.6648586"
        },
        {
            "notificationId": 33,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been updated",
            "message": "An Booking of your has been updated, please check for detail",
            "notificationType": "BookingUpdate",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707334",
            "creationTime": "2025-07-22T19:46:01.3839121",
            "sentTime": "2025-07-22T19:46:01.3839125"
        },
        {
            "notificationId": 32,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "An Booking has been updated",
            "message": "An Booking of your has been updated, please check for detail",
            "notificationType": "BookingUpdate",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707333",
            "creationTime": "2025-07-22T19:43:21.8612662",
            "sentTime": "2025-07-22T19:43:21.8612885"
        },
        {
            "notificationId": 31,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "new Request",
            "message": "You have a new Request, please check for detail",
            "notificationType": "NewBooking",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707331",
            "creationTime": "2025-07-22T18:16:55.8856233",
            "sentTime": "2025-07-22T18:16:55.8856619"
        },
        {
            "notificationId": 25,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Password Changed",
            "message": "Your password has been successfully changed. If you didn't make this change, please contact support immediately.",
            "notificationType": "PasswordChange",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9707329",
            "creationTime": "2025-07-22T12:23:17.2417264",
            "sentTime": "2025-07-22T12:23:17.241727"
        },
        {
            "notificationId": 24,
            "recipientUserId": 1,
            "recipientHelperId": null,
            "title": "Password Changed",
            "message": "Your password has been successfully changed. If you didn't make this change, please contact support immediately.",
            "notificationType": "PasswordChange",
            "referenceId": "1",
            "isRead": true,
            "readTime": "2025-07-24T13:18:27.9703349",
            "creationTime": "2025-07-22T12:22:11.4910547",
            "sentTime": "2025-07-22T12:22:11.4913755"
        }
    ],
    "timestamp": "2025-07-24T13:18:53.8042455Z",
    "requestId": "0HNE9H1TTOUR8:00000004"
}