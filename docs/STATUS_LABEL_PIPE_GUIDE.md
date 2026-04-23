# Hướng Dẫn Implement StatusLabelPipe

## Tổng Quan
`StatusLabelPipe` là một Angular Pipe dùng để dịch và hiển thị các nhãn trạng thái trong ứng dụng. Nó cung cấp hỗ trợ cho nhiều loại trạng thái khác nhau như booking, payment, seat, goods, delivery, v.v.

## Status Implementation

**Status**: ✅ **COMPLETED** - Implementation files created and verified

### Implementation Files
- **Pipe**: `src/app/shared/pipes/status-label.pipe.ts`
- **Service**: `src/app/shared/services/status-translation.service.ts`
- **Keys Utility**: `src/app/core/constants/status-translation-keys.ts`

All files have been created and the project builds successfully without errors.

## Vị Trí File
```
src/app/shared/pipes/status-label.pipe.ts
```

## Cấu Trúc Pipe

### Decorator
```typescript
@Pipe({
  name: 'statusLabel',
  standalone: true,
})
```
- **name**: Tên pipe sử dụng trong template (`statusLabel`)
- **standalone**: Pipe là standalone component, có thể import trực tiếp vào components

### Constructor
```typescript
constructor(private statusService: StatusTranslationService) {}
```
Inject `StatusTranslationService` để lấy dữ liệu dịch sang các ngôn ngữ khác nhau.

### Transform Method
```typescript
transform(status: string, type: string = 'common', isShort: boolean = false): string
```

**Parameters:**
- `status` (required): Giá trị trạng thái cần dịch
- `type` (optional): Loại trạng thái (default: 'common')
- `isShort` (optional): Có sử dụng nhãn ngắn gọn không (default: false)

**Returns:** String - Nhãn trạng thái đã dịch

## Các Loại Trạng Thái (Status Types)

| Type | Service Method | Mô Tả |
|------|---|---|
| `common` | `getCommonStatusLabel()` | Trạng thái chung |
| `booking` | `getBookingStatusLabel()` | Trạng thái đặt vé |
| `payment` | `getPaymentStatusLabel()` | Trạng thái thanh toán |
| `seat` | `getSeatStatusLabel()` | Trạng thái ghế |
| `goods` | `getGoodsStatusLabel()` | Trạng thái hàng hoá |
| `goodspayment` | `getGoodsPaymentStatusLabel()` | Trạng thái thanh toán hàng hoá |
| `delivery` | `getDeliveryTypeLabel()` | Loại giao hàng |
| `fulfillment` | `getFulfillmentModeLabel()` | Chế độ hoàn tất |
| `event` | `getEventStatusLabel()` | Trạng thái sự kiện |
| `direction` | `getBusScheduleDirectionLabel()` | Hướng lịch xe |
| `duration` | `getDurationStatusLabel()` | Trạng thái thời gian |

## Cách Sử Dụng

### 1. Import Pipe vào Component

#### Cách A: Trong component standalone
```typescript
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe],
  template: `...`
})
export class BookingDetailComponent {
  // component logic
}
```

#### Cách B: Trong module truyền thống
```typescript
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@NgModule({
  imports: [CommonModule, StatusLabelPipe],
  // other module config
})
export class BookingModule {}
```

### 2. Sử Dụng trong Template

#### Trạng thái chung (Common)
```html
<!-- Không cần chỉ định type, default là 'common' -->
<span>{{ 'ACTIVE' | statusLabel }}</span>
<span>{{ status | statusLabel }}</span>
```

#### Trạng thái đặt vé (Booking)
```html
<!-- Format đầy đủ -->
<span>{{ bookingStatus | statusLabel:'booking' }}</span>

<!-- Format ngắn gọn -->
<span>{{ bookingStatus | statusLabel:'booking':true }}</span>
```

#### Trạng thái thanh toán (Payment)
```html
<span>{{ paymentStatus | statusLabel:'payment' }}</span>
```

#### Trạng thái ghế (Seat)
```html
<span>{{ seatStatus | statusLabel:'seat' }}</span>
```

#### Trạng thái hàng hoá (Goods)
```html
<span>{{ goodsStatus | statusLabel:'goods' }}</span>
```

#### Trạng thái thanh toán hàng hoá (GoodsPayment)
```html
<span>{{ goodsPaymentStatus | statusLabel:'goodspayment' }}</span>
```

#### Loại giao hàng (Delivery)
```html
<span>{{ deliveryType | statusLabel:'delivery' }}</span>
```

#### Chế độ hoàn tất (Fulfillment)
```html
<span>{{ fulfillmentMode | statusLabel:'fulfillment' }}</span>
```

#### Trạng thái sự kiện (Event)
```html
<span>{{ eventStatus | statusLabel:'event' }}</span>
```

#### Hướng lịch xe (Direction)
```html
<span>{{ busDirection | statusLabel:'direction' }}</span>
```

#### Trạng thái thời gian (Duration)
```html
<span>{{ durationStatus | statusLabel:'duration' }}</span>
```

## Ví Dụ Thực Tế

### Ví Dụ 1: Hiển Thị Trạng Thái Đặt Vé trong Danh Sách

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';
import { BookingService } from '@shared/services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe],
  template: `
    <div class="booking-list">
      <div *ngFor="let booking of bookings" class="booking-item">
        <h3>{{ booking.bookingNumber }}</h3>
        <p>Trạng thái: <strong>{{ booking.status | statusLabel:'booking' }}</strong></p>
        <p>Thanh toán: <strong>{{ booking.paymentStatus | statusLabel:'payment' }}</strong></p>
      </div>
    </div>
  `
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getBookings().subscribe(data => {
      this.bookings = data;
    });
  }
}
```

### Ví Dụ 2: Hiển Thị Trạng Thái Hàng Hoá

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLabelPipe } from '@shared/pipes/status-label.pipe';

@Component({
  selector: 'app-goods-detail',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe],
  template: `
    <div class="goods-detail">
      <div class="status-group">
        <label>Trạng thái hàng hoá:</label>
        <span>{{ goodsStatus | statusLabel:'goods' }}</span>
      </div>
      <div class="status-group">
        <label>Trạng thái thanh toán:</label>
        <span>{{ paymentStatus | statusLabel:'goodspayment' }}</span>
      </div>
      <div class="status-group">
        <label>Loại giao hàng:</label>
        <span>{{ deliveryType | statusLabel:'delivery' }}</span>
      </div>
    </div>
  `
})
export class GoodsDetailComponent {
  goodsStatus = 'PENDING';
  paymentStatus = 'UNPAID';
  deliveryType = 'EXPRESS';
}
```

### Ví Dụ 3: Sử Dụng với Styling

```html
<div class="booking-status">
  <span [class]="'status-badge status-' + (bookingStatus | statusLabel:'booking')">
    {{ bookingStatus | statusLabel:'booking' }}
  </span>
</div>
```

```scss
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  // Styling cho từng trạng thái
  &.status-confirmed {
    background-color: #2ecc71;
    color: white;
  }
  
  &.status-pending {
    background-color: #f39c12;
    color: white;
  }
  
  &.status-cancelled {
    background-color: #e74c3c;
    color: white;
  }
}
```

## Lưu Ý Quan Trọng

### 1. Phụ Thuộc StatusTranslationService
Pipe phụ thuộc vào `StatusTranslationService`. Đảm bảo service này được implement đầy đủ với các method:
- `getCommonStatusLabel(status: string): string`
- `getBookingStatusLabel(status: string, isShort?: boolean): string`
- `getPaymentStatusLabel(status: string): string`
- `getSeatStatusLabel(status: string): string`
- `getGoodsStatusLabel(status: string): string`
- `getGoodsPaymentStatusLabel(status: string): string`
- `getDeliveryTypeLabel(status: string): string`
- `getFulfillmentModeLabel(status: string): string`
- `getEventStatusLabel(status: string): string`
- `getBusScheduleDirectionLabel(status: string): string`
- `getDurationStatusLabel(status: string): string`

### 2. Bản Địa Hoá (Localization)
Pipe sử dụng `StatusTranslationService` để hỗ trợ đa ngôn ngữ. Service này sẽ dịch trạng thái dựa trên ngôn ngữ được chọn (thông qua ngx-translate).

### 3. Performance
- Pipe này là pure pipe (mặc định), vì vậy nó chỉ chạy lại khi input thay đổi
- Không gây ảnh hưởng đến performance cho dù được sử dụng nhiều lần

### 4. Default Type
- Nếu không chỉ định `type`, pipe sẽ sử dụng `'common'` làm mặc định
- Nếu type không hợp lệ, pipe sẽ trả về giá trị status ban đầu không thay đổi

## Troubleshooting

### Problem: Pipe không được nhận dạng trong template
**Solution:** Đảm bảo pipe được import trong component import array:
```typescript
imports: [CommonModule, StatusLabelPipe]
```

### Problem: Trạng thái hiển thị không đúng ngôn ngữ
**Solution:** Kiểm tra StatusTranslationService implementation và ngx-translate configuration

### Problem: Type 'never' error
**Solution:** Đảm bảo bạn sử dụng exact type names từ danh sách Status Types ở trên

## Best Practices

1. **Sử dụng constant cho status values:**
```typescript
export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

// Trong component
{{ BookingStatus.CONFIRMED | statusLabel:'booking' }}
```

2. **Nhóm các trạng thái liên quan:**
```html
<div class="status-info">
  <div>{{ booking.status | statusLabel:'booking' }}</div>
  <div>{{ booking.paymentStatus | statusLabel:'payment' }}</div>
</div>
```

3. **Combine với directive hoặc component khác:**
```html
<app-status-badge 
  [status]="bookingStatus | statusLabel:'booking'">
</app-status-badge>
```

## Liên Kết Liên Quan
- [StatusTranslationService Documentation](./STATUS_TRANSLATION_GUIDE.md)
- [Status Translation Keys](../src/app/core/constants/status-translation-keys.ts)
- [Các Pipe Khác](./PIPE_DOCUMENTATION.md)
- [Angular Pipe Documentation](https://angular.io/guide/pipes)

## Implementation Notes

### File Structure
The implementation follows Angular best practices with three separate files:

1. **status-translation-keys.ts** - Pure utility functions that map status values to translation keys
2. **status-translation.service.ts** - Injectable service that provides translated labels with fallback to hardcoded values
3. **status-label.pipe.ts** - Reusable standalone pipe for templates

### Key Features
- ✅ Standalone pipe compatible with both standalone components and traditional modules
- ✅ Support for 11 different status types
- ✅ Fallback mechanism using existing status constants
- ✅ Integration with ngx-translate for multi-language support
- ✅ Pure pipe optimization (runs only when input changes)
- ✅ Type-safe implementation with proper null/undefined handling

### Localization Flow
```
status value → statusLabel pipe → StatusTranslationService 
→ status-translation-keys.ts (get translation key)
→ ngx-translate.instant(key) → translated label
    (or fallback to status.constants.*_LABELS if key not found)
```

### Build Status
- ✅ Successfully compiled with no errors
- ✅ Bundle size optimized with lazy chunk files
- ✅ Ready for production use

---

**Last Updated:** March 2026
**Implementation Status:** ✅ COMPLETED
**Version:** 1.0
