import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeeTaxService } from '@rsApp/modules/management/modules/fee-tax-management/services/fee-tax.service';
import { AppliedOn, CalculationType, FeeTaxConfig, FeeType } from '../../models/fee-tax.model';

@Component({
  selector: 'app-fee-tax-list',
  templateUrl: './fee-tax-list.component.html',
  styleUrls: ['./fee-tax-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    NzModalModule,
    NzSelectModule,
    NzButtonModule,
    NzToolTipModule,
    NzMessageModule,
    NzIconModule,
    NzInputModule,
    NzDatePickerModule,
    NzCheckboxModule,
    TranslateModule,
  ],
})
export class FeeTaxListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Table
  feeTaxes: FeeTaxConfig[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // Form
  searchForm!: FormGroup;

  // Options for dropdowns
  feeTypeOptions = [
    { label: 'labels.Fee', value: 'fee' as FeeType },
    { label: 'labels.Tax', value: 'tax' as FeeType },
  ];

  calculationTypeOptions = [
    { label: 'labels.Fixed Amount', value: 'fixed' as CalculationType },
    { label: 'labels.Percentage', value: 'percentage' as CalculationType },
  ];

  appliedOnOptions = [
    { label: 'labels.Ticket Price', value: 'ticket_price' as AppliedOn },
    { label: 'labels.Total Booking', value: 'total_booking' as AppliedOn },
    { label: 'labels.After Discount', value: 'after_discount' as AppliedOn },
  ];

  constructor(
    private feeTaxService: FeeTaxService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadFeeTaxes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.searchForm = this.fb.group({
      enabled: [null],
      feeType: [null],
    });
  }

  private loadFeeTaxes(): void {
    this.loading = true;
    const filters = {
      enabled: this.searchForm.get('enabled')?.value,
      feeType: this.searchForm.get('feeType')?.value,
    };

    this.feeTaxService
      .listFeeTaxes(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.feeTaxes = data;
          this.total = data.length;
          this.loading = false;
        },
        error: (error) => {
          this.message.error(this.translate.instant('messages.Failed to load fee/tax configurations'));
          this.loading = false;
          console.error(error);
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadFeeTaxes();
  }

  onReset(): void {
    this.searchForm.reset();
    this.pageIndex = 1;
    this.loadFeeTaxes();
  }

  onAdd(): void {
    const params = {};
    this.router.navigate(['/management/fee-tax-management/detail'], { state: params });
  }

  onEdit(feeTax: FeeTaxConfig): void {
    const params = { feeTax };
    this.router.navigate(['/management/fee-tax-management/detail'], { state: params });
  }

  onDelete(id: string | undefined): void {
    if (!id) return;

    if (!confirm(this.translate.instant('labels.Are you sure you want to delete this fee/tax configuration?'))) return;

    this.feeTaxService
      .deleteFeeTax(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message.success(this.translate.instant('messages.Fee/Tax deleted successfully'));
          this.loadFeeTaxes();
        },
        error: (error) => {
          this.message.error(error.error?.message || this.translate.instant('messages.Failed to delete fee/tax'));
        },
      });
  }

  getStatusBadgeColor(enabled: boolean): string {
    return enabled ? 'success' : 'processing';
  }

  getStatusText(enabled: boolean | undefined): string {
    return enabled ? this.translate.instant('labels.Active') : this.translate.instant('labels.Inactive');
  }

  getFeeTypeLabel(feeType: FeeType | undefined): string {
    return feeType === 'fee' ? this.translate.instant('labels.Fee') : this.translate.instant('labels.Tax');
  }

  getCalculationTypeLabel(type: CalculationType | undefined): string {
    return type === 'fixed' ? this.translate.instant('labels.Fixed Amount') : this.translate.instant('labels.Percentage');
  }

  getAppliedOnLabel(appliedOn: AppliedOn | undefined): string {
    switch (appliedOn) {
      case 'ticket_price':
        return this.translate.instant('labels.Ticket Price');
      case 'total_booking':
        return this.translate.instant('labels.Total Booking');
      case 'after_discount':
        return this.translate.instant('labels.After Discount');
      default:
        return appliedOn || 'Unknown';
    }
  }

  getValueDisplay(feeTax: FeeTaxConfig | undefined): string {
    if (!feeTax) return '';
    if (feeTax.calculationType === 'fixed') {
      return `${feeTax.value.toLocaleString()} VND`;
    }
    return `${feeTax.value}%`;
  }
}
