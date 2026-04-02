/**
 * Fee/Tax Models and Interfaces
 * Defines data structures for fee and tax configurations
 */

/**
 * Type of fee/tax charge
 */
export type FeeType = 'fee' | 'tax';

/**
 * Calculation method for fee/tax
 */
export type CalculationType = 'fixed' | 'percentage';

/**
 * Fields to apply fee/tax on
 */
export type AppliedOn = 'ticket_price' | 'total_booking' | 'after_discount';

/**
 * Conditions for applying fees/taxes
 */
export interface FeeCondition {
  minTotal?: number; // Minimum booking total
  maxTotal?: number; // Maximum booking total
  minTickets?: number; // Minimum ticket count
  maxTickets?: number; // Maximum ticket count
  appliedRoutes?: string[]; // Apply only on these route IDs
  excludedRoutes?: string[]; // Never apply on these route IDs
}

/**
 * Fee/Tax Configuration
 */
export interface FeeTaxConfig {
  _id?: string; // MongoDB ObjectId
  tenantId?: string; // Tenant ID
  feeType: FeeType; // 'fee' or 'tax'
  name: string; // Display name (e.g., "Booking Fee")
  calculationType: CalculationType; // 'fixed' or 'percentage'
  appliedOn: AppliedOn; // Field to apply on
  value: number; // Amount (fixed) or percentage
  priority: number; // Order of application (0-1000), lower applies first
  enabled: boolean; // Is this rule active?
  description?: string; // Description
  conditions?: FeeCondition; // Conditional rules
  startDate?: Date | string; // Date range start
  endDate?: Date | string; // Date range end
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Applied Fee item (what was actually applied to a booking)
 */
export interface AppliedFee {
  _id?: string;
  name: string;
  amount: number;
  feeType: FeeType;
  calculationType: CalculationType;
  value: number;
}

/**
 * Applied Tax item (what was actually applied to a booking)
 */
export interface AppliedTax {
  id?: string;
  name: string;
  amount: number;
  feeType: FeeType;
  calculationType: CalculationType;
  value: number;
}

/**
 * Booking with fees and taxes
 */
export interface BookingWithFeeTax {
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

/**
 * Request for calculating fees/taxes
 */
export interface CalculateFeeTaxRequest {
  bookingTotal: number;
  afterDiscountTotal: number;
  ticketCount: number;
  routeId?: string;
  tickets?: Array<{ price: number }>;
}

/**
 * Response from calculating fees/taxes
 */
export interface CalculateFeeTaxResponse {
  fees: AppliedFee[];
  taxes: AppliedTax[];
  totalFees: number;
  totalTaxes: number;
  finalTotal: number;
}

/**
 * Fee/Tax List View Model
 */
export interface FeeTaxListItem extends FeeTaxConfig {
  statusLabel: string;
  appliedOnLabel: string;
  calculationTypeLabel: string;
  feeTypeLabel: string;
}
