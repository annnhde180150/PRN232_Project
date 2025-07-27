# Tài Liệu Thiết Kế - Thiết Kế Lại Giao Diện Ứng Dụng Dịch Vụ Giúp Việc Nhà

## Tổng Quan

Tài liệu này mô tả thiết kế chi tiết cho việc thiết kế lại giao diện người dùng của ứng dụng marketplace dịch vụ giúp việc nhà. Thiết kế tập trung vào việc tạo ra một hệ thống giao diện nhất quán, hiện đại và dễ sử dụng cho 3 nhóm người dùng: Khách hàng, Người giúp việc, và Quản trị viên.

## Kiến Trúc Thiết Kế

### Nguyên Tắc Thiết Kế Cốt Lõi

1. **Mobile-First Approach**: Thiết kế ưu tiên trải nghiệm di động với responsive design
2. **Accessibility-First**: Đảm bảo WCAG 2.1 AA compliance từ đầu
3. **Performance-Oriented**: Tối ưu hóa tốc độ tải và tương tác
4. **Trust & Safety**: Thiết kế tạo cảm giác tin cậy và an toàn
5. **Simplicity**: Giao diện đơn giản, trực quan, giảm thiểu cognitive load

### Hệ Thống Thiết Kế Tổng Thể

#### Bảng Màu Chính

Dựa trên nghiên cứu về tâm lý màu sắc và xu hướng thiết kế hiện tại, bảng màu được chọn để tạo cảm giác tin cậy, chuyên nghiệp và thân thiện:

**Primary Colors:**

- **Primary Blue**: `oklch(0.588 0.158 241.966)` (#2563eb) - Tin cậy, chuyên nghiệp
- **Primary Blue Light**: `oklch(0.746 0.16 232.661)` (#3b82f6) - Hover states
- **Primary Blue Dark**: `oklch(0.5 0.134 242.749)` (#1d4ed8) - Active states

**Secondary Colors:**

- **Success Green**: `oklch(0.627 0.194 149.214)` (#16a34a) - Trạng thái thành công
- **Warning Amber**: `oklch(0.769 0.188 70.08)` (#f59e0b) - Cảnh báo
- **Error Red**: `oklch(0.637 0.237 25.331)` (#dc2626) - Lỗi
- **Info Cyan**: `oklch(0.715 0.143 215.221)` (#06b6d4) - Thông tin

**Neutral Colors:**

- **Gray 50**: `oklch(0.985 0.002 247.839)` (#f8fafc) - Background
- **Gray 100**: `oklch(0.967 0.003 264.542)` (#f1f5f9) - Light background
- **Gray 200**: `oklch(0.928 0.006 264.531)` (#e2e8f0) - Borders
- **Gray 500**: `oklch(0.551 0.027 264.364)` (#64748b) - Text secondary
- **Gray 900**: `oklch(0.21 0.034 264.665)` (#0f172a) - Text primary

#### Typography

**Font Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)

**Type Scale:**

- **Display**: 48px/52px, font-weight: 700 - Hero sections
- **Heading 1**: 36px/40px, font-weight: 600 - Page titles
- **Heading 2**: 30px/36px, font-weight: 600 - Section titles
- **Heading 3**: 24px/32px, font-weight: 600 - Subsection titles
- **Body Large**: 18px/28px, font-weight: 400 - Important content
- **Body**: 16px/24px, font-weight: 400 - Default text
- **Body Small**: 14px/20px, font-weight: 400 - Secondary text
- **Caption**: 12px/16px, font-weight: 500 - Labels, captions

#### Spacing System

Sử dụng hệ thống spacing 8px base với tỷ lệ 1.5:

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

#### Component Library

**Buttons:**

- Primary: Blue background, white text, 44px min height
- Secondary: White background, blue border, blue text
- Ghost: Transparent background, blue text
- Danger: Red background, white text

**Cards:**

- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 16px-24px
- Background: White

**Form Elements:**

- Input height: 44px minimum (touch-friendly)
- Border radius: 8px
- Focus state: Blue outline, 2px width

## Thành Phần và Giao Diện

### 1. Giao Diện Khách Hàng

#### 1.1 Dashboard/Home Screen

**Layout Structure:**

```
┌─────────────────────────────────┐
│ Header (Search + Profile)       │
├─────────────────────────────────┤
│ Quick Actions (4 services)      │
├─────────────────────────────────┤
│ "Gần bạn" - Helper Cards        │
├─────────────────────────────────┤
│ Recent Orders                   │
├─────────────────────────────────┤
│ Bottom Navigation               │
└─────────────────────────────────┘
```

**Key Features:**

- Hero search bar với location picker
- Quick service buttons (Dọn dẹp, Nấu ăn, Giặt ủi, Chăm sóc trẻ)
- Helper cards với rating, price, distance
- Order tracking widget
- Bottom tab navigation

#### 1.2 Service Discovery & Booking

**Search & Filter:**

- Map view toggle
- Filter by: Price, Rating, Distance, Availability
- Sort by: Relevance, Price, Rating, Distance

**Helper Profile Card:**

- Profile photo (circular, 64px)
- Name, rating (stars + number)
- Service types (tags)
- Price range
- Distance indicator
- "Đặt ngay" CTA button

**Booking Flow:**

1. Service selection
2. Date/time picker
3. Address confirmation
4. Special instructions
5. Payment method
6. Confirmation

#### 1.3 Order Management

**Order Status Timeline:**

- Đã đặt → Đã xác nhận → Đang thực hiện → Hoàn thành
- Real-time status updates
- Helper contact information
- Live chat integration

### 2. Giao Diện Người Giúp Việc

#### 2.1 Dashboard

**Layout Structure:**

```
┌─────────────────────────────────┐
│ Earnings Summary Card           │
├─────────────────────────────────┤
│ Today's Schedule                │
├─────────────────────────────────┤
│ New Requests (Badge)            │
├─────────────────────────────────┤
│ Quick Actions                   │
└─────────────────────────────────┘
```

**Key Metrics:**

- Today's earnings
- This week's earnings
- Completion rate
- Average rating

#### 2.2 Request Management

**Request Card Design:**

- Service type icon
- Customer info (name, rating)
- Service details
- Time & location
- Estimated earnings
- Accept/Decline buttons (prominent)

**Calendar View:**

- Monthly/weekly view toggle
- Color-coded by service type
- Drag-and-drop rescheduling
- Availability toggle

#### 2.3 Profile & Settings

**Profile Sections:**

- Personal information
- Service offerings
- Pricing settings
- Availability schedule
- Portfolio/photos
- Reviews & ratings

### 3. Giao Diện Quản Trị Viên

#### 3.1 Analytics Dashboard

**Layout Structure:**

```
┌─────────────────────────────────┐
│ KPI Cards Row                   │
├─────────────────────────────────┤
│ Charts Section (2 columns)      │
├─────────────────────────────────┤
│ Recent Activity Feed            │
└─────────────────────────────────┘
```

**Key Metrics:**

- Total users, Active helpers, Orders today
- Revenue charts
- Geographic distribution
- Service popularity

#### 3.2 User Management

**Data Table Features:**

- Search & advanced filters
- Bulk actions
- Export functionality
- Inline editing
- Status indicators

#### 3.3 Dispute Resolution

**Dispute Interface:**

- Case timeline
- Evidence gallery
- Communication thread
- Resolution actions
- Status tracking

## Mô Hình Dữ Liệu

### User Profiles

```typescript
interface UserProfile {
  id: string;
  type: "customer" | "helper" | "admin";
  personalInfo: PersonalInfo;
  preferences: UserPreferences;
  verification: VerificationStatus;
}
```

### Service Requests

```typescript
interface ServiceRequest {
  id: string;
  customerId: string;
  serviceType: ServiceType;
  location: Location;
  scheduledTime: DateTime;
  status: RequestStatus;
  pricing: PricingInfo;
}
```

### Helper Profiles

```typescript
interface HelperProfile extends UserProfile {
  services: ServiceOffering[];
  availability: AvailabilitySchedule;
  pricing: PricingStructure;
  portfolio: MediaItem[];
  ratings: RatingsSummary;
}
```

## Xử Lý Lỗi

### Error States Design

**Network Errors:**

- Offline indicator
- Retry mechanisms
- Cached content display
- Progressive enhancement

**Validation Errors:**

- Inline field validation
- Clear error messages
- Contextual help text
- Accessibility announcements

**System Errors:**

- Friendly error pages
- Contact support options
- Error reporting
- Graceful degradation

### Loading States

**Skeleton Screens:**

- Content-aware placeholders
- Smooth transitions
- Progressive loading
- Perceived performance optimization

**Progress Indicators:**

- Determinate for known processes
- Indeterminate for unknown duration
- Step indicators for multi-step flows
- Success animations

## Chiến Lược Testing

### Usability Testing

**Test Scenarios:**

1. First-time user onboarding
2. Service booking flow
3. Helper profile setup
4. Order management
5. Dispute resolution

**Testing Methods:**

- Moderated user testing
- A/B testing for key flows
- Accessibility testing
- Performance testing
- Cross-device testing

### Accessibility Testing

**WCAG 2.1 AA Compliance:**

- Color contrast ratios (4.5:1 minimum)
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Alternative text for images

**Testing Tools:**

- axe-core automated testing
- Manual keyboard testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color blindness simulation

### Performance Testing

**Key Metrics:**

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

**Optimization Strategies:**

- Image optimization and lazy loading
- Code splitting and tree shaking
- CDN implementation
- Caching strategies
- Bundle size monitoring

## Responsive Design Strategy

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile-First Approach

- Touch-friendly interactions (44px minimum)
- Thumb-friendly navigation
- Swipe gestures support
- Optimized for one-handed use

### Progressive Enhancement

- Core functionality works without JavaScript
- Enhanced features for modern browsers
- Graceful degradation for older devices
- Offline-first approach where applicable

## Implementation Guidelines

### Development Standards

- Component-based architecture
- TypeScript for type safety
- Styled-components for styling
- Storybook for component documentation
- Jest + React Testing Library for testing

### Design Tokens

- Centralized design system
- Automated design-to-code workflow
- Version control for design assets
- Cross-platform consistency

### Quality Assurance

- Automated accessibility testing
- Visual regression testing
- Performance monitoring
- User feedback integration
- Continuous improvement process
