# Card Components

A comprehensive card system for the home service application, including base cards and specialized card components for different use cases.

## Overview

The card system consists of:

- **Base Card**: Foundation component with multiple variants
- **HelperCard**: Specialized card for displaying helper profiles
- **ServiceCard**: Specialized card for displaying service information
- **OrderCard**: Specialized card for displaying order status and details

## Base Card Component

### Usage

```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/design-system/Card";

<Card variant="default" padding="medium" size="full">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Variants

- **default**: Standard card with basic shadow
- **elevated**: Enhanced shadow for emphasis
- **interactive**: Clickable card with hover effects
- **outlined**: Emphasized border styling

### Props

| Prop     | Type                                                     | Default     | Description              |
| -------- | -------------------------------------------------------- | ----------- | ------------------------ |
| variant  | `'default' \| 'elevated' \| 'interactive' \| 'outlined'` | `'default'` | Visual variant           |
| padding  | `'none' \| 'small' \| 'medium' \| 'large'`               | `'medium'`  | Internal padding         |
| size     | `'small' \| 'medium' \| 'large' \| 'full'`               | `'full'`    | Maximum width            |
| asButton | `boolean`                                                | `false`     | Render as button element |
| animated | `boolean`                                                | `false`     | Enable fade-in animation |

## HelperCard Component

Specialized card for displaying helper profile information with rating, services, and booking functionality.

### Usage

```tsx
import { HelperCard } from "@/components/design-system/HelperCard";

<HelperCard
  helper={{
    id: "helper-1",
    name: "Nguyễn Thị Mai",
    rating: 4.8,
    reviewCount: 127,
    services: ["Dọn dẹp nhà", "Nấu ăn", "Giặt ủi"],
    priceRange: { min: 80000, max: 120000, currency: "₫" },
    distance: "1.2km",
    isAvailable: true,
    isVerified: true,
  }}
  onClick={(helperId) => console.log("View helper:", helperId)}
  onBook={(helperId) => console.log("Book helper:", helperId)}
/>;
```

### Features

- Helper profile photo with verification badge
- Star rating display with review count
- Service tags with overflow handling
- Distance indicator and availability status
- Price range display
- Interactive booking button
- Compact mode for smaller layouts

### Props

| Prop      | Type                         | Description               |
| --------- | ---------------------------- | ------------------------- |
| helper    | `HelperProfile`              | Helper information object |
| onClick   | `(helperId: string) => void` | Card click handler        |
| onBook    | `(helperId: string) => void` | Book button click handler |
| compact   | `boolean`                    | Enable compact layout     |
| className | `string`                     | Additional CSS classes    |

## ServiceCard Component

Specialized card for displaying service information with pricing and availability.

### Usage

```tsx
import { ServiceCard } from "@/components/design-system/ServiceCard";

<ServiceCard
  service={{
    id: "service-1",
    name: "Dọn dẹp nhà cửa",
    description: "Dịch vụ dọn dẹp nhà cửa chuyên nghiệp",
    icon: "🏠",
    priceRange: { min: 80000, max: 150000, currency: "₫" },
    duration: "giờ",
    isPopular: true,
    availableHelpers: 23,
    category: "Dọn dẹp",
  }}
  onClick={(serviceId) => console.log("Select service:", serviceId)}
  layout="vertical"
/>;
```

### Features

- Service icon display (emoji or React component)
- Popular badge for trending services
- Price range with duration
- Available helpers count
- Category labeling
- Horizontal and vertical layouts
- Compact mode support

### Props

| Prop      | Type                          | Default      | Description                |
| --------- | ----------------------------- | ------------ | -------------------------- |
| service   | `ServiceInfo`                 | -            | Service information object |
| onClick   | `(serviceId: string) => void` | -            | Card click handler         |
| compact   | `boolean`                     | `false`      | Enable compact layout      |
| layout    | `'vertical' \| 'horizontal'`  | `'vertical'` | Card layout direction      |
| className | `string`                      | -            | Additional CSS classes     |

## OrderCard Component

Specialized card for displaying order information with status tracking and actions.

### Usage

```tsx
import { OrderCard } from "@/components/design-system/OrderCard";

<OrderCard
  order={{
    id: "order-123456789",
    serviceName: "Dọn dẹp nhà cửa",
    status: "in_progress",
    scheduledDate: "15/01/2024",
    scheduledTime: "14:00",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    helper: {
      id: "helper-1",
      name: "Nguyễn Thị Mai",
      phone: "0901234567",
    },
    pricing: { amount: 120000, currency: "₫" },
    duration: "2 giờ",
    notes: "Special instructions...",
    createdAt: "2024-01-10T10:00:00Z",
  }}
  onClick={(orderId) => console.log("View order:", orderId)}
  onContactHelper={(helperId) => console.log("Contact helper:", helperId)}
  onCancelOrder={(orderId) => console.log("Cancel order:", orderId)}
/>;
```

### Features

- Order status with color-coded badges
- Progress timeline visualization
- Helper information with contact option
- Schedule and location details
- Action buttons (contact, cancel)
- Notes display
- Compact mode for lists

### Order Status Types

- `pending`: Order placed, awaiting confirmation
- `confirmed`: Order confirmed by helper
- `in_progress`: Service being performed
- `completed`: Service completed successfully
- `cancelled`: Order cancelled

### Props

| Prop            | Type                         | Default | Description              |
| --------------- | ---------------------------- | ------- | ------------------------ |
| order           | `OrderInfo`                  | -       | Order information object |
| onClick         | `(orderId: string) => void`  | -       | Card click handler       |
| onContactHelper | `(helperId: string) => void` | -       | Contact helper handler   |
| onCancelOrder   | `(orderId: string) => void`  | -       | Cancel order handler     |
| compact         | `boolean`                    | `false` | Enable compact layout    |
| showTimeline    | `boolean`                    | `true`  | Show progress timeline   |
| className       | `string`                     | -       | Additional CSS classes   |

## Design Principles

### Visual Hierarchy

Cards use consistent spacing, typography, and color to create clear visual hierarchy:

- **12px border radius** for modern, friendly appearance
- **Shadow system** to indicate elevation and interactivity
- **Color-coded status** for quick recognition
- **Consistent spacing** using 8px grid system

### Accessibility

All card components follow accessibility best practices:

- **Keyboard navigation** support with proper focus indicators
- **ARIA labels** for screen readers
- **Color contrast** meeting WCAG 2.1 AA standards
- **Touch-friendly** button sizes (44px minimum)
- **Semantic HTML** structure

### Responsive Design

Cards adapt to different screen sizes:

- **Mobile-first** approach with touch-friendly interactions
- **Flexible layouts** that work on all screen sizes
- **Compact modes** for smaller screens
- **Horizontal layouts** for wider screens

### Performance

Cards are optimized for performance:

- **Lazy loading** support for images
- **Efficient re-rendering** with React.memo where appropriate
- **Minimal DOM** structure
- **CSS-based animations** for smooth interactions

## Best Practices

### When to Use Each Card Type

- **Base Card**: Generic content containers, custom layouts
- **HelperCard**: Helper listings, search results, recommendations
- **ServiceCard**: Service catalogs, quick actions, category browsing
- **OrderCard**: Order history, active orders, order tracking

### Layout Guidelines

- Use **grid layouts** for card collections
- Maintain **consistent spacing** between cards
- Consider **loading states** for dynamic content
- Implement **empty states** for no results

### Content Guidelines

- Keep **titles concise** and descriptive
- Use **clear action labels** on buttons
- Provide **meaningful descriptions** without overwhelming
- Show **relevant status information** prominently

## Examples

### Helper Search Results

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {helpers.map((helper) => (
    <HelperCard
      key={helper.id}
      helper={helper}
      onClick={viewHelperProfile}
      onBook={bookHelper}
    />
  ))}
</div>
```

### Service Categories

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {services.map((service) => (
    <ServiceCard
      key={service.id}
      service={service}
      onClick={selectService}
      compact
    />
  ))}
</div>
```

### Order History

```tsx
<div className="space-y-4">
  {orders.map((order) => (
    <OrderCard
      key={order.id}
      order={order}
      onClick={viewOrderDetails}
      onContactHelper={contactHelper}
      onCancelOrder={cancelOrder}
    />
  ))}
</div>
```

## Testing

All card components include comprehensive tests covering:

- **Rendering** with various props
- **User interactions** (click, keyboard navigation)
- **Accessibility** features
- **Responsive behavior**
- **Edge cases** (missing data, error states)

Run tests with:

```bash
npm test Card.test.tsx
```

## Storybook

Interactive examples and documentation available in Storybook:

```bash
npm run storybook
```

Navigate to "Design System > Cards" to explore all variants and configurations.
