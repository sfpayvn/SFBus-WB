/**
 * Booking Fee & Tax Breakdown Component
 * Reusable component to display fees and taxes in booking details/confirmation
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BookingWithFeeTax } from '../models/fee-tax.model';

@Component({
  selector: 'app-booking-fee-tax-breakdown',
  templateUrl: './booking-fee-tax-breakdown.component.html',
  styleUrls: ['./booking-fee-tax-breakdown.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class BookingFeeTaxBreakdownComponent {
  @Input() booking: BookingWithFeeTax | null = null;
  @Input() compact = false; // For compact/summary view
}
