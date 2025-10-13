import { Component, OnInit, ViewChildren, QueryList, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utils } from '@rsApp/shared/utils/utils';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { combineLatest } from 'rxjs';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusService } from '../../../bus-management/pages/bus-services/model/bus-service.model';

@Component({
  selector: 'app-choose-bus-schedule-2-booking-dialog',
  templateUrl: './choose-bus-schedule-2-booking-dialog.component.html',
  styleUrls: ['./choose-bus-schedule-2-booking-dialog.component.scss'],
  standalone: false,
})
export class ChooseBusSchedule2BookingDialogComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  busScheduleSearchForm: FormGroup = new FormGroup({});

  searchKeyword: string = '';
  loading: boolean = false;

  @Input() busRoutes: BusRoute[] = [];
  @Input() busRoute: BusRoute = null as any; // Default to null to avoid undefined errors

  @Input() busSchedules: BusSchedule[] = [];
  @Input() busSchedule: BusSchedule = null as any; // Default to null to avoid undefined errors

  @Input() startTimeScheduleValueBusScheduleSearch: Date | null = null; // Default to null to avoid undefined errors
  @Input() endTimeScheduleValueBusScheduleSearch: Date | null = null; // Default to null to avoid undefined errors

  busSchedulesFiltered: BusSchedule[] = [];

  constructor(private busService: BusService, public utils: Utils, public fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.busScheduleSearchForm = this.fb.group({
      busRouteId: [this.busRoute ? this.busRoute._id : null],
      busScheduleId: [this.busSchedule ? this.busSchedule._id : null],
      startTimeScheduleValue: [this.startTimeScheduleValueBusScheduleSearch],
      endTimeScheduleValue: [this.endTimeScheduleValueBusScheduleSearch],
    });
    this.initializeData();
  }

  async initializeData() {
    this.filterBusSchedules();
  }

  onSearch(keyword: string) {
    this.searchKeyword = keyword;
    this.filterBusSchedules();
  }

  filterBusSchedules() {
    const { busRouteId, startTimeScheduleValue, endTimeScheduleValue } = this.busScheduleSearchForm.value;
    this.busSchedulesFiltered = [...this.busSchedules];

    // Bắt đầu từ toàn bộ danh sách
    if (busRouteId) {
      this.busSchedulesFiltered = this.busSchedules.filter((s) => s.busRouteId === busRouteId);
    }

    // Lọc theo từ khóa tìm kiếm
    if (this.searchKeyword) {
      this.busSchedulesFiltered = this.busSchedulesFiltered.filter(
        (busSchedule: BusSchedule) =>
          busSchedule.bus?.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          (busSchedule.startDate && (this.formatDate(busSchedule.startDate) ?? '').includes(this.searchKeyword)) ||
          (busSchedule.startDate && (this.formatTime(busSchedule.startDate) ?? '').includes(this.searchKeyword)) ||
          (busSchedule.endDate && (this.formatDate(busSchedule.endDate) ?? '').includes(this.searchKeyword)) ||
          (busSchedule.endDate && (this.formatTime(busSchedule.endDate) ?? '').includes(this.searchKeyword)) ||
          (busSchedule.startDate &&
            (this.formatTime(busSchedule.startDate) + ' - ' + (this.formatDate(busSchedule.startDate) ?? '')).includes(
              this.searchKeyword,
            )) ||
          (busSchedule.endDate &&
            (this.formatTime(busSchedule.endDate) + ' - ' + (this.formatDate(busSchedule.endDate) ?? '')).includes(
              this.searchKeyword,
            )),
      );
    }

    // Lọc theo thời gian nếu có (và chưa lọc theo route)
    if (startTimeScheduleValue) {
      this.busSchedulesFiltered = this.busSchedulesFiltered.filter(
        (s) => s.startDate && new Date(s.startDate) >= startTimeScheduleValue,
      );
    } else if (endTimeScheduleValue) {
      this.busSchedulesFiltered = this.busSchedulesFiltered.filter(
        (s) => s.startDate && new Date(s.startDate) <= endTimeScheduleValue,
      );
    }

    // Sắp xếp theo startDate tăng dần
    this.busSchedulesFiltered.sort((a, b) => {
      const dateA = a.startDate && new Date(a.startDate).getTime();
      const dateB = b.startDate && new Date(b.startDate).getTime();
      return (dateA ?? 0) - (dateB ?? 0);
    });
  }

  ///////////////////////////////// Choose  Bus Route ////////////////////////////////////////////////////////
  async chooseBusRoute() {
    this.busRoute =
      this.busRoutes.find((r: BusRoute) => r._id === this.busScheduleSearchForm.value.busRouteId) || (null as any);
    this.busScheduleSearchForm.patchValue({
      busScheduleId: null, // Reset busScheduleId when busRoute changes
    });
    this.filterBusSchedules();
  }

  ///////////////////////////////// Choose  Bus Schedule ////////////////////////////////////////////////////////
  chooseBusSchedule(busScheduleId: string) {
    this.busSchedule = this.busSchedules.find((s: BusSchedule) => s._id === busScheduleId) || (null as any);
  }

  ///////////////////////////////// Choose  Status ////////////////////////////////////////////////////////
  chooseStatus(status: string) {}

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
    const previousDateValue = this.busScheduleSearchForm.value.startTimeScheduleValue;
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
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  ///////////////////////////////// Time Schedule Change ////////////////////////////////////////////////////////
  timeScheduleChange(timeSchedule: any) {
    this.busScheduleSearchForm.patchValue({
      busScheduleId: null, // Reset busScheduleId when busRoute changes
    });
    this.filterBusSchedules();
  }

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
    this.busScheduleSearchForm.reset();
    this.busRoute = null as any;
    this.busSchedule = null as any;
    this.busSchedulesFiltered = [...this.busSchedules]; // Reset to all schedules
    this.startTimeScheduleValueBusScheduleSearch = null;
    this.endTimeScheduleValueBusScheduleSearch = null;
    this.filterBusSchedules(); // Reapply filter to show all schedules
  }

  onSubmit() {
    // this.modalCtrl.dismiss({
    //   selectedData: {
    //     busRoute: this.busRoute,
    //     busSchedule: this.busSchedule,
    //     startTimeScheduleValueBusScheduleSearch: this.busScheduleSearchForm.value.startTimeScheduleValue,
    //     endTimeScheduleValueBusScheduleSearch: this.busScheduleSearchForm.value.endTimeScheduleValue,
    //   },
    // });
  }
}
