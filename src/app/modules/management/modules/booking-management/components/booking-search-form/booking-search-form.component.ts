import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '@rsApp/shared/services/storage.service';
import { Utils } from '@rsApp/shared/utils/utils';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';

@Component({
  selector: 'app-booking-search-form',
  standalone: false,
  templateUrl: './booking-search-form.component.html',
  styleUrl: './booking-search-form.component.scss',
})
export class BookingSearchFormComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  private stationSub: any;

  @Output() findBookingEvent = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ key: string | null; order: 'asc' | 'desc' | null }>();
  bookingSearchForm: FormGroup = new FormGroup({});

  @Input() isLoaded: boolean = false;

  busRoutes: BusRoute[] = [];

  startTimeScheduleValueBusScheduleSearch: Date | null = null;
  endTimeScheduleValueBusScheduleSearch: Date | null = null;

  isBusRouteValid: boolean = false;

  constructor(
    public utils: Utils,
    private router: Router,
    private busRoutesService: BusRoutesService,
    private storageService: StorageService,
    private fb: FormBuilder,
  ) {
    // Initialize form immediately (synchronously) to avoid timing issues
    this.bookingSearchForm = this.fb.group({
      startTimeScheduleValue: [],
      endTimeScheduleValue: [],
      keyword: [''],
      busRouteId: [''],
      sortKey: ['createdAt'],
      sortOrder: ['descend'],
    });
  }

  // Sort options shown in tooltip - defined here so template displays them from TS
  sortOptions: Array<{ key: string; label: string }> = [
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'startDate', label: 'Thời gian chuyến bắt đầu' },
    { key: 'quantity', label: 'Số lượng' },
  ];

  showSortMenu = false;

  // apply sort using values from reactive form
  applySort() {
    const key = this.bookingSearchForm.get('sortKey')?.value || null;
    const order = this.bookingSearchForm.get('sortOrder')?.value || null;
    this.sortChange.emit({ key, order });
  }

  // helper to choose a sort key (writes into form)
  chooseSortKey(key: string) {
    this.bookingSearchForm.patchValue({ sortKey: key });
  }

  // helper to toggle order (writes into form)
  setSortOrder(order: 'ascend' | 'descend') {
    this.bookingSearchForm.patchValue({ sortOrder: order });
  }

  async ngOnInit() {
    await this.initForm();
  }

  async initForm() {
    this.initializeData();
    this.onSubmit();
  }

  get f() {
    return this.bookingSearchForm.controls;
  }

  async initializeData() {
    this.loadBusRoutes();
  }

  loadBusRoutes() {
    this.busRoutesService.findAll(true).subscribe({
      next: (routes: any) => {
        this.busRoutes = routes || [];
      },
      error: () => {
        this.busRoutes = [];
      },
    });
  }

  ngOnDestroy(): void {
    if (this.stationSub) {
      this.stationSub.unsubscribe();
      this.stationSub = null;
    }
  }

  ///////////////////////////////// Time Schedule ////////////////////////////////////////////////////////
  checkDisableDateTime(idx: number): ((current: Date | null) => boolean) & {
    nzDisabledTime: (current?: Date | Date[]) => {
      nzDisabledHours: () => number[];
      nzDisabledMinutes: (selectedHour: number) => number[];
      nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => number[];
    };
  } {
    // Nếu là picker đầu tiên, không giới hạn gì cả
    if (idx === 0) {
      const noop = (_: Date | null) => false;
      (noop as any).nzDisabledTime = () => ({
        nzDisabledHours: () => [],
        nzDisabledMinutes: () => [],
        nzDisabledSeconds: () => [],
      });
      return noop as ((current: Date | null) => boolean) & {
        nzDisabledTime: (current?: Date | Date[]) => {
          nzDisabledHours: () => number[];
          nzDisabledMinutes: (selectedHour: number) => number[];
          nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => number[];
        };
      };
    }

    // Picker thứ hai trở đi: giới hạn dựa trên mốc thời gian trước đó
    const previousDateValue = this.bookingSearchForm.value.startTimeScheduleValue;
    const baseTime = previousDateValue ? new Date(previousDateValue) : new Date();

    const disabledDate = (current: Date | null): boolean => {
      if (!current) return false;
      const baseDay = new Date(baseTime.getFullYear(), baseTime.getMonth(), baseTime.getDate());
      const currentDay = new Date(current.getFullYear(), current.getMonth(), current.getDate());
      return currentDay.getTime() < baseDay.getTime();
    };

    const disabledTime = (current?: Date | Date[]) => {
      const selected = current ? new Date(current as Date) : baseTime;
      const isSameDay = selected.toDateString() === baseTime.toDateString();

      return {
        nzDisabledHours: () => (isSameDay ? Array.from({ length: baseTime.getHours() }, (_, i) => i) : []),
        nzDisabledMinutes: (hour: number) =>
          isSameDay && hour === baseTime.getHours() ? Array.from({ length: baseTime.getMinutes() }, (_, i) => i) : [],
        nzDisabledSeconds: (hour: number, minute: number) =>
          isSameDay && hour === baseTime.getHours() && minute === baseTime.getMinutes()
            ? Array.from({ length: baseTime.getSeconds() }, (_, i) => i)
            : [],
      };
    };

    (disabledDate as any).nzDisabledTime = disabledTime;

    return disabledDate as ((current: Date | null) => boolean) & {
      nzDisabledTime: (current?: Date | Date[]) => {
        nzDisabledHours: () => number[];
        nzDisabledMinutes: (selectedHour: number) => number[];
        nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => number[];
      };
    };
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {}

  formatTime(date: Date | undefined) {
    if (!date) return;
    date = new Date(date);
    return this.utils.formatTime(date);
  }

  formatDate(date: Date | undefined) {
    if (!date) return;
    return this.utils.formatDate(date);
  }

  resetFilter() {
    this.bookingSearchForm.reset();
    this.storageService.remove('currentStationId');
    this.startTimeScheduleValueBusScheduleSearch = null;
    this.endTimeScheduleValueBusScheduleSearch = null;
  }

  clearFormValue(controlName: string) {
    const control = this.bookingSearchForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onSubmit() {
    const {
      busRouteId,
      startTimeScheduleValue,
      endTimeScheduleValue,
      status,
      phoneNumber,
      keyword,
      sortKey,
      sortOrder,
    } = this.bookingSearchForm.value;

    const params = {
      filters: {
        busRouteId: busRouteId || null,

        startDate: startTimeScheduleValue || null,
        endDate: endTimeScheduleValue || null,

        status: status || null,

        phoneNumber: phoneNumber || null,
        keyword: keyword || null,
      },
      sortBy: {
        key: sortKey || null,
        value: sortOrder || null,
      },
    };
    this.findBookingEvent.emit(params);
  }

  goToScan() {
    this.router.navigateByUrl('/scan');
  }
}
