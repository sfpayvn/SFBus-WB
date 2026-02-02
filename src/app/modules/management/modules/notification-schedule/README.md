# Notification Schedule Module

## Overview

The Notification Schedule module provides a comprehensive solution for scheduling and managing notifications in the SFBus system. It allows administrators to create, edit, schedule, and send notifications to multiple users with flexible scheduling options.

## Features

- **Calendar-based Scheduling**: Visual calendar interface to manage notification schedules
- **Multiple View Modes**: List, Day, Week, and Month views
- **Recurring Notifications**: Support for one-time, daily, weekly, and monthly notifications
- **Recipient Management**: Add multiple recipients to each notification
- **Status Tracking**: Track notification status (Draft, Scheduled, Sent, Failed, Cancelled)
- **Immediate Send**: Option to send notifications immediately instead of scheduling
- **Table View**: Alternative table view for quick overview and bulk actions
- **Responsive Design**: Tailwind CSS-based responsive layout matching project UI

## Module Structure

```
notification-schedule/
├── components/
│   ├── notification-schedule-calendar/      # Reusable calendar component
│   │   ├── notification-schedule-calendar.component.ts
│   │   ├── notification-schedule-calendar.component.html
│   │   └── notification-schedule-calendar.component.scss
│   └── notification-schedule-detail-dialog/  # Form dialog for create/edit
│       ├── notification-schedule-detail-dialog.component.ts
│       ├── notification-schedule-detail-dialog.component.html
│       └── notification-schedule-detail-dialog.component.scss
├── models/
│   └── notification-schedule.model.ts        # TypeScript interfaces and enums
├── services/
│   └── notification-schedule.service.ts      # API communication service
├── pages/
│   └── notification-schedule-management/    # Main management page
│       ├── notification-schedule-management.component.ts
│       ├── notification-schedule-management.component.html
│       └── notification-schedule-management.component.scss
├── notification-schedule.module.ts           # Module definition
└── notification-schedule-routing.module.ts   # Routing configuration
```

## Data Models

### NotificationSchedule

```typescript
interface NotificationSchedule {
  _id?: string;
  tenantId: string;
  title: string;                    // Schedule title
  description: string;              // Short description
  content: string;                  // Full notification content
  recipients: NotificationRecipient[];
  scheduledDate: Date;              // When to send
  scheduledTime: string;            // HH:mm format
  frequency: NotificationScheduleFrequency;
  status: NotificationScheduleStatus;
  isActive: boolean;
  endDate?: Date;                   // For recurring schedules
  sentCount: number;                // Number of successful sends
  failedCount: number;              // Number of failed sends
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Status Enums

```typescript
enum NotificationScheduleStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

enum NotificationScheduleFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}
```

## API Integration

The module uses the `ApiGatewayService` for all HTTP requests with built-in quota tracking:

```typescript
// Get all schedules
getNotificationSchedules(filters?: NotificationScheduleFilterOptions)

// Get by ID
getNotificationScheduleById(id: string)

// Create new schedule
createNotificationSchedule(data: NotificationScheduleCreateRequest)

// Update schedule
updateNotificationSchedule(id: string, data: NotificationScheduleUpdateRequest)

// Delete schedule
deleteNotificationSchedule(id: string)

// Get schedules for date range
getSchedulesForDateRange(startDate: Date, endDate: Date)

// Cancel a scheduled notification
cancelSchedule(id: string)

// Send notification immediately
sendNow(id: string)

// Get statistics
getStatistics(startDate?: Date, endDate?: Date)
```

## Usage

### In Templates

```html
<!-- Calendar View -->
<app-notification-schedule-calendar
  [events]="schedules"
  [isLoadedEvent]="!isLoading"
  [capModule]="capModule"
  [capFunction]="capFunction"
  (reLoadEventEmit)="onDateRangeChanged($event)"
  (viewDetailEventEmit)="onViewDetailEvent($event)"
  (createEventEmit)="onCreateEvent($event)">
</app-notification-schedule-calendar>
```

### In Components

```typescript
import { NotificationScheduleService } from './services/notification-schedule.service';

constructor(private notificationScheduleService: NotificationScheduleService) {}

// Create schedule
const payload: NotificationScheduleCreateRequest = {
  title: 'Summer Promotion',
  description: 'Announcement',
  content: 'Full content here...',
  recipients: [{ userId: 'user123' }],
  scheduledDate: new Date('2024-06-01'),
  scheduledTime: '09:00',
  frequency: NotificationScheduleFrequency.ONCE,
};

this.notificationScheduleService.createNotificationSchedule(payload).subscribe({
  next: (schedule) => console.log('Created:', schedule),
  error: (err) => console.error('Error:', err),
});
```

## Features Overview

### Calendar Component

The `NotificationScheduleCalendarComponent` extends the original `CalendarEventsComponent` with:

- **Multiple Views**:
  - **List View**: Shows events grouped by day
  - **Day View**: Hourly slots for a single day
  - **Week View**: 7-day week grid with hourly slots
  - **Month View**: Full month grid with events

- **User Interactions**:
  - Click on empty time slot to create new schedule
  - Click on event to view/edit details
  - Navigate between periods (day, week, month)
  - Quick "Today" button to return to current date

### Management Component

The main management page includes:

- **Dual View Toggle**:
  - Calendar view for visual scheduling
  - Table view for detailed overview and quick actions

- **Quick Actions**:
  - Create new schedule
  - Edit existing schedule
  - Send notification immediately
  - Cancel scheduled notification
  - Delete schedule

- **Status Tracking**:
  - Color-coded status badges
  - Sent/Failed count display
  - Recipient count summary

### Detail Dialog

Form for creating/editing schedules with:

- **Basic Information**: Title, Description, Content, Status
- **Schedule Details**: Date, Time, Frequency, End Date
- **Recipients**: Add/remove multiple recipients
- **Additional**: Notes field for internal reference

## UI/UX Design

The module follows the project's design system:

- **Color Scheme**: Indigo-600 for primary actions, status colors (green, red, blue, yellow) for different states
- **Spacing**: Consistent padding and gaps using Tailwind CSS (px-4, py-2, gap-4, etc.)
- **Typography**: Clear hierarchy with font sizes and weights
- **Interactive Elements**: Hover states, transitions, and loading indicators
- **Responsive Design**: Mobile-first approach with breakpoints (md:, lg:)
- **Icons**: Uses inline SVG for lightweight, scalable icons

## Styling

All components use Tailwind CSS 4 for styling:

- Rounded corners: `rounded-lg`
- Shadows: `shadow-sm`, `shadow-md`
- Borders: `border`, `border-gray-200`
- Colors: `bg-indigo-600`, `text-gray-900`, `hover:bg-indigo-700`
- Responsive grid: `grid grid-cols-1 md:grid-cols-2`

## Module Registration

The module is automatically lazy-loaded via routing:

```typescript
{
  path: 'notification-schedule',
  canActivate: [RoleAccessGuard],
  loadChildren: () =>
    import('./modules/notification-schedule/notification-schedule.module').then(
      (m) => m.NotificationScheduleModule,
    ),
}
```

## Quota Management

All API calls include capability check headers for quota management:

```typescript
{
  feature: { module: 'notification-management', function: 'list-schedules' },
  skipLoading: false,
}
```

## Dependencies

- **Angular**: Core framework (v19+)
- **Angular Material**: Dialog, form components
- **Ng-Zorro**: Spin, popover, date picker
- **Tailwind CSS 4**: Styling and layout
- **RxJS**: Reactive programming

## Future Enhancements

- [ ] Email template designer
- [ ] SMS notification support
- [ ] Batch import from CSV
- [ ] Notification preview
- [ ] Delivery analytics and reporting
- [ ] A/B testing support
- [ ] Advanced scheduling (cron expressions)
- [ ] Notification history and audit logs
