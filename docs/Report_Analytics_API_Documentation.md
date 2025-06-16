# Report/Analytics API Documentation

## Overview

The Report/Analytics feature provides comprehensive data insights and reporting capabilities for the Home Helper Finder platform. This feature enables administrators, users, and helpers to view statistical data, performance metrics, and business intelligence dashboards.

## Base URL

```
/api/report
```

## Authentication

All endpoints require authentication. Most analytics endpoints require Admin role, while some allow users and helpers to access their own data.

## Available Endpoints

### System Analytics

#### 1. Get System Overview
**GET** `/api/report/system-overview`

**Authorization:** Admin only

**Description:** Get overall platform statistics including user counts, bookings, revenue, and growth metrics.

#### 2. Get Performance Metrics
**GET** `/api/report/performance-metrics`

**Authorization:** Admin only

**Description:** Get key performance indicators and operational metrics.

### User Analytics

#### 3. Get User Analytics
**GET** `/api/report/users`

**Authorization:** Admin only

**Query Parameters:**
- `startDate` (optional): Start date for analytics period
- `endDate` (optional): End date for analytics period

**Description:** Get user registration trends, activity metrics, and engagement data.

### Helper Analytics

#### 4. Get Helper Analytics
**GET** `/api/report/helpers/{helperId}`

**Authorization:** Admin or Helper (own data only)

**Query Parameters:**
- `period` (optional): Analytics period (day, week, month, quarter, year)

**Description:** Get comprehensive helper performance analytics.

#### 5. Get My Analytics (Helper)
**GET** `/api/report/helpers/my-analytics`

**Authorization:** Helper only

**Description:** Get analytics for the authenticated helper.

### Export Functions

#### 6. Export System Report
**GET** `/api/report/export/system`

**Authorization:** Admin only

**Description:** Export system overview report to CSV.

#### 7. Export Helper Report
**GET** `/api/report/export/helpers/{helperId}`

**Authorization:** Admin or Helper (own data only)

**Description:** Export helper performance report to CSV.

## Real-time Features

The analytics system integrates with SignalR for real-time updates:

- **Analytics Updates**: Automatic dashboard updates when data changes
- **Performance Alerts**: Notifications for performance issues or thresholds

## Usage Examples

### Get System Overview
```javascript
const response = await fetch('/api/report/system-overview', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
const overview = await response.json();
```

### Listen for Real-time Updates
```javascript
connection.on("AnalyticsUpdate", (data) => {
  console.log("Analytics updated:", data);
  updateDashboard(data.overview, data.performance);
});
``` 