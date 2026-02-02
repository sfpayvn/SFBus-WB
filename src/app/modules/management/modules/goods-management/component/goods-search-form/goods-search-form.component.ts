import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Utils } from '@rsApp/shared/utils/utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '@rsApp/shared/services/storage.service';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusStation } from '../../../bus-management/pages/bus-stations/model/bus-station.model';
import { BusStationsService } from '../../../bus-management/pages/bus-stations/service/bus-stations.servive';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-goods-search-form',
  standalone: false,
  templateUrl: './goods-search-form.component.html',
  styleUrl: './goods-search-form.component.scss',
})
export class GoodsSearchFormComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  private stationSub: any;

  @Output() findGoodsEvent = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ key: string | null; order: 'asc' | 'desc' | null }>();
  goodsSearchForm: FormGroup = new FormGroup({});

  busStationsOffices: BusStation[] = [];

  @Input() isLoaded: boolean = false;

  busRoutes: BusRoute[] = [];

  startTimeScheduleValueBusScheduleSearch: Date | null = null;
  endTimeScheduleValueBusScheduleSearch: Date | null = null;

  isBusRouteValid: boolean = false;

  constructor(
    public utils: Utils,
    private router: Router,
    private storageService: StorageService,
    private fb: FormBuilder,
    private busRoutesService: BusRoutesService,
  ) {
    // Initialize form immediately (synchronously) to avoid timing issues
    this.goodsSearchForm = this.fb.group({
      startTimeScheduleValue: [],
      endTimeScheduleValue: [],
      keyword: [''],
      busRouteId: [''],
      busStationOfficeId: [''],
      // sort controls
      sortKey: ['createdAt'],
      sortOrder: ['descend'],
    });
  }

  // Sort options shown in tooltip - defined here so template displays them from TS
  sortOptions: Array<{ key: string; label: string }> = [
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'goodsImportant', label: 'Quan trọng' },
    { key: 'goodsPriority', label: 'Ưu tiên' },
    { key: 'startDateSchedule', label: 'Thời gian chuyến bắt đầu' },
    { key: 'quantity', label: 'Số lượng' },
  ];

  showSortMenu = false;

  // apply sort using values from reactive form
  applySort() {
    const key = this.goodsSearchForm.get('sortKey')?.value || null;
    const order = this.goodsSearchForm.get('sortOrder')?.value || null;
    this.sortChange.emit({ key, order });
  }

  // helper to choose a sort key (writes into form)
  chooseSortKey(key: string) {
    this.goodsSearchForm.patchValue({ sortKey: key });
  }

  // helper to toggle order (writes into form)
  setSortOrder(order: 'ascend' | 'descend') {
    this.goodsSearchForm.patchValue({ sortOrder: order });
  }

  async ngOnInit() {
    await this.initForm();
  }

  async initForm() {
    this.initializeData();
  }

  async loadBusRoutes() {
    try {
      this.busRoutes = (await firstValueFrom(this.busRoutesService.findAll(true))) || [];
    } catch (err) {
      this.busRoutes = [];
    }
  }

  get f() {
    return this.goodsSearchForm.controls;
  }

  async initializeData() {
    await this.loadBusRoutes();
    if (this.busStationsOffices.length > 0) {
      this.onSubmit();
      return;
    }
    this.onSubmit();
  }

  ngOnDestroy(): void {
    if (this.stationSub) {
      this.stationSub.unsubscribe();
      this.stationSub = null;
    }
  }

  /**
   * Called when user changes selected bus station.
   * Uses nz-select/ngModelChange event to fetch routes from server.
   */

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
    const previousDateValue = this.goodsSearchForm.value.startTimeScheduleValue;
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
    this.goodsSearchForm.reset();
    this.storageService.remove('currentStationId');
    this.startTimeScheduleValueBusScheduleSearch = null;
    this.endTimeScheduleValueBusScheduleSearch = null;
  }

  clearFormValue(controlName: string) {
    const control = this.goodsSearchForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onSubmit() {
    const {
      busRouteId,
      busStationOfficeId,
      startTimeScheduleValue,
      endTimeScheduleValue,
      status,
      phoneNumber,
      keyword,
      sortKey,
      sortOrder,
    } = this.goodsSearchForm.value;

    const params = {
      filters: {
        busRouteId: busRouteId || null,
        busStationOfficeId: busStationOfficeId || null,

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
    this.findGoodsEvent.emit(params);
  }

  goToScan() {
    this.router.navigateByUrl('/scan');
  }
}
