# Fee & Tax Management Implementation

## Overview

This implementation provides a complete fee and tax management system for the SFBus-WB Angular frontend application. The system allows administrators to configure, manage, and apply various fees and taxes to bookings.

## Architecture

### Directory Structure

```
src/app/
├── shared/
│   ├── models/
│   │   └── fee-tax/
│   │       └── fee-tax.model.ts          # Data models and interfaces
│   └── services/
│       └── fee-tax.service.ts            # API service for fee/tax operations
└── modules/
    └── management/
        └── modules/
            └── fee-tax-management/
                ├── pages/
                │   └── fee-tax-list/     # Main admin page
                ├── components/
                │   └── booking-fee-tax-breakdown.component.ts  # Reusable breakdown display
                ├── fee-tax-management.module.ts
                └── fee-tax-management-routing.module.ts
```

### Key Files

1. **fee-tax.model.ts** - Data structures:
   - `FeeTaxConfig` - Fee/Tax configuration
   - `AppliedFee` / `AppliedTax` - Applied fees/taxes on bookings
   - `BookingWithFeeTax` - Booking with fees/taxes included
   - `CalculateFeeTaxRequest` / `CalculateFeeTaxResponse` - Calculation DTOs

2. **fee-tax.service.ts** - API operations:
   - `createFeeTax()` - Create new fee/tax
   - `listFeeTaxes()` - Get all configurations
   - `getFeeTax()` - Get specific fee/tax
   - `updateFeeTax()` - Update configuration
   - `deleteFeeTax()` - Delete configuration
   - `calculateFeeTaxes()` - Calculate fees/taxes for a booking
   - `calculateLocalFeeTaxes()` - Local calculation without API call

3. **fee-tax-list.component.ts** - Admin interface for managing fees/taxes

4. **booking-fee-tax-breakdown.component.ts** - Reusable component for displaying fees/taxes breakdown

## Data Models

### FeeTaxConfig

```typescript
interface FeeTaxConfig {
  id?: string;
  tenantId?: string;
  feeType: 'fee' | 'tax';              // Type of charge
  name: string;                         // Display name
  calculationType: 'fixed' | 'percentage'; // Calculation method
  appliedOn: 'ticket_price' | 'total_booking' | 'after_discount';
  value: number;                        // Amount or percentage
  priority: number;                     // Order of application (0-1000)
  enabled: boolean;                     // Is active?
  description?: string;
  conditions?: FeeCondition;            // Conditional rules
  startDate?: Date | string;
  endDate?: Date | string;
}
```

### FeeCondition

```typescript
interface FeeCondition {
  minTotal?: number;          // Minimum booking total
  maxTotal?: number;          // Maximum booking total
  minTickets?: number;        // Minimum ticket count
  maxTickets?: number;        // Maximum ticket count
  appliedRoutes?: string[];   // Apply on specific routes
  excludedRoutes?: string[];  // Exclude specific routes
}
```

### BookingWithFeeTax

```typescript
interface BookingWithFeeTax {
  id: string;
  totalPrice: number;
  discountTotalAmount?: number;
  afterDiscountTotalPrice: number;
  appliedFees: AppliedFee[];
  appliedTaxes: AppliedTax[];
  totalFeeAmount: number;
  totalTaxAmount: number;
  finalTotalPrice: number;              // Final amount to pay
}
```

## Usage Guide

### 1. Injecting FeeTaxService

```typescript
import { FeeTaxService } from 'src/app/shared/services/fee-tax.service';

constructor(private feeTaxService: FeeTaxService) {}
```

### 2. Creating a Fee/Tax Configuration

```typescript
const feeTaxConfig: FeeTaxConfig = {
  feeType: 'fee',
  name: 'Booking Platform Fee',
  calculationType: 'percentage',
  appliedOn: 'after_discount',
  value: 5,  // 5%
  priority: 10,
  enabled: true,
  description: 'Standard booking platform fee'
};

this.feeTaxService.createFeeTax(feeTaxConfig).subscribe(
  (created) => console.log('Fee/Tax created:', created),
  (error) => console.error('Error:', error)
);
```

### 3. Fetching All Fees/Taxes

```typescript
this.feeTaxService.listFeeTaxes({ enabled: true }).subscribe(
  (feeTaxes) => {
    console.log('Available fees/taxes:', feeTaxes);
  },
  (error) => console.error('Error:', error)
);
```

### 4. Calculating Fees/Taxes for a Booking

#### Option A: Remote Calculation (via Backend API)

```typescript
const calculation = {
  bookingTotal: 1000000,
  afterDiscountTotal: 800000,
  ticketCount: 2,
  routeId: 'route_123'
};

this.feeTaxService.calculateFeeTaxes(calculation).subscribe(
  (result) => {
    console.log('Fees:', result.fees);
    console.log('Taxes:', result.taxes);
    console.log('Final total:', result.finalTotal);
  },
  (error) => console.error('Error:', error)
);
```

#### Option B: Local Calculation (No API Call)

```typescript
// First get all fee/tax configs
this.feeTaxService.listFeeTaxes().subscribe((configs) => {
  const result = this.feeTaxService.calculateLocalFeeTaxes(
    800000,  // Base amount (after discount)
    configs,
    { ticketCount: 2, routeId: 'route_123' }
  );

  console.log('Local calculation result:', result);
  // result = { fees: [...], taxes: [...], totalFees: 0, totalTaxes: 0 }
});
```

### 5. Displaying Fee/Tax Breakdown in Booking

```typescript
// In your booking detail/confirmation component template:
<app-booking-fee-tax-breakdown 
  [booking]="bookingData"
  [compact]="false">
</app-booking-fee-tax-breakdown>

// In component:
import { BookingWithFeeTax } from 'src/app/shared/models/fee-tax/fee-tax.model';

export class BookingDetailComponent {
  bookingData: BookingWithFeeTax = {
    id: 'booking_123',
    totalPrice: 1000000,
    discountTotalAmount: 200000,
    afterDiscountTotalPrice: 800000,
    appliedFees: [
      { name: 'Booking Fee', amount: 40000, feeType: 'fee', calculationType: 'percentage', value: 5 }
    ],
    appliedTaxes: [
      { name: 'VAT 10%', amount: 84000, feeType: 'tax', calculationType: 'percentage', value: 10 }
    ],
    totalFeeAmount: 40000,
    totalTaxAmount: 84000,
    finalTotalPrice: 924000
  };
}
```

## Features

### Admin Interface

Access the fee/tax admin at: `/management/fee-tax-management`

Features:
- **List & Filter** - View all fees/taxes with filters for type and status
- **Create** - Add new fee/tax configurations
- **Edit** - Modify existing configurations
- **Delete** - Remove configurations
- **View Details** - See full details including conditions
- **Enable/Disable** - Activate or deactivate configurations

### Reusable Components

#### BookingFeeTaxBreakdownComponent

Display a formatted breakdown of fees and taxes for a booking.

**Props:**
- `@Input() booking: BookingWithFeeTax` - Booking data with fees/taxes
- `@Input() compact: boolean` - Whether to show compact view (default: false)

**Usage:**
```html
<app-booking-fee-tax-breakdown 
  [booking]="myBooking"
  [compact]="false">
</app-booking-fee-tax-breakdown>
```

## Calculation Flow

### Priority-Based Application

Fees and taxes are applied in order of priority (0-1000):

1. Filter applicable fees/taxes based on:
   - Enabled status
   - Current date range
   - Conditions (min/max amounts, ticket count, routes)

2. Sort by priority (ascending)

3. Apply each fee/tax to working amount:
   - **Fixed**: Add fixed amount
   - **Percentage**: Calculate as percentage of working amount

### Applied On Types

- **ticket_price** - Applied to individual ticket prices
- **total_booking** - Applied to total booking amount (before discount)
- **after_discount** - Applied to amount after discount is calculated

## Configuration Examples

### Example 1: Standard Booking Fee

```typescript
{
  feeType: 'fee',
  name: 'Booking Platform Fee',
  calculationType: 'percentage',
  appliedOn: 'after_discount',
  value: 5,
  priority: 10,
  enabled: true
}
```

### Example 2: Conditional Luxury Tax

```typescript
{
  feeType: 'tax',
  name: 'Luxury Tax',
  calculationType: 'percentage',
  appliedOn: 'total_booking',
  value: 10,
  priority: 20,
  enabled: true,
  conditions: {
    minTotal: 5000000,  // Only for bookings >= 5M
    appliedRoutes: ['route_airport_1', 'route_airport_2']
  }
}
```

### Example 3: Seasonal Surcharge

```typescript
{
  feeType: 'fee',
  name: 'Holiday Surcharge',
  calculationType: 'fixed',
  appliedOn: 'total_booking',
  value: 100000,  // Fixed 100K
  priority: 15,
  enabled: true,
  startDate: '2026-12-15',
  endDate: '2027-01-05'
}
```

## Integration with Booking Module

When creating/confirming a booking:

1. Calculate booking price after discount
2. Use `FeeTaxService.calculateFeeTaxes()` to get applicable fees/taxes
3. Add fees/taxes to booking total
4. Display breakdown using `BookingFeeTaxBreakdownComponent`
5. Process payment with `finalTotalPrice`

## API Endpoints (Backend)

```
POST   /admin/fee-taxes              - Create fee/tax
GET    /admin/fee-taxes              - List all fees/taxes
GET    /admin/fee-taxes/:id          - Get specific fee/tax
PUT    /admin/fee-taxes/:id          - Update fee/tax
DELETE /admin/fee-taxes/:id          - Delete fee/tax
GET    /admin/fee-taxes/calculate/preview - Calculate preview
```

## Menu Integration

The fee-tax management is automatically added to the management menu when the user has permission to access `FEE_TAX_MANAGEMENT` module.

To find the menu configuration, check:
- `src/app/core/constants/menu-admin.ts` - For admin menu
- `src/app/core/constants/menu-tenant.ts` - For tenant menu

## Module Dependencies

The fee-tax-management module depends on:
- CommonModule
- ReactiveFormsModule
- FormsModule
- Ng-Zorro UI components (Table, Modal, Select, Button, etc.)

## Best Practices

1. **Priority Assignment**:
   - Fees: 10-30
   - Taxes: 40-60
   - Special charges: 70-90

2. **Naming Convention**:
   - Use descriptive names: "Platform Booking Fee", "VAT 10%"
   - Avoid vague names: "Fee 1", "Tax A"

3. **Conditions**:
   - Use specific route filtering for location-based fees
   - Set date ranges for seasonal charges
   - Use minimum totals to avoid applying to small bookings

4. **Testing**:
   - Test with different booking amounts
   - Verify conditional fees apply correctly
   - Check priority order is maintained
   - Validate percentage vs fixed calculations

## Future Enhancements

- Bulk upload of fee/tax configurations
- Fee/tax templates for quick setup
- Analytics dashboard for fee collection
- A/B testing different fee strategies
- Advanced scheduling with complex date ranges
- Fee/tax cascading logic
