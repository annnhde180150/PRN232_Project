{{baseUrl}}/api/ProfileManagement/ban POST

request:
{
  "adminId": 1,
  "profileId": 4,
  "profileType": "user",
  "reason": "minim est eu"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "profileId": 4,
        "profileType": "User",
        "fullName": "et tempor culpa",
        "email": "user1@gmail.com",
        "phoneNumber": "0231323123",
        "isActive": false,
        "registrationDate": "2025-07-22T02:52:16.6982601",
        "lastLoginDate": "2025-07-22T16:43:46.6506393"
    },
    "timestamp": "2025-07-23T09:50:14.6004875Z",
    "requestId": "0HNE9H1TTOUPV:00000003"
}

{{baseUrl}}/api/ProfileManagement/unban POST

request: 
{
  "adminId": 1,
  "profileId": 4,
  "profileType": "user",
  "reason": "minim est eu"
}

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "profileId": 4,
        "profileType": "User",
        "fullName": "et tempor culpa",
        "email": "user1@gmail.com",
        "phoneNumber": "0231323123",
        "isActive": true,
        "registrationDate": "2025-07-22T02:52:16.6982601",
        "lastLoginDate": "2025-07-22T16:43:46.6506393"
    },
    "timestamp": "2025-07-23T09:51:12.0010053Z",
    "requestId": "0HNE9H1TTOUPV:00000005"
}

{{baseUrl}}/api/ProfileManagement/status/:profileId/:profileType GET

note: profileType=["Helper" or "User"]
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": {
        "profileId": 1,
        "profileType": "User",
        "fullName": "Minhaza",
        "email": "minhdqde180271@fpt.edu.vn",
        "phoneNumber": "0914159666",
        "isActive": true,
        "registrationDate": "2025-07-19T16:16:38.5341856",
        "lastLoginDate": "2025-07-23T09:31:32.7173956"
    },
    "timestamp": "2025-07-23T09:52:05.1183522Z",
    "requestId": "0HNE9H1TTOUPV:00000008"
}

{{baseUrl}}/api/ProfileManagement/banned GET
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "profileId": 9,
            "profileType": "User",
            "fullName": "CustomerAn",
            "email": "annnhde180150@fpt.edu.vn",
            "phoneNumber": "0774443367",
            "isActive": false,
            "registrationDate": "2025-07-23T06:07:58.5486289",
            "lastLoginDate": null
        },
        {
            "profileId": 10,
            "profileType": "User",
            "fullName": "et tempor culpa",
            "email": "user20@gmail.com",
            "phoneNumber": "0123232123",
            "isActive": false,
            "registrationDate": "2025-07-23T06:39:54.7050552",
            "lastLoginDate": null
        },
        {
            "profileId": 11,
            "profileType": "User",
            "fullName": "Nguyen Gia Phuong Tuan",
            "email": "nguyengiaphuongtuan@gmail.com",
            "phoneNumber": "0375953357",
            "isActive": false,
            "registrationDate": "2025-07-23T08:00:03.5555925",
            "lastLoginDate": null
        },
        {
            "profileId": 12,
            "profileType": "User",
            "fullName": "Dang Quang Minh",
            "email": "dangquangminh1006@fpt.edu.vn",
            "phoneNumber": "0914123456",
            "isActive": false,
            "registrationDate": "2025-07-23T09:39:15.1079903",
            "lastLoginDate": null
        },
        {
            "profileId": 15,
            "profileType": "Helper",
            "fullName": "testRegister",
            "email": "testRegister@gmail.com",
            "phoneNumber": "0914159666",
            "isActive": false,
            "registrationDate": "2025-07-23T04:20:04.3473665",
            "lastLoginDate": null
        },
        {
            "profileId": 16,
            "profileType": "Helper",
            "fullName": "danh helper",
            "email": "danhhelper@gmail.com",
            "phoneNumber": "0919940354",
            "isActive": false,
            "registrationDate": "2025-07-23T04:37:34.8472524",
            "lastLoginDate": null
        },
        {
            "profileId": 18,
            "profileType": "Helper",
            "fullName": "testRegister2",
            "email": "testRegister2@gmail.com",
            "phoneNumber": "0914842567",
            "isActive": false,
            "registrationDate": "2025-07-23T05:31:00.8206563",
            "lastLoginDate": null
        },
        {
            "profileId": 19,
            "profileType": "Helper",
            "fullName": "testRegister3",
            "email": "testRegister3@gmail.com",
            "phoneNumber": "0914842568",
            "isActive": false,
            "registrationDate": "2025-07-23T05:38:27.4992134",
            "lastLoginDate": null
        },
        {
            "profileId": 21,
            "profileType": "Helper",
            "fullName": "John Doe",
            "email": "john.doe@example.com",
            "phoneNumber": "1234567890",
            "isActive": false,
            "registrationDate": "2025-07-23T06:41:15.7016443",
            "lastLoginDate": null
        }
    ],
    "timestamp": "2025-07-23T09:53:25.097366Z",
    "requestId": "0HNE9H1TTOUQ0:00000002"
}


{{baseUrl}}/api/ProfileManagement/active GET
response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "profileId": 1,
            "profileType": "User",
            "fullName": "Minhaza",
            "email": "minhdqde180271@fpt.edu.vn",
            "phoneNumber": "0914159666",
            "isActive": true,
            "registrationDate": "2025-07-19T16:16:38.5341856",
            "lastLoginDate": "2025-07-23T09:31:32.7173956"
        },
        {
            "profileId": 2,
            "profileType": "User",
            "fullName": "nguyen van danh",
            "email": "danhvannguyen000@gmail.com",
            "phoneNumber": "0919940359",
            "isActive": true,
            "registrationDate": "2025-07-20T08:36:31.182458",
            "lastLoginDate": "2025-07-23T06:03:00.4412851"
        },
        {
            "profileId": 3,
            "profileType": "User",
            "fullName": "et tempor culpa",
            "email": "user@gmail.com",
            "phoneNumber": "0123123123",
            "isActive": true,
            "registrationDate": "2025-07-22T02:43:08.7858535",
            "lastLoginDate": "2025-07-23T07:40:50.0585201"
        },
        {
            "profileId": 4,
            "profileType": "User",
            "fullName": "et tempor culpa",
            "email": "user1@gmail.com",
            "phoneNumber": "0231323123",
            "isActive": true,
            "registrationDate": "2025-07-22T02:52:16.6982601",
            "lastLoginDate": "2025-07-22T16:43:46.6506393"
        },
        {
            "profileId": 5,
            "profileType": "User",
            "fullName": "et tempor culpa",
            "email": "user2@gmail.com",
            "phoneNumber": "0231123123",
            "isActive": true,
            "registrationDate": "2025-07-22T03:09:22.3315066",
            "lastLoginDate": null
        },
        {
            "profileId": 6,
            "profileType": "User",
            "fullName": "et tempor culpa",
            "email": "user3@gmail.com",
            "phoneNumber": "0231123523",
            "isActive": true,
            "registrationDate": "2025-07-22T03:09:37.2811852",
            "lastLoginDate": null
        },
        {
            "profileId": 7,
            "profileType": "User",
            "fullName": "Nguyễn Nghĩa  Hải An",
            "email": "haian21122004@gmail.com",
            "phoneNumber": "0774443333",
            "isActive": true,
            "registrationDate": "2025-07-22T16:07:42.4818251",
            "lastLoginDate": "2025-07-23T06:15:17.8416321"
        },
        {
            "profileId": 3,
            "profileType": "Helper",
            "fullName": "Nguyen Van Danh",
            "email": "danhvannguyen002@gmail.com",
            "phoneNumber": "0919940357",
            "isActive": true,
            "registrationDate": "2025-07-20T14:57:26.8296806",
            "lastLoginDate": null
        },
        {
            "profileId": 6,
            "profileType": "Helper",
            "fullName": "Helper2",
            "email": "helper@gmail.com",
            "phoneNumber": "0919940356",
            "isActive": true,
            "registrationDate": "2025-07-21T15:59:00.7807926",
            "lastLoginDate": "2025-07-23T05:54:06.6133292"
        },
        {
            "profileId": 7,
            "profileType": "Helper",
            "fullName": "Helper3",
            "email": "danhnvde180668@fpt.edu.vn",
            "phoneNumber": "0919940355",
            "isActive": true,
            "registrationDate": "2025-07-21T16:02:35.9007702",
            "lastLoginDate": "2025-07-23T06:13:08.7879921"
        },
        {
            "profileId": 9,
            "profileType": "Helper",
            "fullName": "Helper5",
            "email": "helper2@gmail.com",
            "phoneNumber": "0774443466",
            "isActive": true,
            "registrationDate": "2025-07-22T07:00:01.908",
            "lastLoginDate": "2025-07-22T15:27:18.801"
        },
        {
            "profileId": 11,
            "profileType": "Helper",
            "fullName": "Helper6",
            "email": "helper3@gmail.com",
            "phoneNumber": "0774444242",
            "isActive": true,
            "registrationDate": "2025-07-22T07:00:01.908",
            "lastLoginDate": null
        },
        {
            "profileId": 12,
            "profileType": "Helper",
            "fullName": "Helper7",
            "email": "helper4@gmail.com",
            "phoneNumber": "0213124325",
            "isActive": true,
            "registrationDate": "2025-07-22T07:00:01.908",
            "lastLoginDate": null
        },
        {
            "profileId": 13,
            "profileType": "Helper",
            "fullName": "Helper8",
            "email": "helper5@gmail.com",
            "phoneNumber": "0653453461",
            "isActive": true,
            "registrationDate": "2025-07-22T07:00:01.908",
            "lastLoginDate": null
        },
        {
            "profileId": 14,
            "profileType": "Helper",
            "fullName": "Real Helper",
            "email": "realhelper@gmail.com",
            "phoneNumber": "0914159665",
            "isActive": true,
            "registrationDate": "2025-07-22T17:27:11.8898259",
            "lastLoginDate": "2025-07-22T17:30:18.0167724"
        },
        {
            "profileId": 17,
            "profileType": "Helper",
            "fullName": "danh helper",
            "email": "danhhelper2@gmail.com",
            "phoneNumber": "0919940353",
            "isActive": true,
            "registrationDate": "2025-07-23T04:39:04.0197793",
            "lastLoginDate": null
        },
        {
            "profileId": 20,
            "profileType": "Helper",
            "fullName": "Sun Nguyen",
            "email": "helperSun@gmail.com",
            "phoneNumber": "0912345674",
            "isActive": true,
            "registrationDate": "2025-07-23T06:01:11.0136479",
            "lastLoginDate": "2025-07-23T09:37:39.9131594"
        }
    ],
    "timestamp": "2025-07-23T09:54:19.8767577Z",
    "requestId": "0HNE9H1TTOUQ0:00000003"
}

{{baseUrl}}/api/ProfileManagement/banned-status/:profileId/:profileType GET
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": false,
    "timestamp": "2025-07-23T09:55:44.8678456Z",
    "requestId": "0HNE9H1TTOUQ1:00000002"
}


{{baseUrl}}/api/ProfileManagement/bulk-ban POST
request:
[
  {
    "adminId": 1,
    "profileId": 1,
    "profileType": "user",
    "reason": "fugiat in"
  },
  {
    "adminId": 1,
    "profileId": 3,
    "profileType": "Helper",
    "reason": "ad Exc"
  }
]

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "profileId": 1,
            "profileType": "User",
            "fullName": "Minhaza",
            "email": "minhdqde180271@fpt.edu.vn",
            "phoneNumber": "0914159666",
            "isActive": false,
            "registrationDate": "2025-07-19T16:16:38.5341856",
            "lastLoginDate": "2025-07-23T09:31:32.7173956"
        },
        {
            "profileId": 3,
            "profileType": "Helper",
            "fullName": "Nguyen Van Danh",
            "email": "danhvannguyen002@gmail.com",
            "phoneNumber": "0919940357",
            "isActive": false,
            "registrationDate": "2025-07-20T14:57:26.8296806",
            "lastLoginDate": null
        }
    ],
    "timestamp": "2025-07-23T09:58:23.2002578Z",
    "requestId": "0HNE9H1TTOUQ2:00000002"
}


{{baseUrl}}/api/ProfileManagement/bulk-unban POST
request:
[
  {
    "adminId": 1,
    "profileId": 1,
    "profileType": "user",
    "reason": "fugiat in"
  },
  {
    "adminId": 1,
    "profileId": 3,
    "profileType": "Helper",
    "reason": "ad Exc"
  }
]

response:
{
    "success": true,
    "statusCode": 200,
    "message": "Thành công",
    "data": [
        {
            "profileId": 1,
            "profileType": "User",
            "fullName": "Minhaza",
            "email": "minhdqde180271@fpt.edu.vn",
            "phoneNumber": "0914159666",
            "isActive": true,
            "registrationDate": "2025-07-19T16:16:38.5341856",
            "lastLoginDate": "2025-07-23T09:31:32.7173956"
        },
        {
            "profileId": 3,
            "profileType": "Helper",
            "fullName": "Nguyen Van Danh",
            "email": "danhvannguyen002@gmail.com",
            "phoneNumber": "0919940357",
            "isActive": true,
            "registrationDate": "2025-07-20T14:57:26.8296806",
            "lastLoginDate": null
        }
    ],
    "timestamp": "2025-07-23T09:59:08.7523146Z",
    "requestId": "0HNE9H1TTOUQ2:00000003"
}