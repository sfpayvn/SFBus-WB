/**
 * Fee/Tax Service
 * Handles API calls for fee/tax management
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import {
  FeeTaxConfig,
  CalculateFeeTaxRequest,
  CalculateFeeTaxResponse,
  AppliedFee,
  AppliedTax,
} from '../models/fee-tax.model';

@Injectable({
  providedIn: 'root',
})
export class FeeTaxService {
  private readonly baseUrl = '/admin/fee-taxes';

  constructor(private apiGateway: ApiGatewayService) {}

  /**
   * Create a new fee/tax configuration
   */
  createFeeTax(data: FeeTaxConfig): Observable<FeeTaxConfig> {
    return this.apiGateway.post(this.baseUrl, data, {
      feature: { module: 'fee-tax-management', function: 'create' },
    });
  }

  /**
   * Get all fee/tax configurations for current tenant
   */
  listFeeTaxes(filters?: { enabled?: boolean; feeType?: string }): Observable<FeeTaxConfig[]> {
    return this.apiGateway.get(this.baseUrl, filters, {
      feature: { module: 'fee-tax-management', function: 'list' },
      skipLoading: false,
    });
  }

  /**
   * Get specific fee/tax by ID
   */
  getFeeTax(id: string): Observable<FeeTaxConfig> {
    return this.apiGateway.get(`${this.baseUrl}/${id}`, null, {
      feature: { module: 'fee-tax-management', function: 'get-detail' },
      skipLoading: false,
    });
  }

  /**
   * Update fee/tax configuration
   */
  updateFeeTax(id: string, data: Partial<FeeTaxConfig>): Observable<FeeTaxConfig> {
    return this.apiGateway.put(`${this.baseUrl}/${id}`, data, {
      feature: { module: 'fee-tax-management', function: 'update' },
    });
  }

  /**
   * Delete fee/tax configuration
   */
  deleteFeeTax(id: string): Observable<{ success: boolean }> {
    return this.apiGateway.delete(`${this.baseUrl}/${id}`, {
      feature: { module: 'fee-tax-management', function: 'delete' },
    });
  }

  /**
   * Calculate and preview applicable fees/taxes for a booking
   */
  calculateFeeTaxes(request: CalculateFeeTaxRequest): Observable<CalculateFeeTaxResponse> {
    return this.apiGateway.get(`${this.baseUrl}/calculate/preview`, request, {
      feature: { module: 'fee-tax-management', function: 'calculate-preview' },
      skipLoading: true,
    });
  }

  /**
   * Get applicable fees and taxes for a booking scenario
   * (alternative endpoint if backend provides this)
   */
  getApplicableFeeTaxes(request: CalculateFeeTaxRequest): Observable<{
    applicable: FeeTaxConfig[];
    calculation: CalculateFeeTaxResponse;
  }> {
    return this.apiGateway.get(`${this.baseUrl}/applicable`, request, {
      feature: { module: 'fee-tax-management', function: 'get-applicable' },
      skipLoading: true,
    });
  }

  /**
   * Calculate fee/tax for display purpose (local calculation)
   * This can be used for preview before submission
   */
  calculateLocalFeeTaxes(
    baseAmount: number,
    feeTaxConfigs: FeeTaxConfig[],
    context?: { ticketCount?: number; routeId?: string },
  ): { fees: AppliedFee[]; taxes: AppliedTax[]; totalFees: number; totalTaxes: number } {
    const now = new Date();
    const fees: AppliedFee[] = [];
    const taxes: AppliedTax[] = [];

    // Filter and sort applicable fees/taxes by priority
    const applicable = feeTaxConfigs
      .filter((ft) => {
        // Check if enabled
        if (!ft.enabled) return false;

        // Check date range
        if (ft.startDate && new Date(ft.startDate) > now) return false;
        if (ft.endDate && new Date(ft.endDate) < now) return false;

        // Check conditions if any
        if (ft.conditions) {
          if (ft.conditions.minTotal && baseAmount < ft.conditions.minTotal) return false;
          if (ft.conditions.maxTotal && baseAmount > ft.conditions.maxTotal) return false;
          if (ft.conditions.minTickets && context?.ticketCount && context.ticketCount < ft.conditions.minTickets)
            return false;
          if (ft.conditions.maxTickets && context?.ticketCount && context.ticketCount > ft.conditions.maxTickets)
            return false;
          if (
            ft.conditions.appliedRoutes &&
            ft.conditions.appliedRoutes.length > 0 &&
            !ft.conditions.appliedRoutes.includes(context?.routeId || '')
          )
            return false;
        }

        return true;
      })
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));

    let workingAmount = baseAmount;

    // Calculate fees and taxes
    applicable.forEach((ft) => {
      let amount = 0;

      if (ft.calculationType === 'fixed') {
        amount = ft.value;
      } else if (ft.calculationType === 'percentage') {
        amount = (workingAmount * ft.value) / 100;
      }

      const item = {
        _id: ft._id,
        name: ft.name,
        amount: Math.round(amount),
        feeType: ft.feeType,
        calculationType: ft.calculationType,
        value: ft.value,
      };

      if (ft.feeType === 'fee') {
        fees.push(item as AppliedFee);
      } else {
        taxes.push(item as AppliedTax);
      }

      // If appliedOn is 'ticket_price', add to all tickets
      // If appliedOn is 'total_booking' or 'after_discount', add amount
      if (ft.appliedOn === 'after_discount' || ft.appliedOn === 'total_booking') {
        workingAmount += amount;
      }
    });

    const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
    const totalTaxes = taxes.reduce((sum, t) => sum + t.amount, 0);

    return {
      fees,
      taxes,
      totalFees,
      totalTaxes,
    };
  }
}
