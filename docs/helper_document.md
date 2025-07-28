/api/AdminHelperDocument/helper/{helperId} GET
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "documentId": 63,
      "documentType": "ID",
      "documentUrl": "https://firebasestorage.googleapis.com/v0/b/homehelperfindersu25.firebasestorage.app/o/uploads%2F1753707030747_photo-1615969046175-161596904618017747411431.jpeg?alt=media&token=db553b7d-5e87-42fe-9f82-06b232770008",
      "uploadDate": "2025-07-28T14:26:36.2695802",
      "verificationStatus": "Pending",
      "verifiedByAdminId": null,
      "verificationDate": null,
      "notes": null
    },
    {
      "documentId": 64,
      "documentType": "CV",
      "documentUrl": "https://firebasestorage.googleapis.com/v0/b/homehelperfindersu25.firebasestorage.app/o/uploads%2F1753707030201_outstanding_10.png?alt=media&token=0c4ec731-8afd-417e-b4d6-f1346503eea1",
      "uploadDate": "2025-07-28T14:26:36.2695812",
      "verificationStatus": "Pending",
      "verifiedByAdminId": null,
      "verificationDate": null,
      "notes": null
    }
  ],
  "timestamp": "2025-07-28T23:13:28.5549148+07:00",
  "requestId": "0HNEDU6GRLIC0:00000001"
}


/api/AdminHelperDocument/{documentId} GET

{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "documentId": 10,
    "documentType": "string",
    "documentUrl": "string",
    "uploadDate": "2025-07-23T04:39:04.0572523",
    "verificationStatus": "Accepted",
    "verifiedByAdminId": 1,
    "verificationDate": "2025-07-23T04:35:26.529",
    "notes": "string"
  },
  "timestamp": "2025-07-28T23:16:41.6950377+07:00",
  "requestId": "0HNEDU6GRLIC2:00000001"
}

/api/AdminHelperDocument/{documentId}/status PUT

{
  "documentId": 0,
  "verificationStatus": "string",
  "verifiedByAdminId": 0,
  "notes": "string"
}