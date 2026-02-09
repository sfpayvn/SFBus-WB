import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Utils } from '@rsApp/shared/utils/utils';
import { toast } from 'ngx-sonner';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChartStatsResponse } from '../../models/report.model';
import { getRangeForType, getComparisonRange, DateRangeType } from '../../utils/date-range.helper';
import {
  BOOKING_STATUS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_CLASSES,
  GOODS_STATUS,
  GOODS_STATUS_CLASSES,
  GOODS_STATUS_LABELS,
} from '@rsApp/core/constants/status.constants';
import { BusRoute } from '@rsApp/modules/management/modules/bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '@rsApp/modules/management/modules/bus-management/pages/bus-routes/service/bus-routes.servive';
import { BookingReportService } from '../../services/booking-report.service';

@Component({
  selector: 'app-goods-report',
  standalone: false,
  templateUrl: './goods-report.component.html',
  styleUrl: './goods-report.component.scss',
})
export class GoodsReportComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  busRoutes: BusRoute[] = [];

  // Date range type
  dateRangeType: 'day' | 'this-week' | 'this-month' | 'week' | 'month' | 'custom' = 'day';
  comparisonMode: boolean = false;

  // Date properties for chart
  dateRange!: Date[];
  comparisonDateRange!: Date[];
  startDate!: Date | undefined;
  endDate!: Date | undefined;
  comparisonStartDate!: Date | undefined;
  comparisonEndDate!: Date | undefined;

  // Statistics
  totalTickets: number = 0;
  totalRevenue: number = 0;
  comparisonTickets: number = 0;
  comparisonRevenue: number = 0;

  // Chart data details
  chartDetails: Array<{ label: string; tickets: number; revenue: number }> = [];
  comparisonChartDetails: Array<{ label: string; tickets: number; revenue: number }> = [];

  // Loading state
  isLoading: boolean = false;

  // Status constants
  goodsStatus = GOODS_STATUS;
  goodsStatusLabels = GOODS_STATUS_LABELS;
  goodsStatusClasses = GOODS_STATUS_CLASSES;

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();
  // Whether navigation state was provided
  private hasState: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookingReportService: BookingReportService,
    private busRoutesService: BusRoutesService,
    private router: Router,
    public utils: Utils,
  ) {}

  async ngOnInit(): Promise<void> {
    this.getQueryParams();
    this.initFilterForm();
    // If there's no navigation state, apply default date range type so child components initialize
    if (!this.hasState) {
      setTimeout(() => {
        this.setDateRangeType(this.dateRangeType, true);
      }, 0);
    }
    await this.loadBusRoutes();

    // Re-initialize when navigating via browser back/forward so state is re-applied
    const navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getQueryParams();
        this.initFilterForm();
        // force applying the date range type so child components reload
        this.setDateRangeType(this.dateRangeType, true);
        // reset charts to avoid stale data
        this.resetChartData();
      }
    });
    this.subscriptions.push(navSub);

    this.filterForm
      .get('dateRange')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((dates: Date[] | null) => {
        if (dates && dates.length === 2) {
          // Reset chart data when date range changes
          this.resetChartData();

          // Set start date to beginning of day
          const startDate = new Date(dates[0]);
          startDate.setHours(0, 0, 0, 0);
          this.startDate = startDate; // Ensure startDate is assigned

          // Set end date to end of day
          const endDate = new Date(dates[1]);
          endDate.setHours(23, 59, 59, 999);
          this.endDate = endDate; // Ensure endDate is assigned
        }
      });

    // Subscribe to compare date range changes
    this.filterForm
      .get('compareDateRange')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: Date | Date[] | null) => {
        // Reset comparison chart data when comparison date range changes
        this.comparisonChartDetails = [];
        this.comparisonTickets = 0;
        this.comparisonRevenue = 0;

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

          // Set compare end date to end of day
          const comparisonEndDate = new Date(value[1]);
          comparisonEndDate.setHours(23, 59, 59, 999);
          this.comparisonEndDate = comparisonEndDate;
        }
        // Note: No need to manipulate loadedTabs here
        // Angular's change detection will automatically trigger ngOnChanges
        // in child components when comparisonStartDate/comparisonEndDate change
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getQueryParams() {
    const params = history.state;

    // remember whether there's navigation state so caller can decide to apply defaults
    const hasState = params || params['dateRange'];
    this.hasState = !hasState;

    if (!hasState) {
      return;
    }

    console.log('🚀 ~ BookingReportComponent ~ getQueryParams ~ params:', params);
    if (params && params['dateRange']) {
      this.dateRange = params['dateRange'] ? params['dateRange'] : [];
    }

    if (params && params['comparisonDateRange']) {
      this.comparisonDateRange = params['comparisonDateRange'] ? params['comparisonDateRange'] : [];
    }

    if (params && params['dateRangeType']) {
      this.dateRangeType = params['dateRangeType'] ? params['dateRangeType'] : null;
    }

    if (params && params['startDate']) {
      this.startDate = params['startDate'] ? new Date(params['startDate']) : undefined;
      console.log('🚀 ~ BookingReportComponent ~ getQueryParams ~ this.startDate:', this.startDate);
    }

    if (params && params['endDate']) {
      this.endDate = params['endDate'] ? new Date(params['endDate']) : undefined;
    }

    if (params && params['comparisonMode']) {
      this.comparisonMode = params['comparisonMode'] ? params['comparisonMode'] : false;
    }

    if (params && params['comparisonStartDate']) {
      this.comparisonStartDate = params['comparisonStartDate'] ? new Date(params['comparisonStartDate']) : undefined;
    }

    if (params && params['comparisonEndDate']) {
      this.comparisonEndDate = params['comparisonEndDate'] ? new Date(params['comparisonEndDate']) : undefined;
    }
  }

  /**
   * Khởi tạo form filter
   */
  initFilterForm(): void {
    const startDateRange = this.dateRange && this.dateRange[0] ? new Date(this.dateRange[0]) : new Date();
    const endDateRange = this.dateRange && this.dateRange[1] ? new Date(this.dateRange[1]) : new Date();

    const startDate = new Date(startDateRange);
    startDate.setHours(0, 0, 0, 0);

    // Set end date to end of day
    const endDate = new Date(endDateRange);
    endDate.setHours(23, 59, 59, 999);

    this.dateRange = [startDate, endDate];

    const compareStartDate =
      this.comparisonDateRange && this.comparisonDateRange[0] ? new Date(this.comparisonDateRange[0]) : null;
    const compareEndDate =
      this.comparisonDateRange && this.comparisonDateRange[1] ? new Date(this.comparisonDateRange[1]) : null;

    this.comparisonDateRange = compareStartDate && compareEndDate ? [compareStartDate, compareEndDate] : [];

    this.filterForm = this.fb.group({
      dateRange: [this.dateRange, Validators.required],
      compareDateRange: [this.comparisonDateRange],
      busRouteId: [null],
      status: [null],
    });

    if (this.dateRangeType === 'custom') {
      this.filterForm.get('dateRange')?.enable();
    } else {
      this.filterForm.get('dateRange')?.disable();
    }
  }
  /**
   * Load danh sách tuyến đường
   */
  async loadBusRoutes(): Promise<void> {
    const sub = this.busRoutesService.findAll().subscribe({
      next: (busRoutes) => {
        this.busRoutes = busRoutes;
      },
      error: (error) => {
        console.error('Error loading bus routes:', error);
        toast.error('Không thể tải danh sách tuyến đường');
      },
    });
    this.subscriptions.push(sub);
  }

  /**
   * Reset filter về mặc định
   */
  resetFilter(): void {
    this.initFilterForm();
  }

  /**
   * Export to Excel
   */
  exportToExcel(): void {
    toast.info('Chức năng xuất Excel đang được phát triển');
  }

  /**
   * Get list of booking statuses for filter
   */
  getGoodsStatuses(): { value: string; label: string }[] {
    return Object.entries(this.goodsStatusLabels).map(([value, label]) => ({
      value,
      label,
    }));
  }

  setDateRangeType(type: DateRangeType, force: boolean = false): void {
    if (this.dateRangeType === type && !force) {
      return;
    }

    this.dateRangeType = type;

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

  /**
   * Xử lý khi thay đổi date range type
   */
  private setDefaultComparisonRange(): void {
    const comp = getComparisonRange(this.dateRangeType, this.startDate, this.endDate);
    this.comparisonStartDate = comp.comparisonStartDate;
    this.comparisonEndDate = comp.comparisonEndDate;

    if (this.dateRangeType === 'day') {
      this.filterForm.patchValue({ compareDateRange: new Date(this.comparisonStartDate) }, { emitEvent: false });
    } else {
      this.filterForm.patchValue(
        { compareDateRange: [new Date(this.comparisonStartDate), new Date(this.comparisonEndDate)] },
        { emitEvent: false },
      );
    }
  }

  toggleComparisonMode(): void {
    this.comparisonMode = !this.comparisonMode;
    const compareDateRangeControl = this.filterForm.get('compareDateRange');
    if (this.comparisonMode) {
      compareDateRangeControl?.enable();
      // Set default comparison date range based on dateRangeType
      this.setDefaultComparisonRange();
      // Reset comparison chart details
      this.comparisonChartDetails = [];
    } else {
      compareDateRangeControl?.disable();
      this.comparisonStartDate = undefined;
      this.comparisonEndDate = undefined;
      // Reset comparison data
      this.comparisonChartDetails = [];
      this.comparisonTickets = 0;
      this.comparisonRevenue = 0;
    }
  }

  /**
   * Xử lý export report
   */
  exportReport(type: 'excel' | 'pdf'): void {
    if (type === 'excel') {
      this.exportToExcel();
    }
  }

  ondDataLoadedBookingChart(event: ChartStatsResponse): void {
    console.log('🚀 ~ ondDataLoadedBookingChart ~ event:', event);
    this.totalTickets = event.current.total;

    // Merge booking data with existing revenue data
    this.mergeChartData(event, 'booking');
    console.log('🚀 ~ ondDataLoadedBookingChart ~ chartDetails after merge:', this.chartDetails);

    if (this.comparisonMode && event.previous) {
      this.comparisonTickets = event.previous.total;
      this.mergeChartData(event, 'booking', true);
    }
  }

  ondDataLoadedRevenueChart(event: ChartStatsResponse): void {
    console.log('🚀 ~ ondDataLoadedRevenueChart ~ event:', event);
    this.totalRevenue = event.current.total;

    // Merge revenue data with existing booking data
    this.mergeChartData(event, 'revenue');
    console.log('🚀 ~ ondDataLoadedRevenueChart ~ chartDetails after merge:', this.chartDetails);

    if (this.comparisonMode && event.previous) {
      this.comparisonRevenue = event.previous.total;
      this.mergeChartData(event, 'revenue', true);
    }
  }

  private mergeChartData(event: ChartStatsResponse, type: 'booking' | 'revenue', isComparison: boolean = false): void {
    const sourceData = isComparison ? event.previous : event.current;
    if (!sourceData) return;

    const targetArray = isComparison ? this.comparisonChartDetails : this.chartDetails;
    const labels = sourceData.labels || [];
    const data = sourceData.data || [];

    labels.forEach((label, index) => {
      const value = data[index] || 0;
      const existingIndex = targetArray.findIndex((item) => item.label === label);

      if (existingIndex >= 0) {
        // Update existing record
        if (type === 'booking') {
          targetArray[existingIndex].tickets = value;
        } else {
          targetArray[existingIndex].revenue = value;
        }
      } else {
        // Create new record
        targetArray.push({
          label,
          tickets: type === 'booking' ? value : 0,
          revenue: type === 'revenue' ? value : 0,
        });
      }
    });

    // Sort by label (assumes labels are in chronological order)
    targetArray.sort((a, b) => {
      const indexA = labels.indexOf(a.label);
      const indexB = labels.indexOf(b.label);
      return indexA - indexB;
    });

    this.chartDetails = isComparison ? this.chartDetails : targetArray;
    this.comparisonChartDetails = isComparison ? targetArray : this.comparisonChartDetails;
  }

  /**
   * Reset chart data khi thay đổi date range
   */
  private resetChartData(): void {
    this.chartDetails = [];
    this.comparisonChartDetails = [];
    this.totalTickets = 0;
    this.totalRevenue = 0;
    this.comparisonTickets = 0;
    this.comparisonRevenue = 0;
  }

  /**
   * Xử lý reload
   */
  handleReload(): void {
    this.resetChartData();
  }
}
