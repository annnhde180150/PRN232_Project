{{baseUrl}}/api/Report/admin/business-overview GET

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"totalUsers": 7,
"totalHelpers": 10,
"totalBookings": 11,
"activeBookings": 2,
"completedBookings": 2,
"cancelledBookings": 2,
"totalRevenue": 300020.00,
"averageRating": 5,
"totalServices": 7,
"totalReviews": 1,
"lastUpdated": "2025-07-23T02:27:24.7854372Z",
"growthMetrics": {
"userGrowthRate": 100,
"helperGrowthRate": 0,
"bookingGrowthRate": 100,
"revenueGrowthRate": 100,
"growthPeriod": "Month"
}
},
"timestamp": "2025-07-23T02:27:24.7873169Z",
"requestId": "0HNE9H1TTOULU:00000003"
}

{{baseUrl}}/api/Report/admin/revenue-analytics?period=month GET

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"totalRevenue": 0,
"netRevenue": 0.0,
"platformFees": 0.0,
"helperEarnings": 0.0,
"averageTransactionValue": 0,
"totalTransactions": 8,
"successfulPayments": 0,
"failedPayments": 0,
"paymentSuccessRate": 0,
"monthlyTrend": [
{
"year": 2025,
"month": 6,
"monthName": "June",
"revenue": 0,
"platformFees": 0.0,
"helperEarnings": 0.0,
"transactionCount": 0,
"growthRate": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"revenue": 0,
"platformFees": 0.0,
"helperEarnings": 0.0,
"transactionCount": 0,
"growthRate": 0
}
],
"paymentMethods": [],
"revenueByService": [],
"analyticsPeriodStart": "2025-06-23T02:28:13.3025428Z",
"analyticsPeriodEnd": "2025-07-23T02:28:13.3025428Z"
},
"timestamp": "2025-07-23T02:28:13.4055467Z",
"requestId": "0HNE9H1TTOULU:00000005"
}


{{baseUrl}}/api/Report/admin/service-performance?period=month GET

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": [
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalRevenue": 20.00,
"averageRating": 0,
"marketShare": 16.666666666666666666666666670
},
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalRevenue": 0,
"averageRating": 0,
"marketShare": 16.666666666666666666666666670
},
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalRevenue": 0,
"averageRating": 0,
"marketShare": 16.666666666666666666666666670
},
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalRevenue": 0,
"averageRating": 0,
"marketShare": 16.666666666666666666666666670
},
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalRevenue": 0,
"averageRating": 0,
"marketShare": 16.666666666666666666666666670
},
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalRevenue": 0,
"averageRating": 0,
"marketShare": 16.666666666666666666666666670
}
],
"timestamp": "2025-07-23T02:33:35.3340743Z",
"requestId": "0HNE9H1TTOULV:00000005"
}

{{baseUrl}}/api/Report/admin/helper-rankings?count=10&period=month GET
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": [
{
"helperId": 8,
"helperName": "Helper4",
"email": "helper1@gmail.com",
"totalBookings": 5,
"completedBookings": 1,
"cancelledBookings": 0,
"completionRate": 20.0,
"averageRating": 5,
"totalReviews": 1,
"totalEarnings": 20.00,
"averageBookingValue": 20.00,
"averageResponseTime": 0,
"totalHoursWorked": 0.00,
"earningsTrend": [
{
"year": 2025,
"month": 6,
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 20.00,
"bookingsCount": 1
}
],
"serviceBreakdown": [
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 5,
"totalEarnings": 20.00,
"averageRating": 0,
"completionRate": 20.0
}
],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.9804949Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.9804949Z"
},
{
"helperId": 1,
"helperName": "Minhaza",
"email": "minh@gmail.com",
"totalBookings": 1,
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 1,
"totalEarnings": 0,
"averageRating": 0,
"completionRate": 0
}
],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.9482004Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.9482004Z"
},
{
"helperId": 3,
"helperName": "Nguyen Van Danh",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.960435Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.960435Z"
},
{
"helperId": 6,
"helperName": "Helper2",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.9688976Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.9688976Z"
},
{
"helperId": 7,
"helperName": "Helper3",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.9744082Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.9744082Z"
},
{
"helperId": 9,
"helperName": "Helper5",
"email": "helper2@gmail.com",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.9904333Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.9904333Z"
},
{
"helperId": 11,
"helperName": "Helper6",
"email": "helper3@gmail.com",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:06.996195Z",
"analyticsPeriodEnd": "2025-07-23T02:34:06.996195Z"
},
{
"helperId": 12,
"helperName": "Helper7",
"email": "helper4@gmail.com",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:07.0025507Z",
"analyticsPeriodEnd": "2025-07-23T02:34:07.0025507Z"
},
{
"helperId": 13,
"helperName": "Helper8",
"email": "helper5@gmail.com",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:07.0083434Z",
"analyticsPeriodEnd": "2025-07-23T02:34:07.0083434Z"
},
{
"helperId": 14,
"helperName": "Real Helper",
"email": "realhelper@gmail.com",
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
"monthName": "June",
"earnings": 0,
"bookingsCount": 0
},
{
"year": 2025,
"month": 7,
"monthName": "July",
"earnings": 0,
"bookingsCount": 0
}
],
"serviceBreakdown": [],
"bookingTrend": [],
"analyticsPeriodStart": "2025-06-23T02:34:07.01814Z",
"analyticsPeriodEnd": "2025-07-23T02:34:07.01814Z"
}
],
"timestamp": "2025-07-23T02:34:07.0278823Z",
"requestId": "0HNE9H1TTOULV:00000007"
}

{{baseUrl}}/api/Report/admin/booking-analytics?serviceId=1&period=month GET
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"totalBookings": 6,
"pendingBookings": 4,
"confirmedBookings": 0,
"inProgressBookings": 1,
"completedBookings": 1,
"cancelledBookings": 0,
"averageBookingValue": 100.00,
"totalBookingValue": 100.00,
"completionRate": 16.666666666666666666666666670,
"cancellationRate": 0,
"bookingTrend": [],
"popularServices": [
{
"serviceId": 1,
"serviceName": "Cleaning",
"bookingsCount": 6,
"totalRevenue": 20.00,
"averageRating": 0,
"marketShare": 100
}
],
"peakHours": [
{
"hour": 0,
"timeRange": "00:00 - 01:00",
"bookingsCount": 5,
"percentage": 83.33333333333333333333333333
},
{
"hour": 17,
"timeRange": "17:00 - 18:00",
"bookingsCount": 1,
"percentage": 16.666666666666666666666666670
}
],
"statusBreakdown": [],
"analyticsPeriodStart": "2025-06-23T02:34:35.1219819Z",
"analyticsPeriodEnd": "2025-07-23T02:34:35.1219819Z"
},
"timestamp": "2025-07-23T02:34:35.1533896Z",
"requestId": "0HNE9H1TTOULV:00000008"
}

