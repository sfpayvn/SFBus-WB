# Fee & Tax Integration Checklist

**Version**: 1.0.0  
**Status**: Ready for Integration  
**Date**: March 5, 2026

---

## 📝 Pre-Integration Checklist

### Preparation
- [ ] Read quick start guide: `docs/FEE_TAX_QUICK_START.md`
- [ ] Review data models: `src/app/shared/models/fee-tax/fee-tax.model.ts`
- [ ] Review service methods: `src/app/shared/services/fee-tax.service.ts`
- [ ] Have backend API endpoints ready (see API Reference section)
- [ ] Test fee/tax admin panel at `/management/fee-tax-management`

---

## 🔌 Integration Steps

### Step 1: Booking Service Integration

**File**: `src/app/modules/booking/booking.service.ts`

- [ ] Import `FeeTaxService`
- [ ] After calculating `afterDiscountTotalPrice`, call:

```typescript
const feeTaxResult = await this.feeTaxService.calculateFeeTaxes({
  bookingTotal: this.totalPrice,
  afterDiscountTotal: afterDiscountTotalPrice,
  ticketCount: bookingItems.length,
  routeId: this.busRouteId
}).toPromise();

// Add to booking
booking.appliedFees = feeTaxResult.fees;
booking.appliedTaxes = feeTaxResult.taxes;
booking.totalFeeAmount = feeTaxResult.totalFees;
booking.totalTaxAmount = feeTaxResult.totalTaxes;
booking.finalTotalPrice = feeTaxResult.finalTotal;
```

- [ ] Update booking model to include fee/tax fields (if not already done)
- [ ] Test with sample booking data
- [ ] Verify calculations are correct

### Step 2: Payment Service Integration

**File**: `src/app/modules/payment/payment.service.ts`

- [ ] Update payment amount calculation to use `booking.finalTotalPrice`
- [ ] Change from: `paymentAmount = booking.afterDiscountTotalPrice`
- [ ] Change to: `paymentAmount = booking.finalTotalPrice`
- [ ] Verify payment is calculated correctly
- [ ] Test end-to-end payment flow

### Step 3: Booking Confirmation/Detail Page

**File**: `src/app/modules/booking/pages/booking-detail.component.ts` (or similar)

- [ ] Import `BookingFeeTaxBreakdownComponent`
- [ ] Import `FeeTaxManagementModule` in your module
- [ ] Add to component template:

```html
<app-booking-fee-tax-breakdown 
  [booking]="bookingData"
  [compact]="false">
</app-booking-fee-tax-breakdown>
```

- [ ] Verify breakdown displays correctly
- [ ] Check styling matches your design
- [ ] Test responsive design

### Step 4: Booking Confirmation Email

**File**: `src/app/modules/booking/templates/booking-confirmation.email.ts` (if exists)

- [ ] Include fees/taxes breakdown in email
- [ ] Format values as currency
- [ ] Show clear breakdown of charges

Template example:
```
Original Price:        1,000,000 VND
Discount:                -200,000 VND
Subtotal:                800,000 VND

Booking Fee (5%):        +40,000 VND
VAT (10%):               +84,000 VND

TOTAL PAYABLE:           924,000 VND
```

- [ ] Test email generation
- [ ] Verify formatting

### Step 5: Promotion Service Update (If Needed)

**File**: `src/app/modules/promotion/promotion.service.ts`

- [ ] Check if fees/taxes depend on discounted amount
- [ ] If yes, recalculate fees/taxes after applying promotion
- [ ] Update promotion application logic if needed
- [ ] Test promotions + fees/taxes interaction

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] FeeTaxService.createFeeTax() works
- [ ] FeeTaxService.listFeeTaxes() returns correct data
- [ ] FeeTaxService.calculateFeeTaxes() calculates correctly
- [ ] FeeTaxUtilityService validation works
- [ ] Local calculation matches API calculation

### Integration Tests

- [ ] Booking created with fees/taxes
- [ ] Discount + fees interaction correct
- [ ] Payment amount includes fees/taxes
- [ ] Multiple fees/taxes applied in correct order
- [ ] Conditional fees apply correctly

### UI/UX Tests

- [ ] Admin panel loads without errors
- [ ] Can create/edit/delete fees/taxes
- [ ] Breakdown component displays correctly
- [ ] Currency formatting is correct
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error messages display properly
- [ ] Loading states show

### End-to-End Tests

- [ ] Create booking → fees/taxes applied → payment processed
- [ ] Apply discount → fees/taxes recalculated
- [ ] Seasonal fee (date range) works
- [ ] Conditional fee (route-based) works
- [ ] Email includes fees/taxes breakdown
- [ ] Admin can manage fees/taxes
- [ ] Fee/tax disabled → not applied

---

## 📋 Data Validation Tests

| Scenario | Expected Result | Test Status |
|----------|-----------------|-------------|
| 5% fee on 1,000,000 | 50,000 added | ☐ |
| 10% tax on 800,000 | 80,000 added | ☐ |
| Fixed 100K surcharge | 100,000 added | ☐ |
| Multiple fees applied | All fees added | ☐ |
| Conditional fee (min total not met) | Fee not applied | ☐ |
| Conditional fee (route match) | Fee applied | ☐ |
| Fee with start date past | Fee applied | ☐ |
| Fee with end date past | Fee not applied | ☐ |
| Disabled fee | Fee not applied | ☐ |
| Priority ordering | Correct order applied | ☐ |

---

## 🔄 Workflow Verification

### Booking Creation Workflow

```
1. User selects tickets → totalPrice calculated
   [ ] Verify: totalPrice correct

2. Apply discount → afterDiscountTotalPrice calculated
   [ ] Verify: discount applied correctly

3. Calculate fees/taxes
   [ ] Verify: API call made
   [ ] Verify: Correct fees/taxes returned
   [ ] Verify: finalTotalPrice correct

4. Display breakdown
   [ ] Verify: Component shows all items
   [ ] Verify: Formatting correct
   [ ] Verify: Math adds up

5. Payment
   [ ] Verify: Amount = finalTotalPrice
   [ ] Verify: Payment processed
```

---

## 📊 Example Test Data

### Test Fee Configuration 1
```javascript
{
  feeType: 'fee',
  name: 'TEST: Booking Fee 5%',
  calculationType: 'percentage',
  appliedOn: 'after_discount',
  value: 5,
  priority: 10,
  enabled: true
}
```

### Test Fee Configuration 2
```javascript
{
  feeType: 'tax',
  name: 'TEST: VAT 10%',
  calculationType: 'percentage',
  appliedOn: 'after_discount',
  value: 10,
  priority: 50,
  enabled: true
}
```

### Test Booking
```javascript
{
  totalPrice: 1000000,
  discountTotalAmount: 200000,
  afterDiscountTotalPrice: 800000,
  // After calculation:
  appliedFees: [
    { name: 'TEST: Booking Fee 5%', amount: 40000 }
  ],
  appliedTaxes: [
    { name: 'TEST: VAT 10%', amount: 84000 }
  ],
  totalFeeAmount: 40000,
  totalTaxAmount: 84000,
  finalTotalPrice: 924000
}
```

---

## 🚨 Common Issues & Solutions

### Issue: Fees not calculated
**Solution:**
```typescript
// 1. Check if fees/taxes exist
feeTaxService.listFeeTaxes().subscribe(configs => {
  console.log('Configs:', configs);
});

// 2. Check if calculateFeeTaxes is called
// 3. Check if fees/taxes are enabled
// 4. Check conditions match
```

### Issue: Wrong calculation
**Solution:**
```typescript
// Verify using local calculation
const result = feeTaxService.calculateLocalFeeTaxes(
  800000,
  configs,
  { ticketCount: 2, routeId: 'route_123' }
);
console.log(result);
```

### Issue: Component not displaying
**Solution:**
1. Check module imports `FeeTaxManagementModule`
2. Check component is declared
3. Check booking data has fee/tax fields
4. Check template syntax

### Issue: Price calculations off
**Solution:**
1. Verify `totalPrice` is correct
2. Verify `discountTotalAmount` is correct
3. Verify `afterDiscountTotalPrice` is correct
4. Verify fees/taxes calculated on correct amount

---

## 📞 API Integration

### Required Backend Endpoints

```
GET    /admin/fee-taxes                    - List all fees/taxes
POST   /admin/fee-taxes                    - Create fee/tax
POST   /admin/fee-taxes/calculate/preview  - Calculate fees/taxes
```

**Endpoint 1: Calculate Fees/Taxes**
```
POST /admin/fee-taxes/calculate/preview

Request Body:
{
  bookingTotal: number,
  afterDiscountTotal: number,
  ticketCount: number,
  routeId?: string
}

Response:
{
  fees: [
    { name: string, amount: number, ... }
  ],
  taxes: [
    { name: string, amount: number, ... }
  ],
  totalFees: number,
  totalTaxes: number,
  finalTotal: number
}
```

- [ ] Backend endpoint implemented
- [ ] Response matches interface
- [ ] Error handling works
- [ ] Performance is acceptable

---

## 🎯 Completion Criteria

**All of the following must be true:**

- [ ] Fee/tax admin panel is functional
- [ ] Can create and manage fees/taxes
- [ ] Booking service correctly applies fees/taxes
- [ ] Payment uses final total with fees/taxes
- [ ] Breakdown displays correctly on confirmation
- [ ] All calculations verified as correct
- [ ] All unit/integration/E2E tests pass
- [ ] Responsive design works
- [ ] No console errors
- [ ] Performance is acceptable (<100ms for calculations)

---

## 🚀 Go-Live Checklist

### Pre-Deployment
- [ ] All tests passing (100%)
- [ ] Code review completed
- [ ] Performance tested (load tests)
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Team trained on new feature
- [ ] Rollback plan prepared

### Deployment
- [ ] Deploy to staging environment
- [ ] Run full test suite on staging
- [ ] UAT testing completed
- [ ] Performance monitoring in place
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Monitor calculations accuracy
- [ ] Monitor payment processing

### Post-Deployment
- [ ] Monitor for issues (24 hours)
- [ ] Verify calculations in production
- [ ] Verify payment amounts correct
- [ ] Verify email breakdowns display
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Follow up on performance metrics

---

## 📞 Support Contacts

- **Frontend Issues**: Check `docs/FEE_TAX_QUICK_START.md`
- **Integration Help**: Review integration checklist above
- **API Issues**: Contact backend team
- **Bugs**: Create issue with reproduction steps

---

## 📚 Additional Resources

1. **Quick Start**: `docs/FEE_TAX_QUICK_START.md`
2. **Full Documentation**: `docs/FEE_TAX_FRONTEND_IMPLEMENTATION.md`
3. **Implementation Summary**: `docs/FEE_TAX_IMPLEMENTATION_SUMMARY.md`
4. **Original Plan**: `docs/FEE_TAX_IMPLEMENTATION.md`
5. **Source Code**: `src/app/modules/management/modules/fee-tax-management/`

---

**Last Updated**: March 5, 2026  
**Status**: ✅ Ready for Integration
