Get url:{{baseURL}}/api/Payment/GetPayment?userId=1&bookingId=4
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "paymentId": 2,
        "bookingId": 4,
        "userId": 1,
        "helperId": 20,
        "amount": 20.00,
        "paymentDate": "2025-07-22T06:43:14.82"
    },
    "timestamp": "2025-07-26T14:31:17.0081464Z",
    "requestId": "0HNEBTK6O48UA:00000001"
}

Put url:{{baseURL}}/api/Payment/UpdatePayment
request:
{
    "paymentId" : 3,
    "action" : "Success"
}
{
    "paymentId" : 3,
    "action" : "Cancelled"
}
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "paymentId": 3,
        "bookingId": 5,
        "userId": 1,
        "amount": 20.00,
        "paymentMethod": "None",
        "transactionId": null,
        "paymentStatus": "Success",
        "paymentDate": "0001-01-01T00:00:00",
        "paymentGatewayResponse": null,
        "booking": null,
        "user": null
    },
    "timestamp": "2025-07-26T14:46:09.9059567Z",
    "requestId": "0HNEBTK6O48UD:00000001"
}

Put {{baseURL}}/api/Helper/addMoneyToWallet
request
{
    "helperId" : 20,
    "amount" : 100000
}
response
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "isSuccess": true,
        "message": "Money added successfully"
    },
    "timestamp": "2025-07-26T14:57:57.6004577Z",
    "requestId": "0HNEBTK6O48UE:00000001"
}