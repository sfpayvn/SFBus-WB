# Fee & Tax Implementation - Quick Start Guide

**Version**: 1.0.0  
**Date**: March 5, 2026

---

## 🚀 5-Minute Setup

### 1. Access Admin Panel
Navigate to: `/management/fee-tax-management`

### 2. Create Your First Fee/Tax

```
Button: "+ Add Fee/Tax"
↓
Form:
  Type: Fee
  Name: "Booking Platform Fee"
  Applied On: "After Discount"
  Calculation: Percentage (%)
  Value: 5
  Priority: 10
  Active: ✓
↓
Save
```

### 3. Use in Your Component

```typescript
import { FeeTaxService } from 'src/app/shared/services/fee-tax.service';
import { BookingWithFeeTax } from 'src/app/shared/models/fee-tax/fee-tax.model';

export class MyComponent {
  constructor(private feeTaxService: FeeTaxService) {}

  calculatePrice() {
    this.feeTaxService.calculateFeeTaxes({
      bookingTotal: 1000000,
      afterDiscountTotal: 800000,
      ticketCount: 2,
      routeId: 'route_123'
    }).subscribe(result => {
      this.booking.finalTotalPrice = result.finalTotal;
    });
  }
}
```

### 4. Display Breakdown

```html
<app-booking-fee-tax-breakdown [booking]="booking"></app-booking-fee-tax-breakdown>
```

---

## 📋 Most Common Operations

### Get All Fees/Taxes
```typescript
this.feeTaxService.listFeeTaxes().subscribe(configs => {
  console.log(configs);
});
```

### Create New
```typescript
const feeTax = {
  feeType: 'fee',
  name: 'My Fee',
  calculationType: 'percentage',
  appliedOn: 'after_discount',
  value: 5,
  priority: 10,
  enabled: true
};
this.feeTaxService.createFeeTax(feeTax).subscribe(...);
```

### Update Existing
```typescript
this.feeTaxService.updateFeeTax(id, { value: 7 }).subscribe(...);
```

### Delete
```typescript
this.feeTaxService.deleteFeeTax(id).subscribe(...);
```

### Calculate (Remote)
```typescript
this.feeTaxService.calculateFeeTaxes(request).subscribe(result => {
  // result.fees
  // result.taxes
  // result.finalTotal
});
```

### Calculate (Local - No API Call)
```typescript
const result = this.feeTaxService.calculateLocalFeeTaxes(
  800000,          // base amount
  configs,         // fee/tax configurations
  { ticketCount: 2, routeId: 'route_123' }
);
```

---

## 🎨 Using FeeTaxUtilityService

```typescript
import { FeeTaxUtilityService } from 'src/app/shared/services/fee-tax-utility.service';

export class MyComponent {
  constructor(private utility: FeeTaxUtilityService) {}

  example() {
    // Format labels
    this.utility.getFeeTypeLabel('fee');           // "Fee"
    this.utility.getAppliedOnLabel('after_discount'); // "After Discount"

    // Format values
    this.utility.formatValue(feeTax);              // "5%"
    this.utility.formatCurrency(100000);           // "100,000 VND"

    // Validation
    const { valid, errors } = this.utility.validateFeeTaxConfig(feeTax);

    // Calculations
    const amount = this.utility.calculateAmount(feeTax, 1000000);

    // Sorting
    const sorted = this.utility.sortByPriority(configs);

    // Grouping
    const grouped = this.utility.groupByType(configs);
  }
}
```

---

## 💡 Common Use Cases

### Use Case 1: 5% Booking Fee
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

### Use Case 2: Fixed Airport Surcharge
```typescript
{
  feeType: 'fee',
  name: 'Airport Surcharge',
  calculationType: 'fixed',
  appliedOn: 'total_booking',
  value: 50000,
  priority: 20,
  enabled: true,
  conditions: {
    appliedRoutes: ['airport_route_1']
  }
}
```

### Use Case 3: 10% VAT
```typescript
{
  feeType: 'tax',
  name: 'Value Added Tax',
  calculationType: 'percentage',
  appliedOn: 'after_discount',
  value: 10,
  priority: 50,
  enabled: true
}
```

### Use Case 4: Seasonal Surcharge
```typescript
{
  feeType: 'fee',
  name: 'Holiday Surcharge',
  calculationType: 'fixed',
  appliedOn: 'total_booking',
  value: 100000,
  priority: 15,
  enabled: true,
  startDate: '2026-12-15',
  endDate: '2027-01-05'
}
```

### Use Case 5: Luxury Tax (Conditional)
```typescript
{
  feeType: 'tax',
  name: 'Luxury Tax',
  calculationType: 'percentage',
  appliedOn: 'total_booking',
  value: 10,
  priority: 40,
  enabled: true,
  conditions: {
    minTotal: 5000000,  // Only for bookings >= 5M
    appliedRoutes: ['luxury_route_1', 'luxury_route_2']
  }
}
```

---

## 🔍 Key Interfaces

```typescript
// Main configuration
interface FeeTaxConfig {
  id?: string;
  tenantId?: string;
  feeType: 'fee' | 'tax';
  name: string;
  calculationType: 'fixed' | 'percentage';
  appliedOn: 'ticket_price' | 'total_booking' | 'after_discount';
  value: number;
  priority: number;      // 0-1000
  enabled: boolean;
  description?: string;
  conditions?: FeeCondition;
  startDate?: Date;
  endDate?: Date;
}

// Booking with fees/taxes
interface BookingWithFeeTax {
  id: string;
  totalPrice: number;
  discountTotalAmount?: number;
  afterDiscountTotalPrice: number;
  appliedFees: AppliedFee[];
  appliedTaxes: AppliedTax[];
  totalFeeAmount: number;
  totalTaxAmount: number;
  finalTotalPrice: number;
}

// Request/Response for calculation
interface CalculateFeeTaxRequest {
  bookingTotal: number;
  afterDiscountTotal: number;
  ticketCount: number;
  routeId?: string;
}

interface CalculateFeeTaxResponse {
  fees: AppliedFee[];
  taxes: AppliedTax[];
  totalFees: number;
  totalTaxes: number;
  finalTotal: number;
}
```

---

## ⚙️ Configuration Tips

### Priority Assignment
```
Fees:         10-30    ← Applied first
Surcharges:   31-49
Taxes:        50-70    ← Applied last
Special:      71-100
```

### When to use each appliedOn type

| Type | Use When | Example |
|------|----------|---------|
| `ticket_price` | Fee applies to each ticket individually | Booking fee per ticket |
| `total_booking` | Fee applies to total before discount | Airport surcharge |
| `after_discount` | Fee applies to discounted amount | Platform fee, VAT |

---

## ✅ Testing Your Implementation

```typescript
// Test 1: Create fee/tax
function testCreate() {
  const feeTax = { ... };
  feeTaxService.createFeeTax(feeTax).subscribe(
    result => console.log('✓ Created:', result),
    error => console.error('✗ Error:', error)
  );
}

// Test 2: Calculate fees/taxes
function testCalculation() {
  feeTaxService.calculateFeeTaxes({
    bookingTotal: 1000000,
    afterDiscountTotal: 800000,
    ticketCount: 2,
    routeId: 'route_123'
  }).subscribe(result => {
    console.log('✓ Fees:', result.totalFees);
    console.log('✓ Taxes:', result.totalTaxes);
    console.log('✓ Final:', result.finalTotal);
  });
}

// Test 3: Check conditional application
function testConditional() {
  const utility = new FeeTaxUtilityService();
  const applied = utility.shouldApply(feeTax, {
    total: 6000000,
    ticketCount: 3,
    routeId: 'airport_route_1'
  });
  console.log('✓ Should apply?', applied);
}
```

---

## 📞 Troubleshooting

### Issue: Fee/Tax not applying

**Check:**
1. Is it `enabled: true`?
2. Is current date within `startDate` and `endDate`?
3. Do conditions match? (min/max totals, routes)
4. Is priority set correctly?

**Debug:**
```typescript
const utility = new FeeTaxUtilityService();
console.log('Valid?', utility.validateFeeTaxConfig(feeTax).valid);
console.log('Should apply?', utility.shouldApply(feeTax, context));
console.log('Amount:', utility.calculateAmount(feeTax, baseAmount));
```

### Issue: Components not loading

**Check:**
1. Is routing module properly imported?
2. Are components declared in the module?
3. Check browser console for errors

### Issue: Wrong calculation

**Debug:**
```typescript
// Get actual configs
feeTaxService.listFeeTaxes().subscribe(configs => {
  // Check if correct configs are returned
  configs.forEach(c => console.log(c.name, c.enabled, c.priority));
  
  // Local calculation for verification
  const result = feeTaxService.calculateLocalFeeTaxes(base, configs);
  console.log('Local result:', result);
});
```

---

## 🎯 Next Integrations

### 1. Booking Module
- Import FeeTaxService
- Call after calculating discount
- Add fees/taxes to booking total

### 2. Payment Module
- Use `booking.finalTotalPrice` instead of `afterDiscountTotalPrice`
- Display breakdown before payment

### 3. Confirmation Email
- Include fee/tax breakdown
- Show for transparency

### 4. Reports/Analytics
- Track fee/tax collection
- Analyze by type and period

---

## 📚 Additional Resources

- **Full Documentation**: `docs/FEE_TAX_FRONTEND_IMPLEMENTATION.md`
- **Implementation Summary**: `docs/FEE_TAX_IMPLEMENTATION_SUMMARY.md`
- **Original Plan**: `docs/FEE_TAX_IMPLEMENTATION.md`
- **Source Code**: `src/app/modules/management/modules/fee-tax-management/`

---

**Ready to integrate? Start with Use Case 1 above!** 🚀
