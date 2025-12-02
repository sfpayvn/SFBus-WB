import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Utils } from '@rsApp/shared/utils/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { ChooseBusSchedule2BookingDialogComponent } from '../choose-bus-schedule-2-booking-dialog/choose-bus-schedule-2-booking-dialog.component';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';

@Component({
  selector: 'app-booking-search-form',
  standalone: false,
  templateUrl: './booking-search-form.component.html',
  styleUrl: './booking-search-form.component.scss',
})
export class BookingSearchFormComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  @Output() findBookingEvent = new EventEmitter<any>();
  bookingSearchForm: FormGroup = new FormGroup({});

  @Input() busRoutes: BusRoute[] = [];
  busRoute: BusRoute = null as any;

  @Input() busSchedules: BusSchedule[] = [];
  busSchedule: BusSchedule = null as any;

  @Input() isLoaded: boolean = false;

  startTimeScheduleValueBusScheduleSearch: Date | null = null;
  endTimeScheduleValueBusScheduleSearch: Date | null = null;

  isBusRouteValid: boolean = false;

  statuses: any = [
    { value: 'reserved', label: 'ĐÃ ĐẶT' },
    { value: 'paid', label: 'ĐÃ THANH TOÁN' },
    { value: 'deposited', label: 'ĐÃ ĐẶT CỌC' },
  ];

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private busRoutesService: BusRoutesService,
    private busSchedulesService: BusSchedulesService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookingSearchForm = this.fb.group({
      startTimeScheduleValue: [],
      endTimeScheduleValue: [],
      status: [],
      phoneNumber: [''],
      keyword: [''],
    });
    this.initializeData();
  }

  async initializeData() {
    const findBusRouteRequest = this.busRoutesService.findAll();
    const findBusSchedulesRequest = this.busSchedulesService.findAll(); // lấy data to test

    combineLatest([findBusRouteRequest, findBusSchedulesRequest]).subscribe(([busRoutes, busSchedules]) => {
      this.busRoutes = busRoutes;
      this.busSchedules = busSchedules;
    });
  }

  ///////////////////////////////// Choose  Status ////////////////////////////////////////////////////////
  chooseStatus(status: string) {
    this.bookingSearchForm.patchValue({ status });
  }

  ///////////////////////////////// Choose  Bus Route ////////////////////////////////////////////////////////

  clearBusRoute(event: MouseEvent | null = null) {
    event?.stopPropagation();
    this.busRoute = null as any;
    this.busSchedule = null as any;
    this.startTimeScheduleValueBusScheduleSearch = null;
    this.endTimeScheduleValueBusScheduleSearch = null;
  }

  async chooseBusRoute(event: MouseEvent) {
    const dataInput = {
      busRoutes: this.busRoutes,
      busRoute: this.busRoute,

      busSchedules: this.busSchedules,
      busSchedule: this.busSchedule,

      startTimeScheduleValueBusScheduleSearch: this.startTimeScheduleValueBusScheduleSearch,
      endTimeScheduleValueBusScheduleSearch: this.endTimeScheduleValueBusScheduleSearch,
    };

    this.utilsModal
      .openContextModal(ChooseBusSchedule2BookingDialogComponent, dataInput, event, '#chooseBusRoute')
      ?.subscribe((res) => {
        if (res) {
          this.busRoute = res.busRoute;
          this.busSchedule = res.busSchedule;
          this.startTimeScheduleValueBusScheduleSearch = res.startTimeScheduleValueBusScheduleSearch;
          this.endTimeScheduleValueBusScheduleSearch = res.endTimeScheduleValueBusScheduleSearch;
        }
      });
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
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  ///////////////////////////////// Time Schedule Change ////////////////////////////////////////////////////////
  timeScheduleChange(timeSchedule: any) {}

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
    this.busRoute = null as any;
    this.busSchedule = null as any;
    this.startTimeScheduleValueBusScheduleSearch = null;
    this.endTimeScheduleValueBusScheduleSearch = null;
  }

  clearFormValue(controlName: string) {
    console.log('🚀 ~ BookingDetailComponent ~ clearFormValue ~ controlName:', controlName);
    const control = this.bookingSearchForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onSubmit() {
    const params = {
      busRouteId: this.busRoute ? this.busRoute._id : null,
      busScheduleId: this.busSchedule ? this.busSchedule._id : null,

      startDate: this.bookingSearchForm.value.startTimeScheduleValue || null,
      endDate: this.bookingSearchForm.value.endTimeScheduleValue || null,

      status: this.bookingSearchForm.value.status || null,

      phoneNumber: this.bookingSearchForm.value.phoneNumber || null,
      keyword: this.bookingSearchForm.value.keyword || null,
    };
    this.findBookingEvent.emit(params);
  }

  goToScan() {
    this.router.navigateByUrl('/scan');
  }
}
