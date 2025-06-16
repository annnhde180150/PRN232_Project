# SignalR Infrastructure Documentation

## Tổng quan

SignalR infrastructure đã được triển khai thành công cho real-time notifications trong dự án HomeHelperFinderAPI.

## Các thành phần đã triển khai

### 1. Entity và Database

- **Connection Entity** (`BussinessObjects/Models/Connection.cs`)
    - Lưu trữ thông tin kết nối của User và Helper
    - Tracking active connections và disconnect time

### 2. Repository Layer

- **IConnectionRepository** (`Repositories/Interfaces/IConnectionRepository.cs`)
- **ConnectionRepository** (`Repositories/Implements/ConnectionRepository.cs`)
- **UnitOfWork** đã được cập nhật để include Connections

### 3. Service Layer

- **IConnectionManager** (`Services/Interfaces/IConnectionManager.cs`)
- **ConnectionManager** (`Services/Implements/ConnectionManager.cs`)
    - Quản lý active connections trong memory
    - Persist connection data vào database

### 4. SignalR Hub

- **NotificationHub** (`HomeHelperFinderAPI/Hubs/NotificationHub.cs`)
    - Handle kết nối từ User và Helper
    - Authentication required
    - Auto join groups theo user type
    - Error handling comprehensive

### 5. SignalR Service Helper

- **SignalRNotificationService** (`HomeHelperFinderAPI/Services/SignalRNotificationService.cs`)
    - Send notifications to specific users
    - Send notifications to groups
    - User status notifications

## Cấu hình

### Program.cs

```csharp
// SignalR
builder.Services.AddSignalR();

// CORS cho Android client
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://10.0.2.2:5000", "https://10.0.2.2:5001", "http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Hub mapping
app.MapHub<NotificationHub>("/notificationHub");
```

## Sử dụng

### Client kết nối

```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/notificationHub", {
        accessTokenFactory: () => yourJWTToken
    })
    .build();

// Lắng nghe notifications
connection.on("ReceiveNotification", (notification) => {
    console.log("Received notification:", notification);
});

// Lắng nghe user status
connection.on("UserStatusChanged", (statusData) => {
    console.log("User status changed:", statusData);
});
```

### Server gửi notifications

```csharp
// Inject SignalRNotificationService vào controller
private readonly SignalRNotificationService _signalRService;

// Gửi notification cho user cụ thể
await _signalRService.SendNotificationToUserAsync(userId, "User", notificationDto);

// Gửi cho tất cả Users
await _signalRService.SendNotificationToAllUsersAsync(notificationDto);

// Gửi cho tất cả Helpers
await _signalRService.SendNotificationToAllHelpersAsync(notificationDto);
```

## Authentication

- Hub yêu cầu authentication với `[Authorize]` attribute
- Claims cần thiết:
    - `UserType`: "User" hoặc "Helper"
    - `ClaimTypes.NameIdentifier`: UserId hoặc HelperId

## Groups

- **Users**: Tất cả connected users
- **Helpers**: Tất cả connected helpers

## Endpoints

- **SignalR Hub**: `/notificationHub`

## Logging

- Comprehensive logging cho connection events
- Error handling với proper exception logging
- User status change notifications

## Database Migration

Cần tạo migration cho Connection entity:

```bash
dotnet ef migrations add AddConnectionEntity
dotnet ef database update
```

## Testing

Có thể test bằng:

1. Postman với WebSocket support
2. Browser developer tools
3. Android/iOS SignalR client libraries

## Notes

- ConnectionManager sử dụng in-memory dictionary cho performance
- Database persistence đảm bảo data consistency
- CORS đã được cấu hình cho Android emulator (10.0.2.2)