# Notification Types and Flows - HomeHelperFinder System

## 1. Notification Types Overview

Hệ thống hỗ trợ các loại thông báo sau:

### 1.1 Core Notification Types
- **BOOKING**: Thông báo liên quan đến đặt lịch dịch vụ
- **MESSAGE**: Tin nhắn mới trong chat
- **PAYMENT**: Thông báo thanh toán
- **SYSTEM**: Thông báo hệ thống
- **REMINDER**: Nhắc nhở
- **STATUS_UPDATE**: Cập nhật trạng thái
- **REVIEW**: Đánh giá và phản hồi

### 1.2 User-Specific Notifications
Thông báo dành cho **Users** (khách hàng):
- Helper đã chấp nhận booking
- Helper đã từ chối booking
- Helper đã hoàn thành dịch vụ
- Yêu cầu thanh toán
- Tin nhắn mới từ Helper
- Nhắc nhở về lịch hẹn sắp tới
- Yêu cầu đánh giá dịch vụ

### 1.3 Helper-Specific Notifications
Thông báo dành cho **Helpers** (người cung cấp dịch vụ):
- Yêu cầu booking mới
- User đã hủy booking
- Thanh toán đã được xác nhận
- Tin nhắn mới từ User
- Đánh giá mới từ User
- Cập nhật profile được duyệt/từ chối

## 2. Notification Flow Architecture

```
[Event Trigger] → [Business Logic] → [Create Notification] → [Save to DB] → [Send Real-time]
                                                                    ↓
[Android App] ← [SignalR Hub] ← [SignalR Service] ← [Notification Service]
```

### 2.1 Detailed Flow

1. **Event Trigger**: Một sự kiện xảy ra trong hệ thống (booking created, message sent, etc.)
2. **Business Logic**: Service layer xử lý logic nghiệp vụ
3. **Create Notification**: Tạo notification record
4. **Save to Database**: Lưu vào bảng Notifications
5. **Send Real-time**: Gửi qua SignalR nếu user online
6. **Android Receives**: App nhận notification và hiển thị

## 3. Notification Data Structure

### 3.1 Database Schema
```sql
CREATE TABLE Notifications (
    NotificationId BIGINT PRIMARY KEY IDENTITY,
    RecipientUserId INT NULL,
    RecipientHelperId INT NULL,
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    NotificationType NVARCHAR(50) NULL,
    ReferenceId NVARCHAR(100) NULL,
    IsRead BIT NULL DEFAULT 0,
    ReadTime DATETIME2 NULL,
    CreationTime DATETIME2 NULL DEFAULT GETUTCDATE(),
    SentTime DATETIME2 NULL,
    
    FOREIGN KEY (RecipientUserId) REFERENCES Users(UserId),
    FOREIGN KEY (RecipientHelperId) REFERENCES Helpers(HelperId)
);
```

### 3.2 JSON Structure (API Response)
```json
{
  "notificationId": 12345,
  "recipientUserId": 123,
  "recipientHelperId": null,
  "title": "Booking Confirmed",
  "message": "Your booking for house cleaning has been confirmed by Helper John Doe",
  "notificationType": "BOOKING",
  "referenceId": "booking_789",
  "isRead": false,
  "readTime": null,
  "creationTime": "2024-01-15T10:30:00Z",
  "sentTime": "2024-01-15T10:30:05Z"
}
```

## 4. Notification Scenarios

### 4.1 Booking Flow Notifications

#### For Users:
1. **Booking Submitted**
   ```json
   {
     "title": "Booking Submitted",
     "message": "Your booking request has been submitted and is waiting for helper confirmation",
     "notificationType": "BOOKING",
     "referenceId": "booking_123"
   }
   ```

2. **Booking Accepted**
   ```json
   {
     "title": "Booking Confirmed",
     "message": "Helper John Doe has accepted your booking for house cleaning on Jan 20, 2024",
     "notificationType": "BOOKING",
     "referenceId": "booking_123"
   }
   ```

3. **Booking Rejected**
   ```json
   {
     "title": "Booking Declined",
     "message": "Unfortunately, Helper John Doe cannot accept your booking. Please try another helper",
     "notificationType": "BOOKING",
     "referenceId": "booking_123"
   }
   ```

#### For Helpers:
1. **New Booking Request**
   ```json
   {
     "title": "New Booking Request",
     "message": "You have a new booking request for house cleaning from Jane Smith",
     "notificationType": "BOOKING",
     "referenceId": "booking_123"
   }
   ```

2. **Booking Cancelled**
   ```json
   {
     "title": "Booking Cancelled",
     "message": "Jane Smith has cancelled the booking scheduled for Jan 20, 2024",
     "notificationType": "BOOKING",
     "referenceId": "booking_123"
   }
   ```

### 4.2 Message Flow Notifications

```json
{
  "title": "New Message",
  "message": "You have a new message from John Doe",
  "notificationType": "MESSAGE",
  "referenceId": "chat_456"
}
```

### 4.3 Payment Flow Notifications

#### For Users:
```json
{
  "title": "Payment Required",
  "message": "Please complete payment for your completed service with Helper John Doe",
  "notificationType": "PAYMENT",
  "referenceId": "payment_789"
}
```

#### For Helpers:
```json
{
  "title": "Payment Received",
  "message": "You have received payment of $50 from Jane Smith",
  "notificationType": "PAYMENT",
  "referenceId": "payment_789"
}
```

## 5. SignalR Real-time Events

### 5.1 Connection Events
- `Connected`: Kết nối thành công
- `Error`: Lỗi kết nối
- `UserStatusChanged`: Thay đổi trạng thái online/offline

### 5.2 Notification Events
- `ReceiveNotification`: Nhận thông báo mới
- `NotificationRead`: Thông báo đã được đọc
- `NotificationDeleted`: Thông báo đã bị xóa

### 5.3 Chat Events (Related)
- `ReceiveChatMessage`: Nhận tin nhắn chat
- `MessagesMarkedAsRead`: Tin nhắn đã được đọc

## 6. Android Implementation Patterns

### 6.1 Notification Handling Strategy

```kotlin
class NotificationHandler {
    fun handleIncomingNotification(notification: NotificationDetailsDto) {
        when (notification.notificationType) {
            "BOOKING" -> handleBookingNotification(notification)
            "MESSAGE" -> handleMessageNotification(notification)
            "PAYMENT" -> handlePaymentNotification(notification)
            "SYSTEM" -> handleSystemNotification(notification)
            else -> handleGenericNotification(notification)
        }
    }
    
    private fun handleBookingNotification(notification: NotificationDetailsDto) {
        // Show booking-specific UI
        // Update booking status in local DB
        // Show appropriate notification icon/sound
    }
    
    private fun handleMessageNotification(notification: NotificationDetailsDto) {
        // Update chat UI if chat screen is open
        // Show message notification
        // Update unread message count
    }
}
```

### 6.2 Notification Priority Mapping

```kotlin
fun getNotificationPriority(type: String?): Int {
    return when (type?.uppercase()) {
        "MESSAGE" -> NotificationCompat.PRIORITY_HIGH
        "BOOKING" -> NotificationCompat.PRIORITY_HIGH
        "PAYMENT" -> NotificationCompat.PRIORITY_HIGH
        "REMINDER" -> NotificationCompat.PRIORITY_DEFAULT
        "SYSTEM" -> NotificationCompat.PRIORITY_LOW
        else -> NotificationCompat.PRIORITY_DEFAULT
    }
}
```

### 6.3 Deep Linking Strategy

```kotlin
fun createDeepLinkIntent(notification: NotificationDetailsDto): Intent {
    return when (notification.notificationType) {
        "BOOKING" -> Intent(context, BookingDetailActivity::class.java).apply {
            putExtra("booking_id", notification.referenceId)
        }
        "MESSAGE" -> Intent(context, ChatActivity::class.java).apply {
            putExtra("chat_id", notification.referenceId)
        }
        "PAYMENT" -> Intent(context, PaymentActivity::class.java).apply {
            putExtra("payment_id", notification.referenceId)
        }
        else -> Intent(context, MainActivity::class.java).apply {
            putExtra("notification_id", notification.notificationId)
        }
    }
}
```

## 7. Error Handling and Retry Logic

### 7.1 Network Error Handling
```kotlin
class NotificationRepository {
    suspend fun syncNotifications(userId: Int, retryCount: Int = 3): Result<List<NotificationDetailsDto>> {
        repeat(retryCount) { attempt ->
            try {
                val result = apiService.getByUserId(userId)
                if (result.isSuccessful) {
                    return Result.success(result.body()?.data ?: emptyList())
                }
            } catch (e: Exception) {
                if (attempt == retryCount - 1) {
                    return Result.failure(e)
                }
                delay(1000 * (attempt + 1)) // Exponential backoff
            }
        }
        return Result.failure(Exception("Max retry attempts reached"))
    }
}
```

### 7.2 SignalR Reconnection Logic
```kotlin
class SignalRReconnectionManager {
    private var reconnectAttempts = 0
    private val maxReconnectAttempts = 5
    private val baseDelay = 1000L
    
    fun scheduleReconnection() {
        if (reconnectAttempts < maxReconnectAttempts) {
            val delay = baseDelay * (2.0.pow(reconnectAttempts)).toLong()
            
            Handler(Looper.getMainLooper()).postDelayed({
                attemptReconnection()
            }, delay)
            
            reconnectAttempts++
        }
    }
    
    private fun attemptReconnection() {
        // Attempt to reconnect SignalR
        signalRClient.connect(authToken)
    }
    
    fun resetReconnectionAttempts() {
        reconnectAttempts = 0
    }
}
```

## 8. Performance Considerations

### 8.1 Notification Batching
- Group multiple notifications of same type
- Implement notification summary for multiple unread items
- Limit notification frequency to avoid spam

### 8.2 Local Caching Strategy
- Cache recent notifications locally
- Implement pagination for notification list
- Clean up old notifications periodically

### 8.3 Background Processing
- Use WorkManager for background sync
- Implement efficient database queries
- Minimize battery usage with proper scheduling

## 9. Testing Scenarios

### 9.1 Unit Tests
- Test notification creation logic
- Test notification type handling
- Test error scenarios

### 9.2 Integration Tests
- Test API endpoints
- Test SignalR connection
- Test notification delivery

### 9.3 UI Tests
- Test notification display
- Test deep linking
- Test notification actions

## 10. Monitoring and Analytics

### 10.1 Key Metrics to Track
- Notification delivery rate
- Notification open rate
- SignalR connection stability
- API response times

### 10.2 Error Tracking
- Failed notification deliveries
- SignalR connection failures
- API timeout errors
- Database sync failures

Tài liệu này cung cấp cái nhìn tổng quan về hệ thống thông báo và hướng dẫn implementation chi tiết cho team Android.
