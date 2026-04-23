import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeeTaxService } from '@rsApp/modules/management/modules/fee-tax-management/services/fee-tax.service';
import { AppliedOn, CalculationType, FeeTaxConfig, FeeType } from '../../models/fee-tax.model';

@Component({
  selector: 'app-fee-tax-detail',
  templateUrl: './fee-tax-detail.component.html',
  styleUrls: ['./fee-tax-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzMessageModule,
    NzTabsModule,
    NzCardModule,
    TranslateModule,
  ],
})
export class FeeTaxDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  feeTax: FeeTaxConfig | null = null;
  isNew = true;

  // Form
  form!: FormGroup;
  submitted = false;
  loading = false;

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
    private location: Location,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      feeType: ['fee', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      calculationType: ['percentage', Validators.required],
      appliedOn: ['after_discount', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      priority: [10, [Validators.required, Validators.min(0), Validators.max(1000)]],
      enabled: [true, Validators.required],
      description: [''],
      startDate: [null],
      endDate: [null],
    });
  }

  private getQueryParams(): void {
    const params = history.state;
    if (params && params['feeTax']) {
      this.feeTax = params['feeTax'];
      this.isNew = false;
      if (this.feeTax) {
        this.form.patchValue(this.feeTax);
      }
    } else {
      this.isNew = true;
    }
  }

  onSave(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.message.warning('Please fill all required fields correctly');
      return;
    }

    this.loading = true;
    const data = this.form.value;

    if (this.isNew) {
      // Create new
      this.feeTaxService
        .createFeeTax(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.message.success(this.translate.instant('messages.Fee/Tax created successfully'));
            this.loading = false;
            this.backToList();
          },
          error: (error) => {
            this.message.error(error.error?.message || this.translate.instant('messages.Failed to create fee/tax'));
            this.loading = false;
          },
        });
    } else {
      // Update existing
      if (!this.feeTax?._id) {
        this.message.error(this.translate.instant('common.Error'));
        this.loading = false;
        return;
      }

      this.feeTaxService
        .updateFeeTax(this.feeTax._id, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.message.success(this.translate.instant('messages.Fee/Tax updated successfully'));
            this.loading = false;
            this.backToList();
          },
          error: (error) => {
            this.message.error(error.error?.message || this.translate.instant('messages.Failed to update fee/tax'));
            this.loading = false;
          },
        });
    }
  }

  backToList(): void {
    this.location.back();
  }

  // Helper methods for labels
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

  getStatusText(enabled: boolean | undefined): string {
    return enabled ? this.translate.instant('labels.Active') : this.translate.instant('labels.Inactive');
  }
}
