import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { BusScheduleAutoGeneratorsService } from '../../service/bus-schedule-autogenerators.servive';
import {
  BusScheduleAutoGenerator,
  BusScheduleAutoGenerator2Create,
  BusScheduleAutoGenerator2Update,
  SpecificTimeSlot,
  SpecificTimeSlot2Create,
} from '../../model/bus-schedule-autogenerator.model';
import { combineLatest, EMPTY, switchMap, tap, of, map, catchError } from 'rxjs';
import { BusScheduleTemplatesService } from '../../../bus-schedule-templates/service/bus-schedule-templates.servive';
import { BusScheduleTemplate } from '../../../bus-schedule-templates/model/bus-schedule-template.model';
import moment from 'moment';
import { SETTING_CONSTANTS } from '@rsApp/core/constants/setting.constants';
import { SettingCacheService } from '@rsApp/modules/settings/services/setting-cache.service';
import { SettingService } from '@rsApp/modules/settings/services/setting.service';

@Component({
  selector: 'app-bus-schedule-autogenerator-detail',
  templateUrl: './bus-schedule-autogenerator-detail.component.html',
  styleUrl: './bus-schedule-autogenerator-detail.component.scss',
  standalone: false,
})
export class BusScheduleAutoGeneratorDetailComponent implements OnInit {
  busScheduleAutoGeneratorDetailForm!: FormGroup;

  @Input() busScheduleAutoGenerator!: BusScheduleAutoGenerator;
  @Input() startDate?: Date;
  @Input() isDialog: boolean = false;

  daysOfWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  busScheduleAutoGeneratorStatuses = [
    {
      value: 'un_published',
      label: 'Chưa xuất bản',
    },
    {
      value: 'scheduled',
      label: 'Đã lên lịch',
    },
    {
      value: 'cancelled',
      label: 'Đã hủy',
    },
    {
      value: 'in_progress',
      label: 'Đang diễn ra',
    },
    {
      value: 'completed',
      label: 'Đã hoàn thành',
    },
  ];

  busScheduleTemplates: BusScheduleTemplate[] = [];

  isNonEndDate: boolean = false;

  minimumAllowedTime: Date = new Date(new Date().getTime() + 60 * 60 * 1000);

  @Output() createScheduleEvent = new EventEmitter<BusScheduleAutoGenerator>();
  @Output() saveScheduleEvent = new EventEmitter<BusScheduleAutoGenerator>();

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busScheduleAutoGeneratorsService: BusScheduleAutoGeneratorsService,
    private busScheduleTemplatesService: BusScheduleTemplatesService,
    private settingCacheService: SettingCacheService,
    private settingService: SettingService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    // Chỉ lấy từ history.state nếu không có giá trị từ @Input()
    if (!this.busScheduleAutoGenerator) {
      const params = history.state;
      if (params && params['busScheduleAutoGenerator']) {
        this.busScheduleAutoGenerator = JSON.parse(params['busScheduleAutoGenerator']);
      }
    }
  }

  initData() {
    let findAllBusScheduleTemplates = this.busScheduleTemplatesService.findAll();

    let request = [findAllBusScheduleTemplates];
    combineLatest(request).subscribe(async ([busScheduleTemplates]) => {
      this.busScheduleTemplates = busScheduleTemplates;
      this.loadSettings();
    });
  }

  loadSettings() {
    this.settingCacheService
      .getSettingByName(SETTING_CONSTANTS.BUS_SCHEDULE_AVAILABILITY_CUTOFF)
      .pipe(
        switchMap((cached) => {
          if (cached?.value != null) {
            return of(cached.value);
          }
          return this.settingService.getSettingByName(SETTING_CONSTANTS.BUS_SCHEDULE_AVAILABILITY_CUTOFF).pipe(
            tap((setting) => {
              if (setting?.value != null) {
                // cache the value for subsequent reads
                this.settingCacheService.createOrUpdate(setting).subscribe({ error: () => {} });
              }
            }),
            map((setting) => setting?.value ?? null),
            catchError(() => of(null)),
          );
        }),
        catchError(() => of(null)),
      )
      .subscribe({
        next: (cutoffValue) => this.applyCutoff(cutoffValue),
        error: () => this.initForm(),
      });
  }

  private applyCutoff(cutoffValue: string | null | undefined) {
    if (cutoffValue != null) {
      this.minimumAllowedTime = new Date(new Date().getTime() + this.utils.parseTimeHmToMilliseconds(cutoffValue));
      console.log(
        '🚀 ~ BusScheduleAutoGeneratorDetailComponent ~ applyCutoff ~ this.minimumAllowedTime:',
        this.minimumAllowedTime,
      );
    }
    this.initForm();
  }

  async initForm() {
    const {
      name = '',
      busScheduleTemplateId = '',
      startDate = this.minimumAllowedTime.toISOString(),
      endDate = '',
      repeatType = 'days',
      specificTimeSlots = [],
      repeatInterval = 1,
      repeatDaysPerWeek = [],
      preGenerateDays = 0,
      status = 'un_published',
    } = this.busScheduleAutoGenerator || {};

    this.busScheduleAutoGeneratorDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      status: [status, [Validators.required]],
      busScheduleTemplateId: [busScheduleTemplateId, [Validators.required]],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, endDate ? [Validators.required] : []],
      repeatType: [repeatType, [Validators.required]],
      repeatInterval: [repeatInterval],
      specificTimeSlots: this.fb.array([
        this.fb.group({
          timeSlot: [this.minimumAllowedTime.toISOString(), Validators.required],
        }),
      ]),
      repeatDaysPerWeek: [repeatDaysPerWeek, repeatType == 'weeks' ? [Validators.required] : []],
      preGenerateDays: [preGenerateDays],
    });

    if (specificTimeSlots && specificTimeSlots.length > 0) {
      this.specificTimeSlots.clear();
      for (const specificTimeSlot of specificTimeSlots) {
        this.specificTimeSlots.push(this.createSpecificTimeSlot(specificTimeSlot.timeSlot));
      }
    }
    this.isNonEndDate = !endDate;
  }

  get repeatType(): FormArray {
    return this.busScheduleAutoGeneratorDetailForm.get('repeatType') as FormArray;
  }

  get specificTimeSlots(): FormArray {
    return this.busScheduleAutoGeneratorDetailForm.get('specificTimeSlots') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  changeRepeatType(repeatType: string) {
    const form = this.busScheduleAutoGeneratorDetailForm;
    const daysControl = form.get('repeatDaysPerWeek');
    repeatType === 'weeks' ? daysControl?.setValidators(Validators.required) : daysControl?.clearAsyncValidators();
    form.get('endDate')?.updateValueAndValidity();
  }

  chooseDayOfWeek(day: string): void {
    const control = this.busScheduleAutoGeneratorDetailForm.get('repeatDaysPerWeek');
    if (!control) return;

    let currentDays: string[] = control.value || [];

    // Toggle the day: if it exists, remove it; if not, add it.
    if (currentDays.includes(day)) {
      currentDays = currentDays.filter((d) => d !== day);
    } else {
      currentDays.push(day);
    }

    control.setValue(currentDays);
    control.updateValueAndValidity();
  }

  createSpecificTimeSlot(timeSlot?: string): FormGroup {
    // Lấy FormArray chứa các specific time slots
    const specificTimeSlots = this.busScheduleAutoGeneratorDetailForm.get('specificTimeSlots') as FormArray;
    let defaultTime: Date = new Date(this.minimumAllowedTime);
    const [hours, minutes, seconds] = (timeSlot ?? '00:00:00').split(':').map(Number);

    defaultTime.setHours(hours);
    defaultTime.setMinutes(minutes);
    defaultTime.setSeconds(seconds);

    if (!timeSlot && specificTimeSlots && specificTimeSlots.length > 0) {
      // Lấy phần tử cuối cùng trong FormArray
      const previousTimeValue = specificTimeSlots.at(specificTimeSlots.length - 1).get('timeSlot')?.value;
      if (previousTimeValue) {
        const previousDate = new Date(previousTimeValue);
        // Tăng thêm 5 phút cho ngày/thời gian của phần tử trước đó
        previousDate.setMinutes(previousDate.getMinutes() + 5);
        defaultTime = previousDate;
      }
    }

    return this.fb.group({
      timeSlot: [defaultTime, Validators.required],
    });
  }

  addSpecificTimeSlot() {
    this.specificTimeSlots.push(this.createSpecificTimeSlot());
  }

  removeSpecificTimeSlot(index: number): void {
    if (index >= 0 && index < this.specificTimeSlots.length) {
      this.specificTimeSlots.removeAt(index);
    } else {
      console.warn(`Invalid index ${index}. Cannot remove breakpoint.`);
    }
  }

  selectIsEndDate() {
    const endDateControl = this.busScheduleAutoGeneratorDetailForm.get('endDate');
    this.isNonEndDate ? endDateControl?.clearValidators() : endDateControl?.setValidators(Validators.required);
    endDateControl?.updateValueAndValidity();
  }

  specificTimeSlotChange(idx: number) {
    // Lấy control hiện tại tại vị trí idx
    const currentControl = this.specificTimeSlots.at(idx);
    const currentTimeValue = currentControl.value.timeSlot;

    if (!currentTimeValue) {
      return; // Nếu không có giá trị thì không xử lý
    }

    // Chuyển đổi giá trị thành đối tượng Date
    let baselineTime = new Date(currentTimeValue);

    // Duyệt qua các item picker sau idx
    for (let i = idx + 1; i < this.specificTimeSlots.length; i++) {
      const control = this.specificTimeSlots.at(i);
      const nextTimeValue = control.value.timeSlot;
      const nextTime = nextTimeValue ? new Date(nextTimeValue) : null;

      // Tính thời gian mong muốn cho picker tiếp theo = baselineTime + 10 phút
      const expectedTime = new Date(baselineTime.getTime() + 5 * 60 * 1000);

      // Nếu picker kế tiếp chưa có giá trị hoặc có giá trị nhỏ hơn expectedTime
      if (!nextTime || nextTime.getTime() < expectedTime.getTime()) {
        control.patchValue({ timeSlot: expectedTime });
        // Cập nhật baselineTime thành expectedTime để tính cho picker tiếp theo
        baselineTime = expectedTime;
      } else {
        // Nếu picker kế tiếp đã có giá trị >= expectedTime, cho phép giữ nguyên và sử dụng giá trị đó làm baseline cho bước sau
        baselineTime = nextTime;
      }
    }
  }

  checkTimeDisableTime(idx: number): {
    nzDisabledHours: () => number[];
    nzDisabledMinutes: (selectedHour: number) => number[];
    nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => number[];
  } {
    if (idx === 0) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      return {
        nzDisabledHours: () => {
          // Disable tất cả các giờ nhỏ hơn giờ hiện tại.
          return Array.from({ length: currentHour }, (_, i) => i);
        },
        nzDisabledMinutes: (selectedHour: number) => {
          // Nếu giờ chọn trùng với giờ hiện tại, disable các phút nhỏ hơn phút hiện tại.
          if (selectedHour === currentHour) {
            return Array.from({ length: currentMinute }, (_, i) => i);
          }
          return [];
        },
        nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => {
          // Nếu giờ và phút được chọn trùng với giờ và phút hiện tại, disable các giây nhỏ hơn.
          if (selectedHour === currentHour && selectedMinute === currentMinute) {
            return Array.from({ length: currentSecond }, (_, i) => i);
          }
          return [];
        },
      };
    } else {
      // Lấy FormArray chứa các specificTimeSlots (đã có trong form của bạn)
      const formArray = this.busScheduleAutoGeneratorDetailForm.get('specificTimeSlots') as FormArray;
      const previousControl = formArray.at(idx - 1)?.get('timeSlot');
      let baseTime = new Date(); // fallback là thời gian hiện tại
      if (previousControl && previousControl.value) {
        baseTime = new Date(previousControl.value);
        // Tăng 5 phút từ thời gian của picker liền trước
        baseTime.setMinutes(baseTime.getMinutes() + 5);
      }
      const baseHour = baseTime.getHours();
      const baseMinute = baseTime.getMinutes();
      const baseSecond = baseTime.getSeconds();

      return {
        nzDisabledHours: () => {
          // Disable mọi giờ nhỏ hơn baseHour
          return Array.from({ length: baseHour }, (_, i) => i);
        },
        nzDisabledMinutes: (selectedHour: number) => {
          if (selectedHour === baseHour) {
            // Nếu giờ đã chọn trùng với baseHour, disable các phút nhỏ hơn baseMinute
            return Array.from({ length: baseMinute }, (_, i) => i);
          }
          return [];
        },
        nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => {
          if (selectedHour === baseHour && selectedMinute === baseMinute) {
            // Nếu giờ và phút trùng với baseHour, baseMinute, disable các giây nhỏ hơn baseSecond
            return Array.from({ length: baseSecond }, (_, i) => i);
          }
          return [];
        },
      };
    }
  }

  checkDateDisableDate(idx: number): (current: Date) => boolean {
    // Nếu là picker đầu tiên, vô hiệu hóa các ngày nhỏ hơn ngày hiện tại.
    if (idx === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (current: Date): boolean => current < today;
    }

    // Với các picker khác, lấy ngày đã chọn tại picker trước đó.

    const previousDateValue = this.busScheduleAutoGeneratorDetailForm.get('startDate')?.value;
    if (previousDateValue) {
      const minDate = new Date(previousDateValue);
      // Tăng thêm 1 ngày
      minDate.setDate(minDate.getDate() + 1);
      minDate.setHours(0, 0, 0, 0);
      return (current: Date): boolean => current < minDate;
    }

    // Nếu không có giá trị picker trước, dùng ngày hiện tại làm mốc.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (current: Date): boolean => current < today;
  }

  onSubmit() {
    if (!this.busScheduleAutoGeneratorDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleAutoGeneratorDetailForm);
      return;
    }

    const data = this.busScheduleAutoGeneratorDetailForm.getRawValue() as BusScheduleAutoGenerator2Create;

    if (this.isNonEndDate) {
      data.endDate = null;
    }

    const busScheduleAutoGenerator2Create: BusScheduleAutoGenerator2Create = {
      ...data,
      specificTimeSlots: data.specificTimeSlots.map((specificTimeSlot: SpecificTimeSlot2Create) => {
        const timeSlotDate = new Date(specificTimeSlot.timeSlot);

        const hour = timeSlotDate.getHours().toString().padStart(2, '0');
        const minutes = timeSlotDate.getMinutes().toString().padStart(2, '0');
        const seconds = timeSlotDate.getSeconds().toString().padStart(2, '0');

        const timeSlot = `${hour}:${minutes}:${seconds}`;

        return {
          timeSlot: timeSlot,
        };
      }) as SpecificTimeSlot2Create[],
    };
    if (this.busScheduleAutoGenerator) {
      const busScheduleAutoGenerator2Update = {
        ...busScheduleAutoGenerator2Create,
        _id: this.busScheduleAutoGenerator._id,
      };

      this.updateBus(busScheduleAutoGenerator2Update);
      return;
    }

    this.createBus(busScheduleAutoGenerator2Create);
  }

  updateBus(busScheduleAutoGenerator2Update: BusScheduleAutoGenerator2Update) {
    this.busScheduleAutoGeneratorsService.updateBusScheduleAutoGenerator(busScheduleAutoGenerator2Update).subscribe({
      next: (res: BusScheduleAutoGenerator) => {
        if (res) {
          const updatedState = { ...history.state, busScheduleAutoGenerator: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.busScheduleAutoGenerator = res;
          toast.success('Bus Route update successfully');
          this.saveScheduleEvent.emit(res);
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBus(busScheduleAutoGenerator2Create: BusScheduleAutoGenerator2Create) {
    this.busScheduleAutoGeneratorsService.createBusScheduleAutoGenerator(busScheduleAutoGenerator2Create).subscribe({
      next: (res: BusScheduleAutoGenerator) => {
        if (res) {
          this.busScheduleAutoGenerator = res;
          const updatedState = { ...history.state, busScheduleAutoGenerator: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Bus Route added successfully');
          this.createScheduleEvent.emit(res);
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
