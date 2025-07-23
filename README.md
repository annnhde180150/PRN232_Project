# Find Helper - Frontend

Ứng dụng frontend cho nền tảng tìm kiếm người giúp việc nhà, được xây dựng với Next.js và TypeScript.

## Tính năng đã triển khai

### 🔐 Hệ thống xác thực
- **Đăng nhập đa vai trò**: Hỗ trợ đăng nhập cho 3 loại người dùng:
  - Khách hàng (User)
  - Người giúp việc (Helper) 
  - Quản trị viên (Admin)
- **Đăng ký tài khoản**: Form đăng ký riêng biệt cho khách hàng và người giúp việc
- **Quản lý phiên đăng nhập**: Tự động lưu token và thông tin người dùng
- **Dashboard theo vai trò**: Giao diện dashboard khác nhau cho từng loại người dùng

### 🎨 Giao diện người dùng
- **Thiết kế responsive**: Tối ưu cho mọi kích thước màn hình
- **UI hiện đại**: Sử dụng Tailwind CSS với gradient và shadow
- **UX thân thiện**: Form validation, loading states, error handling
- **Đa ngôn ngữ**: Giao diện hoàn toàn bằng tiếng Việt

## Cấu trúc thư mục

```
src/
├── app/
│   ├── login/page.tsx          # Trang đăng nhập
│   ├── register/page.tsx       # Trang đăng ký
│   ├── dashboard/page.tsx      # Dashboard sau đăng nhập
│   ├── layout.tsx              # Layout chính
│   └── page.tsx                # Trang chủ
├── contexts/
│   └── AuthContext.tsx         # Context quản lý state xác thực
├── lib/
│   └── api.ts                  # API functions và utilities
└── types/
    └── auth.ts                 # TypeScript interfaces
```

## API Endpoints đã tích hợp

### Đăng nhập
- `POST /api/Authentication/login/user` - Đăng nhập khách hàng
- `POST /api/Authentication/login/helper` - Đăng nhập người giúp việc
- `POST /api/Authentication/login/admin` - Đăng nhập quản trị viên

### Đăng ký
- `POST /api/Authentication/register/user` - Đăng ký khách hàng
- `POST /api/Authentication/register/helper` - Đăng ký người giúp việc

### Đăng xuất
- `POST /api/Authentication/logout` - Đăng xuất

## Cài đặt và chạy

1. **Cài đặt dependencies**
```bash
npm install
```

2. **Tạo file environment**
```bash
# Tạo file .env.local và thêm:
NEXT_PUBLIC_API_BASE_URL=https://localhost:7192
```

3. **Chạy development server**
```bash
npm run dev
```

4. **Truy cập ứng dụng**
```
http://localhost:3000
```

## Tính năng chính

### 🏠 Trang chủ
- Giới thiệu ứng dụng và các tính năng
- Liên kết đến trang đăng nhập/đăng ký
- Tự động chuyển hướng nếu đã đăng nhập

### 🔑 Trang đăng nhập
- Form đăng nhập với email và mật khẩu
- Lựa chọn loại tài khoản (User/Helper/Admin)
- Xử lý lỗi và hiển thị thông báo
- Loading state khi đang xử lý

### 📝 Trang đăng ký
- Form đăng ký cho khách hàng và người giúp việc
- Validation form và hiển thị lỗi
- Thông báo thành công và chuyển hướng
- Fields bổ sung cho người giúp việc (ngày sinh, giới tính, bio)

### 📊 Dashboard
- **Khách hàng**: Quản lý dịch vụ và lịch sử
- **Người giúp việc**: Trạng thái duyệt, thống kê làm việc
- **Quản trị viên**: Công cụ quản lý hệ thống
- Thông tin tài khoản và nút đăng xuất

## Dependencies

- **Next.js 15.4.3**: React framework
- **React 19.1.0**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **React Hook Form**: Form management

## Lưu ý bảo mật

- Sử dụng localStorage để lưu trữ token (có thể nâng cấp thành httpOnly cookies)
- API interceptor tự động thêm Authorization header
- Xử lý lỗi và timeout của API calls
- Validation form phía client và server

## Tính năng tiếp theo

- [ ] Quên mật khẩu
- [ ] Xác thực email/OTP
- [ ] Refresh token
- [ ] Profile management
- [ ] Social login
- [ ] Remember me functionality

## API Documentation

Chi tiết về các API endpoints có thể xem trong thư mục `docs/`:
- `docs/login_api.md` - API đăng nhập
- `docs/register_api.md` - API đăng ký
- `docs/context.md` - Bối cảnh dự án
