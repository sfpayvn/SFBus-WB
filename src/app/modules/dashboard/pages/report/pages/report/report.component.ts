import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utils } from '@rsApp/shared/utils/utils';
import { differenceInCalendarDays } from 'date-fns';
import { ReportService } from '../../services/report.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { getRangeForType, getComparisonRange, DateRangeType } from '../../utils/date-range.helper';
import { StorageService } from '@rsApp/shared/services/storage.service';

interface ReportData {
  date: string;
  bookings: number;
  revenue: number;
  goods: number;
  schedules: number;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: false,
})
export class ReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  // caches for stats and chart results (LRU + TTL)
  filterForm: FormGroup;
  selectedBookingTab = 0; // Tab index for first tabset (Booking charts)
  selectedGoodsTab = 0; // Tab index for second tabset (Goods charts)
  dateRangeType: 'day' | 'this-week' | 'this-month' | 'week' | 'month' | 'custom' = 'day';
  comparisonMode = false;
  isLoading = false;
  isLoadingStats = false;
  loadedTabs: Set<number> = new Set([0]); // Track which tabs have been loaded, start with tab 0

  // Date range for charts
  startDate?: Date;
  endDate?: Date;
  comparisonStartDate?: Date;
  comparisonEndDate?: Date;

  paymentChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [] as string[],
      },
    ],
  };

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private reportService: ReportService,
    private router: Router,
    private storageService: StorageService,
  ) {
    this.filterForm = this.fb.group({
      dateRange: [
        {
          value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
          disabled: this.dateRangeType !== 'custom',
        },
      ],
      compareDateRange: [
        {
          value: null,
          disabled: !this.comparisonMode,
        },
      ],
      reportType: ['all'],
    });
  }

  ngOnInit() {
    // Initialize date range based on default dateRangeType
    this.setDateRangeType(this.dateRangeType, true);

    // Subscribe to date range changes
    this.filterForm
      .get('dateRange')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((dates: Date[] | null) => {
        if (dates && dates.length === 2) {
          // Set start date to beginning of day
          const startDate = new Date(dates[0]);
          startDate.setHours(0, 0, 0, 0);
          this.startDate = startDate;

          // Set end date to end of day
          const endDate = new Date(dates[1]);
          endDate.setHours(23, 59, 59, 999);
          this.endDate = endDate;
        }
      });

    // Subscribe to compare date range changes
    this.filterForm
      .get('compareDateRange')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: Date | Date[] | null) => {
        // Handle single date (for day mode)
        if (value instanceof Date) {
          const compareDate = new Date(value);
          compareDate.setHours(0, 0, 0, 0);
          this.comparisonStartDate = compareDate;

          const compareEndDate = new Date(value);
          compareEndDate.setHours(23, 59, 59, 999);
          this.comparisonEndDate = compareEndDate;
        }
        // Handle date range (for week/month/custom modes)
        else if (value && Array.isArray(value) && value.length === 2) {
          // Set compare start date to beginning of day
          const comparisonStartDate = new Date(value[0]);
          comparisonStartDate.setHours(0, 0, 0, 0);
          this.comparisonStartDate = comparisonStartDate;
          console.log('🚀 ~ ReportComponent ~ ngOnInit ~ this.comparisonStartDate:', this.comparisonStartDate);

          // Set compare end date to end of day
          const comparisonEndDate = new Date(value[1]);
          comparisonEndDate.setHours(23, 59, 59, 999);
          this.comparisonEndDate = comparisonEndDate;
          console.log('🚀 ~ ReportComponent ~ ngOnInit ~ this.comparisonEndDate:', this.comparisonEndDate);
        }
        // Note: No need to manipulate loadedTabs here
        // Angular's change detection will automatically trigger ngOnChanges
        // in child components when comparisonStartDate/comparisonEndDate change
      });

    this.loadAllStats();
  }

  private async loadAllStats() {
    if (!this.startDate || !this.endDate) return;

    const req = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      comparisonMode: this.comparisonMode,
      comparisonStartDate: this.comparisonStartDate?.toISOString(),
      comparisonEndDate: this.comparisonEndDate?.toISOString(),
    };

    this.isLoadingStats = true;

    try {
      const [bookingStats, goodsStats, scheduleStats, paymentStats] = await Promise.all([
        this.reportService.getBookingStats(req).toPromise(),
        this.reportService.getGoodsStats(req).toPromise(),
        this.reportService.getScheduleStats(req).toPromise(),
        this.reportService.getPaymentMethodStats(req).toPromise(),
      ]);

      const full = { bookingStats, goodsStats, scheduleStats, paymentStats };
      this.applyStats(full);
    } catch (err) {
      this.utils.handleRequestError(err);
    } finally {
      this.isLoadingStats = false;
    }
  }

  private applyStats(full: any) {
    try {
      // map incoming stats to UI variables as needed
      // example: set statistic cards or totals — components can access report data via bindings
      // This is intentionally generic; adapt mapping to your UI model.
      // e.g., this.paymentChartData.labels = full.bookingStats?.labels || [];
    } catch (e) {}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onReportTypeChange(value: string): void {}

  onBookingTabChange(index: number): void {
    this.selectedBookingTab = index;
    this.loadedTabs.add(index); // Mark this tab as loaded
  }

  onGoodsTabChange(index: number): void {
    this.selectedGoodsTab = index;
    this.loadedTabs.add(index + 3); // Mark goods tabs starting at index 3
  }

  hasTabLoaded(index: number): boolean {
    return this.loadedTabs.has(index);
  }

  handleReload(): void {
    // Clear all loaded tabs cache
    this.loadedTabs.clear();
    // Re-add only the currently selected tabs
    this.loadedTabs.add(this.selectedBookingTab);
    this.loadedTabs.add(this.selectedGoodsTab + 3);
    this.setDateRangeType(this.dateRangeType, true);
    // Stats cards will reload automatically via ngOnChanges when date range changes
  }

  setDateRangeType(type: DateRangeType, force: boolean = false): void {
    if (this.dateRangeType === type && !force) {
      return;
    }

    this.dateRangeType = type;
    // Clear loaded tabs cache when date range type changes to force reload
    this.loadedTabs.clear();
    this.loadedTabs.add(this.selectedBookingTab);
    this.loadedTabs.add(this.selectedGoodsTab + 3);

    if (type === 'custom') {
      // Enable date range picker for custom selection
      this.filterForm.get('dateRange')?.enable();
      // Keep existing date range values for custom mode
      const currentRange = this.filterForm.get('dateRange')?.value;
      if (currentRange && currentRange.length === 2) {
        this.startDate = currentRange[0];
        this.endDate = currentRange[1];
      }

      return;
    }

    // Disable date range picker for preset options
    this.filterForm.get('dateRange')?.disable();

    // Compute range using helper
    const range = getRangeForType(type, { startDate: this.startDate, endDate: this.endDate });
    this.startDate = range.startDate;
    this.endDate = range.endDate;

    this.filterForm.patchValue({
      dateRange: [this.startDate, this.endDate],
    });

    // Update comparison date range if comparison mode is active
    if (this.comparisonMode) {
      this.setDefaultComparisonRange();
    }
  }

  toggleComparisonMode(): void {
    this.comparisonMode = !this.comparisonMode;
    const compareDateRangeControl = this.filterForm.get('compareDateRange');
    if (this.comparisonMode) {
      compareDateRangeControl?.enable();
      // Set default comparison date range based on dateRangeType
      this.setDefaultComparisonRange();
    } else {
      compareDateRangeControl?.disable();
      this.comparisonStartDate = undefined;
      this.comparisonEndDate = undefined;
    }
  }

  private setDefaultComparisonRange(): void {
    const comp = getComparisonRange(this.dateRangeType, this.startDate, this.endDate);
    this.comparisonStartDate = comp.comparisonStartDate;
    this.comparisonEndDate = comp.comparisonEndDate;

    // Patch form: day uses single date control, others use range
    if (this.dateRangeType === 'day') {
      this.filterForm.patchValue({ compareDateRange: new Date(this.comparisonStartDate) }, { emitEvent: false });
    } else {
      this.filterForm.patchValue(
        { compareDateRange: [new Date(this.comparisonStartDate), new Date(this.comparisonEndDate)] },
        { emitEvent: false },
      );
    }
  }

  async exportReport(format: 'excel' | 'pdf'): Promise<void> {
    if (!this.startDate || !this.endDate) {
      toast.warning('Vui lòng chọn khoảng thời gian');
      return;
    }

    try {
      // Prepare export data
      const exportData = {
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString(),
        dateRangeType: this.dateRangeType,
        comparisonMode: this.comparisonMode,
        format: format,
      };

      //   this.reportService.exportReport(exportData).subscribe({
      //     next: (blob: Blob) => {
      //       // Create download link
      //       const url = window.URL.createObjectURL(blob);
      //       const link = document.createElement("a");
      //       link.href = url;

      //       // Set filename with timestamp
      //       const timestamp = new Date().toISOString().split("T")[0];
      //       const extension = format === "excel" ? "xlsx" : "pdf";
      //       link.download = `Bao_cao_tong_quan_${timestamp}.${extension}`;

      //       // Trigger download
      //       document.body.appendChild(link);
      //       link.click();

      //       // Cleanup
      //       document.body.removeChild(link);
      //       window.URL.revokeObjectURL(url);

      //       this.utils.hideLoading();
      //       toast.success(`Xuất báo cáo ${format.toUpperCase()} thành công`);
      //     },
      //     error: (error: any) => {
      //       console.error("Export error:", error);
      //       this.utils.hideLoading();
      //       this.utils.handleRequestError(error);
      //     },
      //   });
    } catch (error) {
      this.utils.handleUnexpectedError(error);
    }
  }

  viewDetailBookingReport(): void {
    this.router.navigate(['/dashboard/report/booking'], {
      state: {
        dateRange: this.filterForm.get('dateRange')?.value,
        comparisonDateRange: this.filterForm.get('compareDateRange')?.value,
        dateRangeType: this.dateRangeType,
        startDate: this.startDate,
        endDate: this.endDate,
        comparisonMode: this.comparisonMode,
        comparisonStartDate: this.comparisonStartDate,
        comparisonEndDate: this.comparisonEndDate,
      },
    });
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      completed: 'success',
      pending: 'warning',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      booking: 'ticket-outline',
      goods: 'cube-outline',
      schedule: 'bus-outline',
    };
    return icons[type] || 'document-outline';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }
}
