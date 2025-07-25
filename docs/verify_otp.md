/api/Authentication/verify-otp POST


request:

{
  "email": "minhdqde180271@fpt.edu.vn",
  "otpCode": "123456"
}


response:

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "message": "OTP verified successfully. Your account is now active."
  },
  "timestamp": "2025-07-23T09:55:30.4430341Z",
  "requestId": "0HNE9PQOEJN2P:00000005"
}