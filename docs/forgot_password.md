/api/User/forgot-password POST
{
  "email": "user@example.com"
}

/api/Helper/forgot-password POST
{
  "email": "user@example.com"
}

/api/Admin/forgot-password POST
{
  "email": "user@example.com"
}


/api/User/reset-password POST
{
  "email": "user@gmail.com",
  "otpCode": "966484",
  "newPassword": "123456",
  "confirmPassword": "123456"
}

/api/Helper/reset-password POST
{
  "email": "user@gmail.com",
  "otpCode": "966484",
  "newPassword": "123456",
  "confirmPassword": "123456"
}

/api/Admin/reset-password POST
{
  "email": "user@gmail.com",
  "otpCode": "966484",
  "newPassword": "123456",
  "confirmPassword": "123456"
}
