# Fee & Tax Management - Angular Implementation Guide

> **Project**: SFBus-WB (Angular Workbench)  
> **Version**: 1.0.0  
> **Date**: March 5, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Component Implementation](#component-implementation)
5. [Service Implementation](#service-implementation)
6. [Models & Interfaces](#models--interfaces)
7. [Routing Setup](#routing-setup)
8. [UI Components Details](#ui-components-details)
9. [Best Practices](#best-practices)
10. [Testing Guide](#testing-guide)

---

## 🎯 Overview

This guide covers the complete implementation of a Fee & Tax management system in the Angular workbench application. The system allows admins to:

- ✅ Create and manage fee/tax configurations
- ✅ View list of all fees/taxes
- ✅ Edit existing fees/taxes
- ✅ Delete fees/taxes
- ✅ Set conditional rules (min/max amounts, routes, date ranges)
- ✅ Preview applicable fees/taxes for a booking

### Key Features

- **Flexible Configuration**: Fixed or percentage-based calculations
- **Smart Application**: Apply on ticket price, total booking, or after-discount
- **Conditional Logic**: Apply based on business rules
- **Priority System**: Control order of application
- **Per-Tenant**: Each tenant manages their own fees/taxes
- **Date Range Support**: Time-based fee/tax activation

---

## 📁 Project Structure

```
src/app/modules/management/modules/fee-tax-management/
├── pages/
│   ├── fee-tax/                          # List page
│   │   ├── fee-tax.component.ts
│   │   ├── fee-tax.component.html
│   │   └── fee-tax.component.scss
│   └── fee-tax-detail/                   # Detail page (separate page, not popup)
│       ├── fee-tax-detail.component.ts
│       ├── fee-tax-detail.component.html
│       └── fee-tax-detail.component.scss
├── service/
│   └── fee-tax.service.ts                # API service
├── model/
│   └── fee-tax.model.ts                  # Interfaces & types
├── components/                           # Reusable components (optional)
│   └── fee-tax-conditions-form/
├── fee-tax-management-routing.module.ts  # Routing
├── fee-tax-management.module.ts          # Module
└── fee-tax-management-share.module.ts    # Shared declarations
```

---

## 🛠️ Step-by-Step Implementation

### Step 1: Create Module Directory Structure

```bash
# Create directories
mkdir -p src/app/modules/management/modules/fee-tax-management/pages/fee-tax
mkdir -p src/app/modules/management/modules/fee-tax-management/pages/fee-tax-detail
mkdir -p src/app/modules/management/modules/fee-tax-management/service
mkdir -p src/app/modules/management/modules/fee-tax-management/model
mkdir -p src/app/modules/management/modules/fee-tax-management/components
```

### Step 2: Create Module Files

### Step 3: Update Management Module

Add to `src/app/modules/management/management-routing.module.ts`:

```typescript
{
  path: 'fee-tax-management',
  loadChildren: () => import('./modules/fee-tax-management/fee-tax-management.module')
    .then(m => m.FeeTaxManagementModule)
}
```

### Step 4: Implement Model/Interface

Create `src/app/modules/management/modules/fee-tax-management/model/fee-tax.model.ts`

### Step 5: Create Service

Create `src/app/modules/management/modules/fee-tax-management/service/fee-tax.service.ts`

### Step 6: Implement List Page

Create `src/app/modules/management/modules/fee-tax-management/pages/fee-tax/fee-tax.component.ts`

### Step 7: Implement Detail Page

Create `src/app/modules/management/modules/fee-tax-management/pages/fee-tax-detail/fee-tax-detail.component.ts`

### Step 8: Setup Routing

Create `src/app/modules/management/modules/fee-tax-management/fee-tax-management-routing.module.ts`

---

## 💻 Component Implementation

### List Component (fee-tax.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Subscription } from 'rxjs';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { FeeTax, SearchFeeTax, FeeTax2Create } from '../../model/fee-tax.model';
import { FeeTaxService } from '../../service/fee-tax.service';
import { CapsService } from '@rsApp/shared/services/caps.service';
import { COMMON_STATUS_CLASSES } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-fee-tax',
  templateUrl: './fee-tax.component.html',
  styleUrls: ['./fee-tax.component.scss'],
  standalone: false,
})
export class FeeTaxComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchFeeTax!: SearchFeeTax;

  searchParams = {
    pageIdx: 1,
    pageSize: 10,
    keyword: '',
    sortBy: {
      key: 'priority',
      value: 'ascend',
    },
    filters: {
      key: 'feeType',
      value: [],
    },
  };

  isLoadingFeeTax: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  filterFeeTypes = [
    { text: 'Fee', value: 'fee' },
    { text: 'Tax', value: 'tax' },
  ];

  filterCalculationTypes = [
    { text: 'Fixed', value: 'fixed' },
    { text: 'Percentage', value: 'percentage' },
  ];

  totalPage: number = 0;
  totalItem: number = 0;

  statusClasses = COMMON_STATUS_CLASSES;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private feeTaxService: FeeTaxService,
    private dialog: MatDialog,
    public capsService: CapsService,
  ) {
    this.eventSubscription = [];
    this.searchFeeTax = {
      feeTaxes: [],
      totalItem: 0,
      totalPage: 0,
      pageIdx: 0,
    };
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    this.initListenEvent();
  }

  initListenEvent() {}

  loadData(): void {
    this.loadFeeTax();
  }

  loadFeeTax() {
    this.isLoadingFeeTax = true;
    this.feeTaxService.searchFeeTax(this.searchParams).subscribe({
      next: (res: SearchFeeTax) => {
        if (res) {
          this.searchFeeTax = res;
          this.totalItem = this.searchFeeTax.totalItem;
          this.totalPage = this.searchFeeTax.totalPage;
        }
        this.isLoadingFeeTax = false;
      },
      error: (err) => {
        this.isLoadingFeeTax = false;
        toast.error('Failed to load fees/taxes');
      },
    });
  }

  onPageChange(page: number) {
    this.searchParams.pageIdx = page;
    this.loadFeeTax();
  }

  onPageSizeChange(pageSize: number) {
    this.searchParams.pageSize = pageSize;
    this.searchParams.pageIdx = 1;
    this.loadFeeTax();
  }

  onSearch(keyword: string) {
    this.searchParams.keyword = keyword;
    this.searchParams.pageIdx = 1;
    this.loadFeeTax();
  }

  onFilterChange(filterKey: string, filterValue: any[]) {
    this.searchParams.filters = {
      key: filterKey,
      value: filterValue,
    };
    this.searchParams.pageIdx = 1;
    this.loadFeeTax();
  }

  onSortChange(sortKey: string, sortValue: string) {
    this.searchParams.sortBy = {
      key: sortKey,
      value: sortValue,
    };
    this.loadFeeTax();
  }

  createNew() {
    this.router.navigate(['management/fee-tax-management/fee-tax/detail'], {
      state: { mode: 'create' },
    });
  }

  editFeeTax(feeTax: FeeTax) {
    this.router.navigate(['management/fee-tax-management/fee-tax/detail'], {
      state: { feeTax, mode: 'update' },
    });
  }

  deleteFeeTax(feeTax: FeeTax) {
    this.utilsModal.confirmDelete(
      `Xoá ${feeTax.name}?`,
      '',
      () => {
        this.feeTaxService.deleteFeeTax(feeTax._id).subscribe({
          next: () => {
            toast.success('Deleted successfully');
            this.loadFeeTax();
          },
          error: (err) => {
            toast.error('Failed to delete fee/tax');
          },
        });
      },
      () => {},
    );
  }

  toggleEnable(feeTax: FeeTax) {
    const updatedFeeTax = { ...feeTax, enabled: !feeTax.enabled };
    this.feeTaxService.updateFeeTax(feeTax._id, updatedFeeTax).subscribe({
      next: () => {
        toast.success('Updated successfully');
        this.loadFeeTax();
      },
      error: (err) => {
        toast.error('Failed to update fee/tax');
      },
    });
  }
}
```

### List Template (fee-tax.component.html)

```html
<div class="min-h-screen bg-gray-50 p-4">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Phí & Thuế</h1>
      <p class="text-gray-600">Quản lý cấu hình phí và thuế cho booking</p>
    </div>
    <button
      class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      nz-button
      nzType="primary"
      (click)="createNew()">
      <svg-icon svgClass="w-4 h-4" src="assets/icons/plus.svg"></svg-icon>
      Thêm Phí/Thuế
    </button>
  </div>

  <!-- Search & Filter -->
  <div class="mb-6 rounded-lg bg-white p-4 shadow-sm">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- Search -->
      <input
        type="text"
        placeholder="Tìm kiếm phí/thuế..."
        class="rounded border border-gray-300 px-3 py-2"
        (change)="onSearch($event)" />

      <!-- Fee Type Filter -->
      <nz-select
        [(ngModel)]="searchParams.filters.value"
        [nzPlaceHolder]="'Loại phí'"
        nzMode="multiple"
        (ngModelChange)="onFilterChange('feeType', $event)">
        <nz-option
          *ngFor="let type of filterFeeTypes"
          [nzValue]="type.value"
          [nzLabel]="type.text">
        </nz-option>
      </nz-select>

      <!-- Calculation Type Filter -->
      <nz-select
        [(ngModel)]="searchParams.filters.value"
        [nzPlaceHolder]="'Loại tính toán'"
        nzMode="multiple"
        (ngModelChange)="onFilterChange('calculationType', $event)">
        <nz-option
          *ngFor="let type of filterCalculationTypes"
          [nzValue]="type.value"
          [nzLabel]="type.text">
        </nz-option>
      </nz-select>
    </div>
  </div>

  <!-- Table -->
  <div class="rounded-lg bg-white shadow-sm">
    <nz-table
      #table
      [nzData]="searchFeeTax.feeTaxes"
      [nzLoading]="isLoadingFeeTax"
      [nzFrontPagination]="false"
      [nzPaginationPosition]="'bottomRight'"
      [nzPageSize]="searchParams.pageSize"
      [nzPageIndex]="searchParams.pageIdx"
      [nzTotal]="totalItem"
      (nzPageIndexChange)="onPageChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)">
      <thead>
        <tr>
          <th nzWidth="150px">Tên</th>
          <th nzWidth="100px">Loại</th>
          <th nzWidth="100px">Tính Toán</th>
          <th nzWidth="80px">Giá Trị</th>
          <th nzWidth="100px">Áp Dụng Trên</th>
          <th nzWidth="80px">Ưu Tiên</th>
          <th nzWidth="80px">Trạng Thái</th>
          <th nzWidth="120px">Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let feeTax of searchFeeTax.feeTaxes">
          <!-- Name -->
          <td class="font-medium">{{ feeTax.name }}</td>

          <!-- Fee Type Badge -->
          <td>
            <span
              class="inline-block rounded-full px-2 py-1 text-xs font-medium"
              [ngClass]="feeTax.feeType === 'fee'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-orange-100 text-orange-700'">
              {{ feeTax.feeType === 'fee' ? 'Phí' : 'Thuế' }}
            </span>
          </td>

          <!-- Calculation Type -->
          <td>
            <span
              class="inline-block rounded-full px-2 py-1 text-xs font-medium"
              [ngClass]="feeTax.calculationType === 'fixed'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'">
              {{ feeTax.calculationType === 'fixed' ? 'Cố định' : 'Phần trăm' }}
            </span>
          </td>

          <!-- Value -->
          <td>
            <span class="font-semibold">
              {{ feeTax.value }}{{ feeTax.calculationType === 'percentage' ? '%' : ' VND' }}
            </span>
          </td>

          <!-- Applied On -->
          <td>
            <small>
              {{
                feeTax.appliedOn === 'ticket_price'
                  ? 'Giá vé'
                  : feeTax.appliedOn === 'total_booking'
                    ? 'Tổng booking'
                    : 'Sau giảm giá'
              }}
            </small>
          </td>

          <!-- Priority -->
          <td class="text-center">
            <span class="inline-block rounded-full bg-gray-100 px-2 py-1 text-sm font-semibold">
              {{ feeTax.priority }}
            </span>
          </td>

          <!-- Status -->
          <td>
            <button
              class="inline-flex items-center justify-center rounded"
              [ngClass]="feeTax.enabled
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'"
              (click)="toggleEnable(feeTax)">
              {{ feeTax.enabled ? '✓ Hoạt động' : '✕ Tắt' }}
            </button>
          </td>

          <!-- Actions -->
          <td>
            <div class="flex gap-2">
              <button
                class="inline-flex items-center justify-center rounded px-2 py-1 hover:bg-blue-50"
                nz-button
                nzType="text"
                nzSize="small"
                (click)="editFeeTax(feeTax)">
                <svg-icon svgClass="w-4 h-4" src="assets/icons/edit.svg"></svg-icon>
              </button>
              <button
                class="inline-flex items-center justify-center rounded px-2 py-1 hover:bg-red-50"
                nz-button
                nzType="text"
                nzSize="small"
                (click)="deleteFeeTax(feeTax)">
                <svg-icon svgClass="w-4 h-4 text-red-600" src="assets/icons/trash.svg"></svg-icon>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </nz-table>
  </div>
</div>
```

### Detail Component (fee-tax-detail.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Location } from '@angular/common';
import { Utils } from 'src/app/shared/utils/utils';
import { toast } from 'ngx-sonner';
import { FeeTax, FeeTax2Create, FeeTax2Update } from '../../model/fee-tax.model';
import { FeeTaxService } from '../../service/fee-tax.service';

@Component({
  selector: 'app-fee-tax-detail',
  templateUrl: './fee-tax-detail.component.html',
  styleUrl: './fee-tax-detail.component.scss',
  standalone: false,
})
export class FeeTaxDetailComponent implements OnInit {
  mainForm!: FormGroup;
  conditionsForm!: FormGroup;

  feeTax!: FeeTax;
  mode: 'create' | 'update' = 'create';
  isSubmitting: boolean = false;

  feeTypes = [
    { value: 'fee', label: 'Phí' },
    { value: 'tax', label: 'Thuế' },
  ];

  calculationTypes = [
    { value: 'fixed', label: 'Số tiền cố định (VND)' },
    { value: 'percentage', label: 'Phần trăm (%)' },
  ];

  appliedOnOptions = [
    { value: 'ticket_price', label: 'Trên giá vé' },
    { value: 'total_booking', label: 'Trên tổng booking' },
    { value: 'after_discount', label: 'Sau khi được giảm giá' },
  ];

  private initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private feeTaxService: FeeTaxService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['feeTax']) {
      this.feeTax = params['feeTax'];
      this.mode = params['mode'] || 'create';
    }
  }

  async initData() {
    this.initForm();
  }

  initForm() {
    const {
      name = '',
      feeType = 'fee',
      calculationType = 'fixed',
      appliedOn = 'after_discount',
      value = 0,
      priority = 0,
      enabled = true,
      description = '',
      conditions = null,
      startDate = null,
      endDate = null,
    } = this.feeTax || {};

    this.mainForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(3)]],
      feeType: [feeType, Validators.required],
      calculationType: [calculationType, Validators.required],
      appliedOn: [appliedOn, Validators.required],
      value: [value, [Validators.required, Validators.min(0)]],
      priority: [priority, [Validators.required, Validators.min(0), Validators.max(1000)]],
      enabled: [enabled],
      description: [description],
      startDate: [startDate],
      endDate: [endDate],
    });

    this.conditionsForm = this.fb.group({
      minTotal: [conditions?.minTotal || null, Validators.min(0)],
      maxTotal: [conditions?.maxTotal || null, Validators.min(0)],
      minTickets: [conditions?.minTickets || null, Validators.min(1)],
      maxTickets: [conditions?.maxTickets || null, Validators.min(1)],
      appliedRoutes: [conditions?.appliedRoutes || []],
      excludedRoutes: [conditions?.excludedRoutes || []],
    });

    this.initialFormValue = this.mainForm.value;
  }

  backPage() {
    this.location.back();
  }

  async onSubmit() {
    if (!this.mainForm.valid) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.mainForm.value;
    const conditionsValue = this.conditionsForm.value;

    // Prepare conditions object
    const conditions = {
      minTotal: conditionsValue.minTotal,
      maxTotal: conditionsValue.maxTotal,
      minTickets: conditionsValue.minTickets,
      maxTickets: conditionsValue.maxTickets,
      appliedRoutes: conditionsValue.appliedRoutes,
      excludedRoutes: conditionsValue.excludedRoutes,
    };

    const payload = {
      ...formValue,
      conditions: Object.values(conditions).some((v) => v) ? conditions : null,
    };

    try {
      if (this.mode === 'create') {
        await this.feeTaxService.createFeeTax(payload as FeeTax2Create).toPromise();
        toast.success('Tạo phí/thuế thành công');
      } else {
        await this.feeTaxService.updateFeeTax(this.feeTax._id, payload as FeeTax2Update).toPromise();
        toast.success('Cập nhật phí/thuế thành công');
      }
      this.backPage();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.mainForm.patchValue(this.initialFormValue);
    this.conditionsForm.reset();
  }

  getValueUnitLabel(): string {
    return this.mainForm.get('calculationType')?.value === 'percentage' ? '%' : 'VND';
  }
}
```

### Detail Template (fee-tax-detail.component.html)

```html
<div class="min-h-screen bg-gray-50 p-4">
  <!-- Header with Back Button -->
  <div class="mb-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <button
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-200 px-3 py-2 hover:bg-gray-300"
        nz-button
        (click)="backPage()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          <span *ngIf="mode === 'update'">Sửa Phí/Thuế</span>
          <span *ngIf="mode === 'create'">Thêm Phí/Thuế</span>
        </h1>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="rounded-xl border border-gray-200 bg-white p-6">
    <form [formGroup]="mainForm" (ngSubmit)="onSubmit()" nz-form *ngIf="mainForm">
      <!-- Basic Information Section -->
      <div class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Thông Tin Cơ Bản</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Name -->
          <div class="flex flex-col">
            <label class="mb-2 font-semibold text-gray-700">Tên Phí/Thuế</label>
            <input
              type="text"
              formControlName="name"
              placeholder="VD: Phí Booking, Thuế VAT"
              class="rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              [ngClass]="mainForm.controls['name'].invalid && mainForm.controls['name'].touched
                ? 'border-red-500'
                : ''" />
            <small
              class="mt-1 text-red-500"
              *ngIf="mainForm.controls['name'].invalid && mainForm.controls['name'].touched">
              Vui lòng nhập tên (tối thiểu 3 ký tự)
            </small>
          </div>

          <!-- Fee Type -->
          <div class="flex flex-col">
            <label class="mb-2 font-semibold text-gray-700">Loại</label>
            <nz-select
              formControlName="feeType"
              class="w-full"
              nzPlaceHolder="Chọn loại">
              <nz-option
                *ngFor="let type of feeTypes"
                [nzValue]="type.value"
                [nzLabel]="type.label">
              </nz-option>
            </nz-select>
          </div>

          <!-- Calculation Type -->
          <div class="flex flex-col">
            <label class="mb-2 font-semibold text-gray-700">Cách Tính</label>
            <nz-select
              formControlName="calculationType"
              class="w-full"
              nzPlaceHolder="Chọn cách tính">
              <nz-option
                *ngFor="let type of calculationTypes"
                [nzValue]="type.value"
                [nzLabel]="type.label">
              </nz-option>
            </nz-select>
          </div>

          <!-- Value -->
          <div class="flex flex-col">
            <label class="mb-2 font-semibold text-gray-700">
              Giá Trị ({{ getValueUnitLabel() }})
            </label>
            <input
              type="number"
              formControlName="value"
              placeholder="0"
              class="rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              [ngClass]="mainForm.controls['value'].invalid && mainForm.controls['value'].touched
                ? 'border-red-500'
                : ''" />
            <small
              class="mt-1 text-red-500"
              *ngIf="mainForm.controls['value'].invalid && mainForm.controls['value'].touched">
              Vui lòng nhập giá trị hợp lệ
            </small>
          </div>

          <!-- Applied On -->
          <div class="flex flex-col md:col-span-2">
            <label class="mb-2 font-semibold text-gray-700">Áp Dụng Trên</label>
            <nz-select
              formControlName="appliedOn"
              class="w-full"
              nzPlaceHolder="Chọn cơ sở tính">
              <nz-option
                *ngFor="let option of appliedOnOptions"
                [nzValue]="option.value"
                [nzLabel]="option.label">
              </nz-option>
            </nz-select>
            <small class="mt-1 text-gray-600">
              Chọn cơ sở để tính toán phí/thuế này
            </small>
          </div>
        </div>
      </div>

      <!-- Configuration Section -->
      <div class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Cấu Hình</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Priority -->
          <div class="flex flex-col">
            <label class="mb-2 font-semibold text-gray-700">Ưu Tiên (0-1000)</label>
            <input
              type="number"
              formControlName="priority"
              min="0"
              max="1000"
              placeholder="0"
              class="rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              [ngClass]="mainForm.controls['priority'].invalid && mainForm.controls['priority'].touched
                ? 'border-red-500'
                : ''" />
            <small class="mt-1 text-gray-600">
              Số nhỏ hơn = được áp dụng trước
            </small>
          </div>

          <!-- Enabled -->
          <div class="flex items-end">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                formControlName="enabled"
                class="rounded border border-gray-300" />
              <label class="font-semibold text-gray-700">Kích hoạt</label>
            </div>
          </div>

          <!-- Date Range -->
          <div class="flex flex-col md:col-span-3">
            <label class="mb-2 font-semibold text-gray-700">Khoảng Thời Gian (tuỳ chọn)</label>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="text-sm text-gray-600">Từ ngày</label>
                <input
                  type="date"
                  formControlName="startDate"
                  class="w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label class="text-sm text-gray-600">Đến ngày</label>
                <input
                  type="date"
                  formControlName="endDate"
                  class="w-full rounded border border-gray-300 px-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conditions Section -->
      <div class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Điều Kiện Áp Dụng (tuỳ chọn)</h2>
        <form [formGroup]="conditionsForm">
          <div class="panel bg-blue-50 p-4">
            <p class="mb-4 text-sm text-gray-700">
              Để trống nếu muốn áp dụng cho tất cả booking
            </p>

            <!-- Amount Conditions -->
            <div class="mb-6">
              <h3 class="mb-3 font-semibold text-gray-800">Điều kiện theo số tiền</h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="flex flex-col">
                  <label class="mb-2 text-sm font-semibold">Tối thiểu (VND)</label>
                  <input
                    type="number"
                    formControlName="minTotal"
                    min="0"
                    placeholder="Không giới hạn"
                    class="rounded border border-gray-300 px-3 py-2" />
                </div>
                <div class="flex flex-col">
                  <label class="mb-2 text-sm font-semibold">Tối đa (VND)</label>
                  <input
                    type="number"
                    formControlName="maxTotal"
                    min="0"
                    placeholder="Không giới hạn"
                    class="rounded border border-gray-300 px-3 py-2" />
                </div>
              </div>
            </div>

            <!-- Ticket Conditions -->
            <div class="mb-6">
              <h3 class="mb-3 font-semibold text-gray-800">Điều kiện theo số vé</h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="flex flex-col">
                  <label class="mb-2 text-sm font-semibold">Tối thiểu vé</label>
                  <input
                    type="number"
                    formControlName="minTickets"
                    min="1"
                    placeholder="Không giới hạn"
                    class="rounded border border-gray-300 px-3 py-2" />
                </div>
                <div class="flex flex-col">
                  <label class="mb-2 text-sm font-semibold">Tối đa vé</label>
                  <input
                    type="number"
                    formControlName="maxTickets"
                    min="1"
                    placeholder="Không giới hạn"
                    class="rounded border border-gray-300 px-3 py-2" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Description -->
      <div class="mb-8">
        <label class="mb-2 font-semibold text-gray-700">Mô Tả (tuỳ chọn)</label>
        <textarea
          formControlName="description"
          placeholder="Nhập mô tả chi tiết..."
          rows="4"
          class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
        </textarea>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          [disabled]="isSubmitting"
          nz-button
          nzType="primary">
          <span *ngIf="!isSubmitting">
            {{ mode === 'create' ? 'Tạo' : 'Cập nhật' }}
          </span>
          <span *ngIf="isSubmitting" class="inline-block animate-spin">⏳</span>
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50"
          nz-button
          (click)="resetForm()">
          Đặt Lại
        </button>
        <button
          type="button"
          class="ml-auto rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50"
          nz-button
          (click)="backPage()">
          Hủy
        </button>
      </div>
    </form>
  </div>
</div>
```

---

## 🔌 Service Implementation

### fee-tax.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeTax, SearchFeeTax, FeeTax2Create, FeeTax2Update } from '../model/fee-tax.model';
import { environment } from '@rsEnv/environment';

@Injectable({
  providedIn: 'root',
})
export class FeeTaxService {
  private apiUrl = `${environment.API_BASE_URL}/admin/fee-taxes`;

  constructor(private http: HttpClient) {}

  /**
   * Search fees/taxes with pagination and filters
   */
  searchFeeTax(params: any): Observable<SearchFeeTax> {
    let httpParams = new HttpParams();

    if (params.pageIdx) {
      httpParams = httpParams.set('pageIdx', params.pageIdx);
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize);
    }
    if (params.keyword) {
      httpParams = httpParams.set('keyword', params.keyword);
    }
    if (params.sortBy?.key) {
      httpParams = httpParams.set('sortBy', params.sortBy.key).set('sortOrder', params.sortBy.value);
    }
    if (params.filters?.key && params.filters?.value?.length > 0) {
      httpParams = httpParams.set(params.filters.key, params.filters.value.join(','));
    }

    return this.http.get<SearchFeeTax>(`${this.apiUrl}`, { params: httpParams });
  }

  /**
   * Get single fee/tax by ID
   */
  getFeeTax(id: string): Observable<FeeTax> {
    return this.http.get<FeeTax>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new fee/tax
   */
  createFeeTax(payload: FeeTax2Create): Observable<FeeTax> {
    return this.http.post<FeeTax>(`${this.apiUrl}`, payload);
  }

  /**
   * Update fee/tax
   */
  updateFeeTax(id: string, payload: FeeTax2Update): Observable<FeeTax> {
    return this.http.put<FeeTax>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Delete fee/tax
   */
  deleteFeeTax(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get applicable fees/taxes for booking calculation preview
   */
  getApplicableFeeTaxes(params: {
    total: number;
    ticketCount: number;
    routeId?: string;
    feeType?: 'fee' | 'tax';
  }): Observable<FeeTax[]> {
    let httpParams = new HttpParams();

    if (params.total) httpParams = httpParams.set('total', params.total.toString());
    if (params.ticketCount) httpParams = httpParams.set('ticketCount', params.ticketCount.toString());
    if (params.routeId) httpParams = httpParams.set('routeId', params.routeId);
    if (params.feeType) httpParams = httpParams.set('feeType', params.feeType);

    return this.http.get<FeeTax[]>(`${this.apiUrl}/calculate/preview`, { params: httpParams });
  }
}
```

---

## 📦 Models & Interfaces

### fee-tax.model.ts

```typescript
export interface FeeTax {
  _id: string;
  tenantId: string;
  feeType: 'fee' | 'tax';
  name: string;
  calculationType: 'fixed' | 'percentage';
  appliedOn: 'ticket_price' | 'total_booking' | 'after_discount';
  value: number;
  priority: number;
  enabled: boolean;
  description?: string;
  conditions?: {
    minTotal?: number;
    maxTotal?: number;
    minTickets?: number;
    maxTickets?: number;
    appliedRoutes?: string[];
    excludedRoutes?: string[];
  };
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface FeeTax2Create {
  feeType: 'fee' | 'tax';
  name: string;
  calculationType: 'fixed' | 'percentage';
  appliedOn: 'ticket_price' | 'total_booking' | 'after_discount';
  value: number;
  priority?: number;
  enabled?: boolean;
  description?: string;
  conditions?: any;
  startDate?: Date;
  endDate?: Date;
}

export interface FeeTax2Update {
  feeType?: 'fee' | 'tax';
  name?: string;
  calculationType?: 'fixed' | 'percentage';
  appliedOn?: 'ticket_price' | 'total_booking' | 'after_discount';
  value?: number;
  priority?: number;
  enabled?: boolean;
  description?: string;
  conditions?: any;
  startDate?: Date;
  endDate?: Date;
}

export interface SearchFeeTax {
  feeTaxes: FeeTax[];
  totalItem: number;
  totalPage: number;
  pageIdx: number;
}
```

---

## 🛣️ Routing Setup

### fee-tax-management-routing.module.ts

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeTaxComponent } from './pages/fee-tax/fee-tax.component';
import { FeeTaxDetailComponent } from './pages/fee-tax-detail/fee-tax-detail.component';

const routes: Routes = [
  {
    path: 'fee-tax',
    component: FeeTaxComponent,
  },
  {
    path: 'fee-tax/detail',
    component: FeeTaxDetailComponent,
  },
  { path: '', redirectTo: 'fee-tax', pathMatch: 'full' },
  { path: '**', redirectTo: 'errors/404' },
];

@Module({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeTaxManagementRoutingModule {}
```

---

## 📋 UI Components Details

### List Page Features

- ✅ Paginated table with search
- ✅ Filters by fee type, calculation type
- ✅ Sort by priority, name, creation date
- ✅ Quick toggle enable/disable
- ✅ Edit and delete actions
- ✅ Visual badges for status
- ✅ Responsive design

### Detail Page Features

- ✅ Separate page (not popup/modal)
- ✅ Create and update modes
- ✅ Form validation
- ✅ Conditional fields
- ✅ Date range selection
- ✅ Priority ordering
- ✅ Rich descriptions

### Display Format

```
┌─────────────────────────────────────────┐
│ Phí & Thuế                              │
├─────────────────────────────────────────┤
│ Name      │ Type  │ Calc │ Value │ ...│
├─────────────────────────────────────────┤
│ Booking   │ Fee   │ %    │ 5%    │ ...│
│ Fee       │       │      │       │    │
├─────────────────────────────────────────┤
│ VAT       │ Tax   │ %    │ 10%   │ ...│
├─────────────────────────────────────────┤
│ Airport   │ Fee   │ Fixed│ 50k   │ ...│
│ Surcharge │       │      │ VND   │    │
└─────────────────────────────────────────┘
```

---

## ✨ Best Practices

### 1. State Management

- Use navigation state for passing data between pages
- Keep form state in component
- Use services for shared business logic

### 2. Form Handling

```typescript
// Good: Reactive forms with validation
this.mainForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  value: [0, [Validators.required, Validators.min(0)]],
});

// Handle async validation if needed
```

### 3. Error Handling

```typescript
// Always handle errors
this.feeTaxService.createFeeTax(payload).subscribe({
  next: (result) => {
    toast.success('Success');
    this.router.navigate(['/list']);
  },
  error: (err) => {
    toast.error(err.message || 'Failed to create');
    console.error(err);
  },
});
```

### 4. Performance

- Use `OnPush` detection strategy
- Unsubscribe in ngOnDestroy
- Lazy load the module
- Implement virtual scrolling for large lists

### 5. Accessibility

- Use semantic HTML
- Add proper labels
- Include aria attributes
- Test keyboard navigation

---

## 🧪 Testing Guide

### Unit Tests Example

```typescript
describe('FeeTaxService', () => {
  let service: FeeTaxService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeeTaxService],
    });
    service = TestBed.inject(FeeTaxService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should search fee-taxes', () => {
    const params = { pageIdx: 1, pageSize: 10 };
    service.searchFeeTax(params).subscribe((res) => {
      expect(res.feeTaxes.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/admin/fee-taxes'));
    expect(req.request.method).toBe('GET');
    req.flush(mockSearchFeeTax);
  });
});
```

### E2E Tests Example

```typescript
describe('Fee & Tax Management', () => {
  it('should create fee/tax', async () => {
    await page.goto('/management/fee-tax-management/fee-tax');
    await page.click('button:has-text("Add Fee/Tax")');

    await page.fill('input[placeholder="Name"]', 'Test Fee');
    await page.selectOption('select[name="feeType"]', 'fee');
    await page.fill('input[name="value"]', '5');
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

---

## 📝 Integration Checklist

- [ ] Create module structure
- [ ] Implement models & interfaces
- [ ] Create service with API calls
- [ ] Build list component
- [ ] Build detail component
- [ ] Setup routing
- [ ] Add to management module
- [ ] Test all features
- [ ] Setup permissions/RBAC
- [ ] Document API endpoints
- [ ] Deploy to staging
- [ ] UAT testing
- [ ] Production deployment

---

## 📚 Related Documentation

- [Backend API Documentation](./FEE_TAX_IMPLEMENTATION.md)
- [Database Schema](../docs/FEE_TAX_IMPLEMENTATION.md)
- [NestJS Endpoints](./API_REFERENCE.md)

---

**Version**: 1.0.0  
**Status**: ✅ Ready for Implementation  
**Last Updated**: March 5, 2026
