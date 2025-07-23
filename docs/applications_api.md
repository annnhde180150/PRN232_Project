GET /api/admin/helpers/applications?status=pending&page=1&pageSize=20

note:  validStatuses = { "pending", "approved", "rejected", "revision_requested" };

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"applications": [
{
"helperId": 1,
"fullName": "Charlie Chaplin",
"email": "helper1@example.com",
"phoneNumber": "0123456789",
"registrationDate": "2025-06-20T16:33:01.8533333",
"approvalStatus": "Approved",
"documentCount": 1,
"skillCount": 2,
"workAreaCount": 2,
"primaryService": "House Cleaning"
},
{
"helperId": 2,
"fullName": "Diana Prince",
"email": "helper2@example.com",
"phoneNumber": "0987654322",
"registrationDate": "2025-06-20T16:33:01.8533333",
"approvalStatus": "Approved",
"documentCount": 1,
"skillCount": 2,
"workAreaCount": 1,
"primaryService": "Babysitting"
}
],
"pagination": {
"page": 1,
"pageSize": 20,
"totalCount": 2,
"totalPages": 1,
"hasNext": false,
"hasPrevious": false
}
},
"timestamp": "2025-07-14T04:19:14.1649355Z",
"requestId": "0HNE2HEV1J707:00000001"
}

GET /api/admin/helpers/applications/1

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"helperId": 1,
"phoneNumber": "0123456789",
"email": "helper1@example.com",
"fullName": "Charlie Chaplin",
"profilePictureUrl": "https://example.com/profiles/charlie.jpg",
"bio": "Experienced cleaner and handyman.",
"dateOfBirth": "1990-05-15",
"gender": "Male",
"registrationDate": "2025-06-20T16:33:01.8533333",
"approvalStatus": "Approved",
"approvedByAdminId": 1,
"approvalDate": "2025-06-20T16:33:01.8533333",
"isActive": true,
"documents": [
{
"documentId": 1,
"documentType": "ID Card",
"documentUrl": "https://example.com/docs/charlie_id.pdf",
"uploadDate": "2025-06-20T16:33:01.8633333",
"verificationStatus": "Verified",
"verifiedByAdminId": 1,
"verificationDate": "2025-06-20T16:33:01.8633333",
"notes": "ID verified successfully."
}
],
"skills": [
{
"helperSkillId": 1,
"serviceId": 1,
"yearsOfExperience": 5,
"isPrimarySkill": true
},
{
"helperSkillId": 2,
"serviceId": 2,
"yearsOfExperience": 3,
"isPrimarySkill": false
}
],
"workAreas": [
{
"workAreaId": 1,
"city": "Da Nang",
"district": "Son Tra",
"ward": "Phuoc My",
"latitude": 16.0754000,
"longitude": 108.2241000,
"radiusKm": 5.00
},
{
"workAreaId": 2,
"city": "Da Nang",
"district": "Ngu Hanh Son",
"ward": null,
"latitude": 16.0370000,
"longitude": 108.2400000,
"radiusKm": 10.00
}
],
"totalDocuments": 1,
"verifiedDocuments": 1,
"pendingDocuments": 0
},
"timestamp": "2025-07-14T04:16:33.2611197Z",
"requestId": "0HNE2HEV1J705:00000002"
}


curl --location 'https://localhost:7192/api/admin/helpers/applications/1/decision' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc1MjQ3MDkwNiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE5MiIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcwMDUifQ.dMdfKU-7z93DV6mgw-DS1SyJZ25DgbD3wJTME_zMSMU' \
--data '{
"status": "rejected",
"comment": "magna"
}'

response:
{
"success": true,
"statusCode": 200,
"message": "Thành công",
"data": {
"message": "Helper application rejected successfully"
},
"timestamp": "2025-07-14T04:58:00.6954596Z",
"requestId": "0HNE2HO0ALIQ8:00000004"
}