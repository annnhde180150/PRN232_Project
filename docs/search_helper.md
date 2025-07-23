GET {{baseUrl}}/api/Service/active

response
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "serviceId": 1,
      "serviceName": "Cleaning",
      "description": "Clean a house",
      "iconUrl": null,
      "basePrice": 100000,
      "priceUnit": "VND",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 2,
      "serviceName": "Furniture Assembly",
      "description": "Assembly of beds, shelves, tables, and other furniture.",
      "iconUrl": "/icons/furniture.png",
      "basePrice": 180000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 3,
      "serviceName": "Gardening",
      "description": "Lawn mowing, plant trimming, and garden care services.",
      "iconUrl": "/icons/gardening.png",
      "basePrice": 160000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 4,
      "serviceName": "Babysitting",
      "description": "Professional babysitting and childcare service.",
      "iconUrl": "/icons/babysitting.png",
      "basePrice": 220000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 5,
      "serviceName": "Window Cleaning",
      "description": "Cleaning interior and exterior windows of homes.",
      "iconUrl": "/icons/windows.png",
      "basePrice": 200000,
      "priceUnit": "VND/hour",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 6,
      "serviceName": "Packing & Moving",
      "description": "Help with packing and transporting belongings.",
      "iconUrl": "/icons/moving.png",
      "basePrice": 400000,
      "priceUnit": "VND/job",
      "isActive": true,
      "parentServiceId": null
    },
    {
      "serviceId": 7,
      "serviceName": "Repair",
      "description": "Help repair house ",
      "iconUrl": null,
      "basePrice": 1000000,
      "priceUnit": "VND",
      "isActive": true,
      "parentServiceId": null
    }
  ],
  "timestamp": "2025-07-23T16:27:37.4052964Z",
  "requestId": "0HNEA0N40LGAJ:00000001"
}

url GET https://localhost:7192/api/Helper/search?serviceId=1

response
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": [
    {
      "helperId": 1,
      "helperName": "Minhaza",
      "serviceName": "Cleaning",
      "bio": "nothing",
      "rating": 0,
      "helperWorkAreas": [
        {
          "workAreaId": 6,
          "helperId": 1,
          "city": "Đà Nẵng",
          "district": "Hải Châu",
          "ward": "Hải An",
          "latitude": 16.0487652,
          "longitude": 108.2140587,
          "radiusKm": 0,
          "helper": null
        }
      ],
      "basePrice": 100000,
      "availableStatus": "Available"
    },
    {
      "helperId": 7,
      "helperName": "Helper3",
      "serviceName": "Cleaning",
      "bio": "string",
      "rating": 0,
      "helperWorkAreas": [],
      "basePrice": 100000,
      "availableStatus": "Available"
    },
    {
      "helperId": 17,
      "helperName": "danh helper",
      "serviceName": "Cleaning",
      "bio": "string",
      "rating": 0,
      "helperWorkAreas": [
        {
          "workAreaId": 9,
          "helperId": 17,
          "city": "Đà Nẵng",
          "district": "Hải Châu",
          "ward": "Hải An",
          "latitude": 16.0487652,
          "longitude": 108.2140587,
          "radiusKm": 0,
          "helper": null
        }
      ],
      "basePrice": 100000,
      "availableStatus": "Offline"
    }
  ],
  "timestamp": "2025-07-23T16:30:09.4403573Z",
  "requestId": "0HNEA0N40LGAJ:00000003"
}