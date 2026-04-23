/**
 * Fee/Tax Utility Service
 * Helper functions for fee/tax operations and display
 */

import { Injectable } from '@angular/core';
import { FeeType, CalculationType, AppliedOn, FeeTaxConfig, AppliedFee, AppliedTax } from '../models/fee-tax.model';

@Injectable({
  providedIn: 'root',
})
export class FeeTaxUtilityService {
  /**
   * Get human-readable label for fee type
   */
  getFeeTypeLabel(feeType: FeeType): string {
    const labels: Record<FeeType, string> = {
      fee: 'Fee',
      tax: 'Tax',
    };
    return labels[feeType] || feeType;
  }

  /**
   * Get badge color for fee type
   */
  getFeeTypeBadgeColor(feeType: FeeType): string {
    const colors: Record<FeeType, string> = {
      fee: 'blue',
      tax: 'orange',
    };
    return colors[feeType] || 'default';
  }

  /**
   * Get human-readable label for calculation type
   */
  getCalculationTypeLabel(type: CalculationType): string {
    const labels: Record<CalculationType, string> = {
      fixed: 'Fixed Amount',
      percentage: 'Percentage (%)',
    };
    return labels[type] || type;
  }

  /**
   * Get human-readable label for appliedOn
   */
  getAppliedOnLabel(appliedOn: AppliedOn): string {
    const labels: Record<AppliedOn, string> = {
      ticket_price: 'Ticket Price',
      total_booking: 'Total Booking',
      after_discount: 'After Discount',
    };
    return labels[appliedOn] || appliedOn;
  }

  /**
   * Format value for display based on calculation type
   */
  formatValue(feeTax: FeeTaxConfig): string {
    if (feeTax.calculationType === 'fixed') {
      return `${this.formatCurrency(feeTax.value)}`;
    }
    return `${feeTax.value}%`;
  }

  /**
   * Format currency value
   */
  formatCurrency(amount: number, currency: string = 'VND'): string {
    return `${amount.toLocaleString('en-US')} ${currency}`;
  }

  /**
   * Check if fee/tax should be applied
   */
  shouldApply(feeTax: FeeTaxConfig, context?: any): boolean {
    const now = new Date();

    // Check enabled
    if (!feeTax.enabled) return false;

    // Check date range
    if (feeTax.startDate && new Date(feeTax.startDate) > now) return false;
    if (feeTax.endDate && new Date(feeTax.endDate) < now) return false;

    // Check conditions if provided
    if (feeTax.conditions && context) {
      const conditions = feeTax.conditions;

      if (conditions.minTotal && context.total < conditions.minTotal) return false;
      if (conditions.maxTotal && context.total > conditions.maxTotal) return false;
      if (conditions.minTickets && context.ticketCount && context.ticketCount < conditions.minTickets) return false;
      if (conditions.maxTickets && context.ticketCount && context.ticketCount > conditions.maxTickets) return false;
      if (
        conditions.appliedRoutes &&
        conditions.appliedRoutes.length > 0 &&
        !conditions.appliedRoutes.includes(context.routeId)
      )
        return false;
      if (
        conditions.excludedRoutes &&
        conditions.excludedRoutes.length > 0 &&
        conditions.excludedRoutes.includes(context.routeId)
      )
        return false;
    }

    return true;
  }

  /**
   * Calculate amount for a single fee/tax
   */
  calculateAmount(feeTax: FeeTaxConfig, baseAmount: number): number {
    if (feeTax.calculationType === 'fixed') {
      return feeTax.value;
    } else if (feeTax.calculationType === 'percentage') {
      return (baseAmount * feeTax.value) / 100;
    }
    return 0;
  }

  /**
   * Format summary of fees/taxes
   */
  formatSummary(fees: AppliedFee[], taxes: AppliedTax[]): string {
    const parts: string[] = [];

    if (fees.length > 0) {
      const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
      parts.push(`Fees: ${this.formatCurrency(totalFees)}`);
    }

    if (taxes.length > 0) {
      const totalTaxes = taxes.reduce((sum, t) => sum + t.amount, 0);
      parts.push(`Taxes: ${this.formatCurrency(totalTaxes)}`);
    }

    return parts.join(' + ');
  }

  /**
   * Get detailed breakdown text
   */
  getDetailedBreakdown(basePrice: number, discount: number, fees: AppliedFee[], taxes: AppliedTax[]): string[] {
    const lines: string[] = [];

    lines.push(`Original Price: ${this.formatCurrency(basePrice)}`);

    if (discount > 0) {
      lines.push(`Discount: -${this.formatCurrency(discount)}`);
      lines.push(`Subtotal: ${this.formatCurrency(basePrice - discount)}`);
    }

    fees.forEach((fee) => {
      lines.push(`${fee.name}: +${this.formatCurrency(fee.amount)}`);
    });

    taxes.forEach((tax) => {
      lines.push(`${tax.name}: +${this.formatCurrency(tax.amount)}`);
    });

    return lines;
  }

  /**
   * Validate fee/tax configuration
   */
  validateFeeTaxConfig(config: FeeTaxConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (config.value < 0) {
      errors.push('Value cannot be negative');
    }

    if (config.calculationType === 'percentage' && config.value > 100) {
      errors.push('Percentage value cannot exceed 100%');
    }

    if (config.priority < 0 || config.priority > 1000) {
      errors.push('Priority must be between 0 and 1000');
    }

    if (config.startDate && config.endDate) {
      if (new Date(config.startDate) > new Date(config.endDate)) {
        errors.push('Start date cannot be after end date');
      }
    }

    if (config.conditions) {
      if (config.conditions.minTotal && config.conditions.maxTotal) {
        if (config.conditions.minTotal > config.conditions.maxTotal) {
          errors.push('Minimum total cannot exceed maximum total');
        }
      }

      if (config.conditions.minTickets && config.conditions.maxTickets) {
        if (config.conditions.minTickets > config.conditions.maxTickets) {
          errors.push('Minimum tickets cannot exceed maximum tickets');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get status badge info
   */
  getStatusBadgeInfo(enabled: boolean): { color: string; text: string } {
    return enabled ? { color: 'success', text: 'Active' } : { color: 'default', text: 'Inactive' };
  }

  /**
   * Sort fees/taxes by priority
   */
  sortByPriority(items: FeeTaxConfig[]): FeeTaxConfig[] {
    return [...items].sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  /**
   * Group fees/taxes by type
   */
  groupByType(items: FeeTaxConfig[]): { fees: FeeTaxConfig[]; taxes: FeeTaxConfig[] } {
    return {
      fees: items.filter((item) => item.feeType === 'fee'),
      taxes: items.filter((item) => item.feeType === 'tax'),
    };
  }

  /**
   * Check if item has conditions
   */
  hasConditions(feeTax: FeeTaxConfig): boolean {
    const conditions = feeTax.conditions;
    if (!conditions) return false;

    return !!(
      conditions.minTotal ||
      conditions.maxTotal ||
      conditions.minTickets ||
      conditions.maxTickets ||
      (conditions.appliedRoutes && conditions.appliedRoutes.length > 0) ||
      (conditions.excludedRoutes && conditions.excludedRoutes.length > 0)
    );
  }

  /**
   * Get conditions description
   */
  getConditionsDescription(feeTax: FeeTaxConfig): string[] {
    const descriptions: string[] = [];

    if (!feeTax.conditions) return descriptions;

    const c = feeTax.conditions;

    if (c.minTotal) descriptions.push(`Min Total: ${this.formatCurrency(c.minTotal)}`);
    if (c.maxTotal) descriptions.push(`Max Total: ${this.formatCurrency(c.maxTotal)}`);
    if (c.minTickets) descriptions.push(`Min Tickets: ${c.minTickets}`);
    if (c.maxTickets) descriptions.push(`Max Tickets: ${c.maxTickets}`);
    if (c.appliedRoutes?.length) descriptions.push(`Applied to: ${c.appliedRoutes.length} routes`);
    if (c.excludedRoutes?.length) descriptions.push(`Excluded from: ${c.excludedRoutes.length} routes`);

    return descriptions;
  }
}
