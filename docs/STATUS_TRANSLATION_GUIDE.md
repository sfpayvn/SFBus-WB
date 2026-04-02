# Status Translation Guide

This guide explains how to use the new translation system for status constants in the application.

## Overview

Previously, status labels were hardcoded in `status.constants.ts` with Vietnamese text only. Now, all status labels have been moved to the i18n translation files (`vi.json` and `en.json`) for multi-language support.

## Available Tools

### 1. Translation Keys Utility (`status-translation-keys.ts`)

Functions that return translation keys for any status value. Useful when you need the key itself.

**Available functions:**
- `getCommonStatusTranslationKey(status)`
- `getBookingStatusTranslationKey(status, isShort?)`
- `getPaymentStatusTranslationKey(status)`
- `getSeatStatusTranslationKey(status)`
- `getGoodsStatusTranslationKey(status)`
- `getGoodsPaymentStatusTranslationKey(status)`
- `getDeliveryTypeTranslationKey(type)`
- `getFulfillmentModeTranslationKey(mode)`
- `getEventStatusTranslationKey(status)`
- `getBusScheduleDirectionTranslationKey(direction)`
- `getDurationStatusTranslationKey(duration)`

**Example:**
```typescript
import { getBookingStatusTranslationKey } from '@app/constants/status-translation-keys';

const key = getBookingStatusTranslationKey('paid');
console.log(key); // 'status.booking.paid'
```

### 2. Status Translation Service (`status-translation.service.ts`)

Service that returns translated label text directly. Inject this service in your components.

**Available methods:**
- `getCommonStatusLabel(status)`
- `getBookingStatusLabel(status, isShort?)`
- `getPaymentStatusLabel(status)`
- `getSeatStatusLabel(status)`
- `getGoodsStatusLabel(status)`
- `getGoodsPaymentStatusLabel(status)`
- `getDeliveryTypeLabel(type)`
- `getFulfillmentModeLabel(mode)`
- `getEventStatusLabel(status)`
- `getBusScheduleDirectionLabel(direction)`
- `getDurationStatusLabel(duration)`

**Example in Component:**
```typescript
import { StatusTranslationService } from '@app/shared/services/status-translation.service';

export class BookingComponent {
  constructor(private statusService: StatusTranslationService) {}

  getStatusLabel(status: string): string {
    return this.statusService.getBookingStatusLabel(status);
  }
}
```

### 3. Status Label Pipe (`status-label.pipe.ts`)

Pipe for use directly in templates. No need to inject any service.

**Usage in Templates:**

```html
<!-- Common status (default) -->
<span>{{ status | statusLabel }}</span>

<!-- Booking status -->
<span>{{ status | statusLabel:'booking' }}</span>

<!-- Booking status (short version) -->
<span>{{ status | statusLabel:'booking':true }}</span>

<!-- Payment status -->
<span>{{ status | statusLabel:'payment' }}</span>

<!-- Goods status -->
<span>{{ status | statusLabel:'goods' }}</span>

<!-- Other types: 'seat', 'goodspayment', 'delivery', 'fulfillment', 'event', 'direction', 'duration' -->
```

## Migration Guide

### Before (Hardcoded)
```typescript
import { BOOKING_STATUS, BOOKING_STATUS_LABELS } from '@app/constants/status.constants';

// In component
const label = BOOKING_STATUS_LABELS[BOOKING_STATUS.PAID]; // "Đã thanh toán"
```

### After (Using Translation Pipe - Recommended)
```html
<!-- In template -->
<span>{{ BOOKING_STATUS.PAID | statusLabel:'booking' | translate }}</span>
<!-- Or simpler: -->
<span>{{ status | statusLabel:'booking' }}</span>
```

### After (Using Service)
```typescript
import { StatusTranslationService } from '@app/shared/services/status-translation.service';
import { BOOKING_STATUS } from '@app/constants/status.constants';

export class BookingComponent {
  constructor(private statusService: StatusTranslationService) {}

  getLabel(): string {
    return this.statusService.getBookingStatusLabel(BOOKING_STATUS.PAID);
  }
}
```

## Status Types and Available Statuses

### Common Status
- `active` → "Hoạt động" / "Active"
- `inactive` → "Không hoạt động" / "Inactive"
- `suspended` → "Tạm dừng" / "Suspended"
- `expired` → "Hết hạn" / "Expired"

### Booking Status
- `reserved` → "Đã đặt" / "Reserved"
- `paid` → "Đã thanh toán" / "Paid"
- `deposited` → "Đã đặt cọc" / "Deposited"
- `completed` → "Hoàn thành" / "Completed"
- `cancelled` → "Đã hủy" / "Cancelled"

**Short versions:**
- `reservedShort` → "Đã đặt" / "Reserved"
- `paidShort` → "Đã TT" / "Paid"
- `depositedShort` → "Đã Cọc" / "Deposited"
- `completedShort` → "Hoàn thành" / "Completed"
- `cancelledShort` → "Đã hủy" / "Cancelled"

### Payment Status
- `pending` → "Đang xử lý" / "Pending"
- `completed` → "Thành công" / "Completed"
- `failed` → "Thất bại" / "Failed"
- `refunded` → "Đã hoàn tiền" / "Refunded"

### Seat Status
- `not_picked_up` → "Chưa đón" / "Not Picked Up"
- `picked_up` → "Đã đón" / "Picked Up"
- `on_board` → "Đã lên xe" / "On Board"
- `dropped_off` → "Đã trả khách" / "Dropped Off"
- `blocked` → "Bị chặn" / "Blocked"

### Goods Status
- `new` → "Nhập hàng" / "New"
- `pending` → "Chờ vận chuyển" / "Pending"
- `on_board` → "Đang vận chuyển" / "On Board"
- `waiting_continue_delivery` → "Chờ tiếp tục" / "Waiting Continue"
- `arrived_final_station` → "Đã tới trạm" / "Arrived at Station"
- `out_for_delivery` → "Đang giao" / "Out for Delivery"
- `completed` → "Hoàn thành" / "Completed"
- `cancelled` → "Đã hủy" / "Cancelled"

### Goods Payment Status
- `new` → "Chưa thanh toán" / "Not Paid"
- `deposited` → "Thanh toán 1 phần" / "Partially Paid"
- `paid` → "Đã thanh toán" / "Paid"
- `ready_refund` → "Chờ hoàn tiền" / "Ready for Refund"
- `refunded` → "Đã hoàn tiền" / "Refunded"

### Event Status
- `un_published` → "Chưa xuất bản" / "Not Published"
- `scheduled` → "Đã lên lịch" / "Scheduled"
- `cancelled` → "Đã hủy" / "Cancelled"
- `in_progress` → "Đang diễn ra" / "In Progress"
- `completed` → "Hoàn thành" / "Completed"
- `overdue` → "Quá hạn" / "Overdue"

### Delivery Type
- `station` → "Nhận tại trạm" / "Receive at Station"
- `address` → "Giao tận nơi" / "Deliver to Address"

### Fulfillment Mode
- `roadside` → "Dọc đường" / "Roadside"
- `station` → "Theo tuyến" / "By Route"

### Fulfillment Mode
- `roadside` → "Dọc đường" / "Roadside"
- `station` → "Theo tuyến" / "By Route"

### Bus Schedule Direction
- `arrival` → "Chiều đến" / "Arrival"
- `departure` → "Chiều đi" / "Departure"
- `day` → "Ngày" / "Day"
- `week` → "Tuần" / "Week"
- `month` → "Tháng" / "Month"
- `year` → "Năm" / "Year"
- `lifetime` → "Không bao giờ hết hạn" / "Never Expires"

## Translation File Locations

- Vietnamese: `src/assets/i18n/vi.json`
- English: `src/assets/i18n/en.json`

All status translations are under the `status` key.

## Notes

- The pipe is standalone, so it can be imported directly in components that need it
- All services are provided at root level
- The `translate` pipe must still be used if you need the key only (when using the translation keys utility)
- For TypeScript code, use the service. For templates, use the pipe.
