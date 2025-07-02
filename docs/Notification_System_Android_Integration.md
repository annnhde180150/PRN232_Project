# Hệ Thống Thông Báo - Tài Liệu Tích Hợp Android

## Tổng Quan

Hệ thống thông báo của HomeHelperFinder API cung cấp hai phương thức chính:
1. **REST API**: Quản lý thông báo (CRUD operations)
2. **SignalR Hub**: Thông báo real-time

## Kiến Trúc Hệ Thống

```
Android App ←→ REST API (HTTP/HTTPS)
     ↓
SignalR Client ←→ NotificationHub (WebSocket)
```

## 1. REST API Endpoints

### Base URL
```
https://your-api-domain.com/api/notification
```

### 1.1 Lấy Tất Cả Thông Báo
```http
GET /api/notification
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách thông báo thành công",
  "data": [
    {
      "notificationId": 1,
      "recipientUserId": 123,
      "recipientHelperId": null,
      "title": "Booking Confirmed",
      "message": "Your booking has been confirmed",
      "notificationType": "BOOKING",
      "referenceId": "booking_456",
      "isRead": false,
      "readTime": null,
      "creationTime": "2024-01-15T10:30:00Z",
      "sentTime": "2024-01-15T10:30:05Z"
    }
  ]
}
```

### 1.2 Lấy Thông Báo Theo ID
```http
GET /api/notification/{id}
```

### 1.3 Tạo Thông Báo Mới
```http
POST /api/notification
Content-Type: application/json

{
  "recipientUserId": 123,
  "recipientHelperId": null,
  "title": "New Message",
  "message": "You have received a new message",
  "notificationType": "MESSAGE",
  "referenceId": "msg_789"
}
```

### 1.4 Cập Nhật Thông Báo
```http
PUT /api/notification/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "message": "Updated message",
  "notificationType": "UPDATED"
}
```

### 1.5 Xóa Thông Báo
```http
DELETE /api/notification/{id}
```

### 1.6 Lấy Thông Báo Theo User ID
```http
GET /api/notification/user/{userId}
```

### 1.7 Lấy Thông Báo Theo Helper ID
```http
GET /api/notification/helper/{helperId}
```

### 1.8 Lấy Thông Báo Chưa Đọc (User)
```http
GET /api/notification/user/{userId}/unread
```

### 1.9 Lấy Thông Báo Chưa Đọc (Helper)
```http
GET /api/notification/helper/{helperId}/unread
```

### 1.10 Đếm Thông Báo Chưa Đọc (User)
```http
GET /api/notification/user/{userId}/unread-count
```

**Response:**
```json
{
  "success": true,
  "data": 5
}
```

### 1.11 Đếm Thông Báo Chưa Đọc (Helper)
```http
GET /api/notification/helper/{helperId}/unread-count
```

### 1.12 Đánh Dấu Đã Đọc
```http
PATCH /api/notification/{id}/mark-read
```

### 1.13 Đánh Dấu Tất Cả Đã Đọc (User)
```http
PATCH /api/notification/user/{userId}/mark-all-read
```

### 1.14 Đánh Dấu Tất Cả Đã Đọc (Helper)
```http
PATCH /api/notification/helper/{helperId}/mark-all-read
```

## 2. Data Models

### 2.1 NotificationDetailsDto
```kotlin
data class NotificationDetailsDto(
    val notificationId: Long,
    val recipientUserId: Int?,
    val recipientHelperId: Int?,
    val title: String,
    val message: String,
    val notificationType: String?,
    val referenceId: String?,
    val isRead: Boolean?,
    val readTime: String?,
    val creationTime: String?,
    val sentTime: String?
)
```

### 2.2 NotificationCreateDto
```kotlin
data class NotificationCreateDto(
    val recipientUserId: Int?,
    val recipientHelperId: Int?,
    val title: String,
    val message: String,
    val notificationType: String?,
    val referenceId: String?
)
```

### 2.3 NotificationUpdateDto
```kotlin
data class NotificationUpdateDto(
    val title: String,
    val message: String,
    val notificationType: String?
)
```

## 3. SignalR Real-time Integration

### 3.1 Connection Setup

**Dependencies (build.gradle):**
```gradle
implementation 'com.microsoft.signalr:signalr:7.0.0'
implementation 'io.reactivex.rxjava3:rxjava:3.1.5'
```

**Kotlin Code:**
```kotlin
class NotificationSignalRClient {
    private var hubConnection: HubConnection? = null
    private val baseUrl = "https://your-api-domain.com"
    
    fun connect(authToken: String) {
        hubConnection = HubConnectionBuilder.create("$baseUrl/notificationHub")
            .withAccessTokenProvider(Single.fromCallable { authToken })
            .build()
            
        // Handle connection events
        hubConnection?.onClosed { error ->
            Log.e("SignalR", "Connection closed: ${error?.message}")
        }
        
        // Handle incoming notifications
        hubConnection?.on("ReceiveNotification", 
            { notification: NotificationDetailsDto ->
                handleNotification(notification)
            }, NotificationDetailsDto::class.java)
            
        // Handle user status changes
        hubConnection?.on("UserStatusChanged",
            { status: UserStatusDto ->
                handleUserStatusChange(status)
            }, UserStatusDto::class.java)
            
        // Start connection
        hubConnection?.start()?.blockingAwait()
    }
    
    private fun handleNotification(notification: NotificationDetailsDto) {
        // Process incoming notification
        // Update UI, show notification, etc.
    }
    
    private fun handleUserStatusChange(status: UserStatusDto) {
        // Handle user online/offline status
    }
    
    fun disconnect() {
        hubConnection?.stop()
    }
}
```

### 3.2 Authentication

SignalR connection yêu cầu JWT token trong header:
```kotlin
.withAccessTokenProvider(Single.fromCallable { 
    "Bearer $jwtToken" 
})
```

### 3.3 SignalR Events

#### Incoming Events:
- `ReceiveNotification`: Nhận thông báo mới
- `UserStatusChanged`: Thay đổi trạng thái online/offline
- `Connected`: Kết nối thành công
- `Error`: Lỗi kết nối

#### Outgoing Methods:
- `SendNotificationToUser`: Gửi thông báo đến user cụ thể
- `JoinConversation`: Tham gia conversation room

## 4. Android Implementation Guide

### 4.1 Notification Service Class
```kotlin
class NotificationService {
    private val apiService: NotificationApiService
    private val signalRClient: NotificationSignalRClient
    
    suspend fun getUnreadNotifications(userId: Int): List<NotificationDetailsDto> {
        return apiService.getUnreadByUserId(userId)
    }
    
    suspend fun markAsRead(notificationId: Long): Boolean {
        return apiService.markAsRead(notificationId)
    }
    
    suspend fun getUnreadCount(userId: Int): Int {
        return apiService.getUnreadCount(userId)
    }
    
    fun connectRealtime(authToken: String) {
        signalRClient.connect(authToken)
    }
    
    fun disconnectRealtime() {
        signalRClient.disconnect()
    }
}
```

### 4.2 Repository Pattern
```kotlin
class NotificationRepository(
    private val apiService: NotificationApiService,
    private val localDao: NotificationDao
) {
    suspend fun syncNotifications(userId: Int) {
        try {
            val remoteNotifications = apiService.getByUserId(userId)
            localDao.insertAll(remoteNotifications)
        } catch (e: Exception) {
            // Handle sync error
        }
    }
    
    fun getLocalNotifications(): Flow<List<NotificationDetailsDto>> {
        return localDao.getAllNotifications()
    }
}
```

## 5. Error Handling

### 5.1 HTTP Error Codes
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Chưa xác thực
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy thông báo
- `500`: Internal Server Error - Lỗi server

### 5.2 SignalR Error Handling
```kotlin
hubConnection?.onClosed { error ->
    if (error != null) {
        Log.e("SignalR", "Connection error: ${error.message}")
        // Implement reconnection logic
        reconnectWithBackoff()
    }
}

private fun reconnectWithBackoff() {
    // Implement exponential backoff reconnection
}
```

## 6. Best Practices

### 6.1 Performance
- Cache thông báo locally với Room database
- Implement pagination cho danh sách thông báo
- Sử dụng DiffUtil cho RecyclerView updates

### 6.2 User Experience
- Show loading states
- Implement pull-to-refresh
- Badge count cho unread notifications
- Local notifications cho background updates

### 6.3 Security
- Validate JWT token expiry
- Implement token refresh mechanism
- Secure storage cho sensitive data

## 7. Testing

### 7.1 Unit Tests
```kotlin
@Test
fun `test notification marking as read`() = runTest {
    // Mock API response
    coEvery { apiService.markAsRead(1L) } returns true
    
    val result = notificationService.markAsRead(1L)
    
    assertTrue(result)
    coVerify { apiService.markAsRead(1L) }
}
```

### 7.2 Integration Tests
- Test SignalR connection
- Test API endpoints
- Test offline scenarios

## 8. Troubleshooting

### 8.1 Common Issues
1. **SignalR Connection Failed**: Kiểm tra JWT token và network
2. **Notifications Not Received**: Verify user groups và connection status
3. **API 401 Error**: Token expired, cần refresh

### 8.2 Debug Tools
- Enable SignalR logging
- Monitor network requests
- Check server logs

## 9. Notification Types

Hệ thống hỗ trợ các loại thông báo:
- `BOOKING`: Thông báo về booking
- `MESSAGE`: Tin nhắn mới
- `PAYMENT`: Thanh toán
- `SYSTEM`: Thông báo hệ thống
- `REMINDER`: Nhắc nhở

## 10. Sample Integration Code

Xem file `NotificationIntegrationSample.kt` để có ví dụ implementation đầy đủ.
