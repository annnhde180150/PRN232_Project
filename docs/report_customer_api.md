{{baseUrl}}/api/Report/customer/my-bookings?period=month GET

request params: period=[day, week, month, quarter, year]

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"totalBookings": 0,
"pendingBookings": 0,
"confirmedBookings": 0,
"inProgressBookings": 0,
"completedBookings": 0,
"cancelledBookings": 0,
"averageBookingValue": 0,
"totalBookingValue": 0,
"completionRate": 0,
"cancellationRate": 0,
"bookingTrend": [
{
"date": "2025-06-22T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-23T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-24T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-25T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-26T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-27T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-28T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-29T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-06-30T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-01T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-02T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-03T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-04T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-05T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-06T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-07T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-08T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-09T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-10T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-11T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-12T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-13T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-14T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-15T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-16T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-17T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-18T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-19T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-20T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-21T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
},
{
"date": "2025-07-22T00:00:00Z",
"bookingsCount": 0,
"earningsAmount": 0
}
],
"popularServices": [],
"peakHours": [],
"statusBreakdown": [],
"analyticsPeriodStart": "2025-06-22T06:46:38.3271613Z",
"analyticsPeriodEnd": "2025-07-22T06:46:38.3271613Z"
},
"timestamp": "2025-07-22T06:46:38.4556876Z",
"requestId": "0HNE8OUNSRR9M:00000006"
}


{{baseUrl}}/api/Report/customer/my-spending?period=month GET

request params: period=[day, week, month, quarter, year]

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"totalSpent": 0,
"averageSpendingPerBooking": 0,
"paymentMethods": [],
"spendingTrend": [
{
"year": 2025,
"month": 6,
"monthName": "Tháng 6",
"revenue": 0,
"platformFees": 0,
"helperEarnings": 0,
"transactionCount": 0,
"growthRate": 0
},
{
"year": 2025,
"month": 7,
"monthName": "Tháng 7",
"revenue": 0,
"platformFees": 0,
"helperEarnings": 0,
"transactionCount": 0,
"growthRate": 0
}
],
"period": {
"start": "2025-06-22T06:50:23.593118Z",
"end": "2025-07-22T06:50:23.593118Z"
}
},
"timestamp": "2025-07-22T06:50:24.3333347Z",
"requestId": "0HNE8OUNSRR9O:00000002"
}


{{baseUrl}}/api/Report/customer/favorite-helpers GET

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": [
{
"helperId": 1,
"helperName": "123456",
"email": "danhvannguyen001@gmail.com",
"totalBookings": 4,
"completedBookings": 0,
"cancelledBookings": 0,
"completionRate": 0,
"averageRating": 0,
"totalReviews": 0,
"totalEarnings": 0,
"averageBookingValue": 0,
"averageResponseTime": 0,
"totalHoursWorked": 0.00,
"earningsTrend": [
{
"year": 2025,
"month": 6,
"monthName": "Tháng 6",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "Tháng 7",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 4,
"totalEarnings": 0,
"averageRating": 0,
"completionRate": 0
}
],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-22T06:55:22.9789978Z",
"analyticsPeriodEnd": "2025-07-22T06:55:22.9789978Z"
},
{
"helperId": 3,
"helperName": "nguyen van danh",
"email": "danhvannguyen002@gmail.com",
"totalBookings": 0,
"completedBookings": 0,
"cancelledBookings": 0,
"completionRate": 0,
"averageRating": 0,
"totalReviews": 0,
"totalEarnings": 0,
"averageBookingValue": 0,
"averageResponseTime": 0,
"totalHoursWorked": 0.00,
"earningsTrend": [
{
"year": 2025,
"month": 6,
"monthName": "Tháng 6",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "Tháng 7",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-22T06:55:23.6381773Z",
"analyticsPeriodEnd": "2025-07-22T06:55:23.6381773Z"
},
{
"helperId": 6,
"helperName": "nguyen van helper",
"email": "helper@gmail.com",
"totalBookings": 0,
"completedBookings": 0,
"cancelledBookings": 0,
"completionRate": 0,
"averageRating": 0,
"totalReviews": 0,
"totalEarnings": 0,
"averageBookingValue": 0,
"averageResponseTime": 0,
"totalHoursWorked": 0.00,
"earningsTrend": [
{
"year": 2025,
"month": 6,
"monthName": "Tháng 6",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "Tháng 7",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-22T06:55:23.9305118Z",
"analyticsPeriodEnd": "2025-07-22T06:55:23.9305118Z"
},
{
"helperId": 7,
"helperName": "nguyen van helper",
"email": "danhnvde180668@fpt.edu.vn",
"totalBookings": 0,
"completedBookings": 0,
"cancelledBookings": 0,
"completionRate": 0,
"averageRating": 0,
"totalReviews": 0,
"totalEarnings": 0,
"averageBookingValue": 0,
"averageResponseTime": 0,
"totalHoursWorked": 0.00,
"earningsTrend": [
{
"year": 2025,
"month": 6,
"monthName": "Tháng 6",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "Tháng 7",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-22T06:55:24.2089935Z",
"analyticsPeriodEnd": "2025-07-22T06:55:24.2089935Z"
}
],
"timestamp": "2025-07-22T06:55:24.4910446Z",
"requestId": "0HNE8OUNSRR9S:00000001"
}