# Fee & Tax Implementation Plan

> **Status**: ✅ Database Layer Complete  
> **Version**: 1.0.0  
> **Date**: March 5, 2026

---

## 📋 Overview

Complete fee and tax system for bus booking platform with:
- **Flexible Configuration**: Per-tenant fee/tax setup
- **Dual Calculation Types**: Fixed amount or percentage-based
- **Smart Application**: Can be applied to ticket price, total booking, or after-discount amount
- **Conditional Rules**: Apply based on conditions (minimum total, ticket count, specific routes, date ranges)
- **Priority-Based**: Multiple fees/taxes applied in order

---

## 🎯 Architecture

### Current Status

#### ✅ Completed
1. **New FeeTax Module** created at `src/module/core/fee-tax/`
   - Schema: `fee-tax.schema.ts`
   - Service: `fee-tax.service.ts`
   - Controller: `fee-tax.controller.ts`
   - DTOs: `fee-tax.dto.ts`
   - Module: `fee-tax.module.ts`

2. **FeeTaxService Methods**
   - `create()` - Create new fee/tax configuration
   - `findByTenant()` - Get all fees/taxes for tenant
   - `findById()` - Get specific fee/tax
   - `update()` - Update fee/tax config
   - `delete()` - Delete fee/tax config
   - `getApplicableFeesTaxes()` - Get applicable fees/taxes for booking
   - `calculateFeesAndTaxes()` - Calculate actual fees/taxes amounts

3. **Booking Schema Updated**
   - Added `appliedFees`: Array of applied fees
   - Added `appliedTaxes`: Array of applied taxes
   - Added `totalFeeAmount`: Sum of all fees
   - Added `totalTaxAmount`: Sum of all taxes
   - Added `finalTotalPrice`: Total including fees & taxes

4. **Core Module Integration**
   - FeeTaxModule added to core.module.ts imports & exports

#### ⏳ Pending (Next Steps)
1. **Booking Service Integration** - Apply fees/taxes during booking creation
2. **Payment Service Update** - Use finalTotalPrice for payment calculation
3. **Promotion Service Interaction** - Ensure promotional discounts work with fees/taxes
4. **Admin Endpoints** - CRUD operations for fee/tax management
5. **Frontend Integration** - Display fees/taxes to users

---

## 🗂️ Project Structure

```
src/module/core/fee-tax/
├── schema/
│   └── fee-tax.schema.ts          # MongoDB schema
├── dto/
│   └── fee-tax.dto.ts             # Data transfer objects
├── fee-tax.service.ts             # Business logic
├── fee-tax.controller.ts          # API endpoints
└── fee-tax.module.ts              # Module definition
```

---

## 📊 Data Model

### FeeTax Schema

```typescript
{
  _id: ObjectId,
  tenantId: ObjectId,                    // Which tenant owns this
  feeType: 'fee' | 'tax',                // Type of charge
  name: string,                          // Display name (e.g., "Booking Fee")
  calculationType: 'fixed' | 'percentage',  // Fixed amount or percentage
  appliedOn: 'ticket_price' | 'total_booking' | 'after_discount',
  value: number,                         // Amount or percentage
  priority: number,                      // Order of application (0-1000)
  enabled: boolean,                      // Is this rule active?
  description?: string,
  conditions?: {
    minTotal?: number,                   // Minimum booking total
    maxTotal?: number,                   // Maximum booking total
    minTickets?: number,                 // Minimum ticket count
    maxTickets?: number,                 // Maximum ticket count
    appliedRoutes?: ObjectId[],          // Apply only on these routes
    excludedRoutes?: ObjectId[],         // Never apply on these routes
  },
  startDate?: Date,                      // Date range
  endDate?: Date,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
}
```

### Booking Schema Updates

```typescript
{
  // ... existing fields ...
  
  appliedFees: [
    { name: string, amount: number, feeType: string }
  ],
  appliedTaxes: [
    { name: string, amount: number, feeType: string }
  ],
  totalFeeAmount: number,            // Sum of all fees
  totalTaxAmount: number,            // Sum of all taxes
  finalTotalPrice: number,           // afterDiscountTotalPrice + fees + taxes
}
```

---

## 🔄 Calculation Flow

### Current Flow (Before Fee/Tax)

```
Ticket Price (1,000,000 VND)
    ↓
Apply Promotion Discount (-200,000 VND)
    ↓
afterDiscountTotalPrice = 800,000 VND
    ↓
Payment Amount = 800,000 VND
```

### New Flow (With Fee/Tax)

```
Ticket Price (1,000,000 VND)
    ↓ [appliedOn: ticket_price]
Apply Promotion Discount (-200,000 VND)
    ↓
afterDiscountTotalPrice = 800,000 VND
    ↓ [appliedOn: after_discount]
Calculate Applicable Fees/Taxes
    ├─ Booking Fee: +5% = 40,000 VND
    ├─ Surcharge: +50,000 fixed
    └─ Tax: +10% = 89,000 VND
        ↓
totalFeeAmount = 90,000 VND
totalTaxAmount = 89,000 VND
    ↓
finalTotalPrice = 800,000 + 90,000 + 89,000 = 979,000 VND
    ↓
Payment Amount = 979,000 VND
```

---

## 📝 Implementation Tasks

### Phase 1: Service Layer (✅ DONE)

- [x] Create FeeTax schema with all fields
- [x] Create FeeTaxService with full CRUD
- [x] Create FeeTaxController for admin management
- [x] Add getApplicableFeesTaxes() method
- [x] Add calculateFeesAndTaxes() method
- [x] Update booking schema with fee/tax fields
- [x] Add FeeTaxModule to CoreModule
- [x] Build verification

**Files Created**:
- `src/module/core/fee-tax/schema/fee-tax.schema.ts`
- `src/module/core/fee-tax/dto/fee-tax.dto.ts`
- `src/module/core/fee-tax/fee-tax.service.ts`
- `src/module/core/fee-tax/fee-tax.controller.ts`
- `src/module/core/fee-tax/fee-tax.module.ts`

**Files Modified**:
- `src/module/core/booking/schema/booking.schema.ts`
- `src/module/core/core.module.ts`

---

### Phase 2: Booking Service Integration (⏳ TODO)

**What to do**:

1. **Update booking.service.ts**
   - Import FeeTaxService
   - In `createBooking()` method, after calculating afterDiscountTotalPrice:
     ```typescript
     const feeTaxCalculation = await this.feeTaxService.calculateFeesAndTaxes(
       tenantId,
       {
         bookingTotal: totalPrice,
         afterDiscountTotal: afterDiscountTotalPrice,
         ticketCount: bookingItems.length,
         routeId: busRouteId,
         tickets: bookingItems.map(item => ({ price: item.price }))
       }
     );
     
     // Update booking with fee/tax data
     booking.appliedFees = feeTaxCalculation.fees;
     booking.appliedTaxes = feeTaxCalculation.taxes;
     booking.totalFeeAmount = feeTaxCalculation.totalFees;
     booking.totalTaxAmount = feeTaxCalculation.totalTaxes;
     booking.finalTotalPrice = feeTaxCalculation.finalTotal;
     ```

2. **Update payment flow**
   - In `payment.service.ts`, use `booking.finalTotalPrice` instead of `afterDiscountTotalPrice`

3. **Update promotion service**
   - When applying promotions, recalculate fees/taxes if they depend on the discounted amount

**Files to Modify**:
- `src/module/core/booking/booking-service.ts`
- `src/module/core/payment/payment-service.ts`
- `src/module/core/promotion/promotion-service.ts` (if needed)

---

### Phase 3: Admin API Endpoints (⏳ TODO)

**Already Implemented in FeeTaxController**:

- `POST /admin/fee-taxes` - Create fee/tax
- `GET /admin/fee-taxes` - List all fees/taxes
- `GET /admin/fee-taxes/:id` - Get specific fee/tax
- `PUT /admin/fee-taxes/:id` - Update fee/tax
- `DELETE /admin/fee-taxes/:id` - Delete fee/tax
- `GET /admin/fee-taxes/calculate/preview` - Preview applicable fees/taxes

**Usage Examples**:

```bash
# Create a fee
POST /admin/fee-taxes
{
  "feeType": "fee",
  "name": "Booking Fee",
  "calculationType": "percentage",
  "appliedOn": "after_discount",
  "value": 5,
  "priority": 10,
  "enabled": true,
  "description": "5% booking platform fee"
}

# Create a conditional tax
POST /admin/fee-taxes
{
  "feeType": "tax",
  "name": "Luxury Tax",
  "calculationType": "percentage",
  "appliedOn": "total_booking",
  "value": 10,
  "priority": 20,
  "enabled": true,
  "conditions": {
    "minTotal": 5000000,  // Only for bookings >= 5M
    "appliedRoutes": ["route_id_1", "route_id_2"]
  }
}

# Preview applicable fees/taxes
GET /admin/fee-taxes/calculate/preview?total=1000000&ticketCount=2&routeId=route_123
```

---

### Phase 4: Database Seeding (⏳ TODO)

**Sample Fee/Tax Configurations**:

```javascript
// Booking Platform Fee
db.fee_taxes.insertOne({
  tenantId: ObjectId("..."),
  feeType: "fee",
  name: "Booking Platform Fee",
  calculationType: "percentage",
  appliedOn: "after_discount",
  value: 5,
  priority: 10,
  enabled: true,
  description: "5% platform processing fee applied after discounts",
  conditions: null,
  createdBy: ObjectId("..."),
  updatedBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})

// Airport Surcharge
db.fee_taxes.insertOne({
  tenantId: ObjectId("..."),
  feeType: "fee",
  name: "Airport Surcharge",
  calculationType: "fixed",
  appliedOn: "total_booking",
  value: 50000,
  priority: 20,
  enabled: true,
  description: "Fixed airport facility surcharge",
  conditions: {
    appliedRoutes: [ObjectId("airport_route_1")]
  },
  createdBy: ObjectId("..."),
  updatedBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})

// VAT
db.fee_taxes.insertOne({
  tenantId: ObjectId("..."),
  feeType: "tax",
  name: "Value Added Tax (VAT)",
  calculationType: "percentage",
  appliedOn: "after_discount",
  value: 10,
  priority: 50,
  enabled: true,
  description: "10% VAT applied on ticket price after discounts",
  conditions: null,
  createdBy: ObjectId("..."),
  updatedBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

### Phase 5: Frontend Integration (⏳ TODO)

**What Frontend Needs to Display**:

```json
{
  "bookingResponse": {
    "booking": {
      "id": "...",
      "totalPrice": 1000000,
      "discountTotalAmount": 200000,
      "afterDiscountTotalPrice": 800000,
      
      "appliedFees": [
        { "name": "Booking Fee", "amount": 40000 }
      ],
      "totalFeeAmount": 40000,
      
      "appliedTaxes": [
        { "name": "VAT 10%", "amount": 84000 }
      ],
      "totalTaxAmount": 84000,
      
      "finalTotalPrice": 924000
    }
  }
}
```

**UI Display Format**:
```
Original Price:           1,000,000 VND
Discount:                   -200,000 VND
────────────────────────────────
Subtotal:                   800,000 VND

Booking Fee (5%):           +40,000 VND
VAT (10%):                  +84,000 VND
────────────────────────────────
TOTAL:                      924,000 VND
```

---

## 🧮 Calculation Examples

### Example 1: Basic Fee + Tax

```
Ticket: 1,000,000 VND
Discount: -200,000 VND
After Discount: 800,000 VND

Applicable Fees/Taxes:
  1. Booking Fee (5% on after_discount): 800,000 × 5% = 40,000 VND
  2. VAT (10% on after_discount): 800,000 × 10% = 80,000 VND

Final: 800,000 + 40,000 + 80,000 = 920,000 VND
```

### Example 2: Conditional Fee

```
Booking Total: 500,000 VND (2 tickets)

Conditions Check:
  - Luxury Tax (10% on total, only if > 5,000,000): NOT APPLIED
  - Standard Fee (3% on after_discount): APPLIED
  
After Discount: 450,000 VND
Standard Fee (3%): 450,000 × 3% = 13,500 VND

Final: 450,000 + 13,500 = 463,500 VND
```

### Example 3: Multiple Tickets with Different Prices

```
Ticket 1: 1,200,000 VND
Ticket 2: 800,000 VND
Total: 2,000,000 VND

Fee Applied Per Ticket (ticket_price):
  - Booking Fee (2% on ticket_price):
    Ticket 1: 1,200,000 × 2% = 24,000 VND
    Ticket 2: 800,000 × 2% = 16,000 VND
    Total Fee: 40,000 VND

Tax Applied On Total (after_discount):
  - VAT (10% on total_booking):
    2,000,000 × 10% = 200,000 VND

Final: 2,000,000 + 40,000 + 200,000 = 2,240,000 VND
```

---

## 🔧 Configuration Examples

### Use Case 1: Travel Agency Model

```javascript
// Standard convenience fee
{
  feeType: "fee",
  name: "Convenience Fee",
  calculationType: "percentage",
  appliedOn: "after_discount",
  value: 3,
  priority: 10
}

// Peak hour surcharge
{
  feeType: "fee",
  name: "Peak Hour Surcharge",
  calculationType: "fixed",
  appliedOn: "total_booking",
  value: 50000,
  conditions: {
    minTotal: 2000000
  },
  priority: 20
}

// VAT
{
  feeType: "tax",
  name: "VAT",
  calculationType: "percentage",
  appliedOn: "after_discount",
  value: 10,
  priority: 50
}
```

### Use Case 2: International Bookings

```javascript
// International booking fee
{
  feeType: "fee",
  name: "International Processing",
  calculationType: "fixed",
  appliedOn: "total_booking",
  value: 100000,
  conditions: {
    appliedRoutes: ["international_routes"]
  }
}

// International VAT
{
  feeType: "tax",
  name: "International Tax",
  calculationType: "percentage",
  appliedOn: "after_discount",
  value: 15
}
```

### Use Case 3: Promotional Period

```javascript
// Reduced fee during promotion
{
  feeType: "fee",
  name: "Promotional Booking Fee",
  calculationType: "percentage",
  appliedOn: "after_discount",
  value: 1,  // Reduced from 3% to 1%
  startDate: "2026-03-01",
  endDate: "2026-03-31"
}
```

---

## ✅ Checklist

### Completed ✅
- [x] FeeTax schema created
- [x] FeeTaxService implemented
- [x] FeeTaxController implemented
- [x] Booking schema updated
- [x] Core module integration
- [x] Build verification passed

### Next Steps ⏳
- [ ] Update booking.service.ts for fee/tax calculation
- [ ] Update payment.service.ts to use finalTotalPrice
- [ ] Update promotion service if needed
- [ ] Create database seed data
- [ ] Test fee/tax calculation logic
- [ ] Implement frontend display
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Deploy to staging
- [ ] UAT testing
- [ ] Production deployment

---

## 📚 API Reference

### Admin Fee/Tax Management

#### Create Fee/Tax
```
POST /admin/fee-taxes
Authorization: Bearer {token}
Content-Type: application/json

{
  "feeType": "fee",
  "name": "Booking Fee",
  "calculationType": "percentage",
  "appliedOn": "after_discount",
  "value": 5,
  "priority": 10,
  "enabled": true
}
```

#### List All Fee/Taxes
```
GET /admin/fee-taxes?enabled=true
Authorization: Bearer {token}
```

#### Get Fee/Tax Details
```
GET /admin/fee-taxes/{id}
Authorization: Bearer {token}
```

#### Update Fee/Tax
```
PUT /admin/fee-taxes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "value": 7,
  "priority": 15
}
```

#### Delete Fee/Tax
```
DELETE /admin/fee-taxes/{id}
Authorization: Bearer {token}
```

#### Calculate Preview
```
GET /admin/fee-taxes/calculate/preview?total=1000000&ticketCount=2
Authorization: Bearer {token}
```

---

## 🚀 Next Immediate Actions

1. **Update Booking Service** - Integrate fee/tax calculation
2. **Test the Flow** - Create booking and verify fee/tax calculation
3. **Database Seed** - Insert sample fee/tax configurations
4. **Frontend Integration** - Display fees/taxes in UI
5. **UAT** - Test with real business scenarios

---

**Version**: 1.0.0  
**Status**: ✅ Phase 1 Complete, Ready for Phase 2  
**Build**: ✅ No Errors
