import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusScheduleAutoGeneratorsService } from './service/bus-schedule-autogenerators.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import {
  BusScheduleAutoGenerator,
  BusScheduleAutoGenerator2Create,
  SearchBusScheduleAutoGenerator,
  SpecificTimeSlot,
} from './model/bus-schedule-autogenerator.model';
import moment from 'moment';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { EVENT_STATUS, EVENT_STATUS_CLASSES } from 'src/app/core/constants/status.constants';
import { BusScheduleAutogeneratorsDetailDialogComponent } from './components/bus-schedule-autogenerators-detail-dialog/bus-schedule-autogenerators-detail-dialog.component';

export interface CalendarEvent {
  _id: string;
  name: string;
  startDate: Date;
  status: string;
}

@Component({
  selector: 'app-bus-schedules',
  templateUrl: './bus-schedule-autogenerator.component.html',
  styleUrls: ['./bus-schedule-autogenerator.component.scss'],
  standalone: false,
})
export class BusScheduleAutoGeneratorsComponent implements OnInit {
  searchBusScheduleAutoGenerator: SearchBusScheduleAutoGenerator = new SearchBusScheduleAutoGenerator();

  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  searchParams = {
    pageIdx: 1,
    pageSize: 5,
    keyword: '',
    sortBy: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  totalPage: number = 0;
  totalItem: number = 0;

  isLoadingBusScheduleAutoGenerator: boolean = false;

  viewDisplayMode: string = 'calendar';
  viewMode: 'list' | 'day' | 'week' | 'month' = 'month';

  calendarEvents: CalendarEvent[] = [];

  statusClasses = EVENT_STATUS_CLASSES;

  busScheduleAutoGeneratorStatuses: { [key: string]: string } = {
    un_published: 'Chưa xuất bản',
    scheduled: 'Đã lên lịch',
    cancelled: 'Đã hủy',
    in_progress: 'Đang diễn ra',
    completed: 'Đã hoàn thành',
    overdue: 'Quá hạn',
  };

  constructor(
    private busScheduleAutoGeneratorsService: BusScheduleAutoGeneratorsService,
    private dialog: MatDialog,
    private utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.setParamsToSearch();
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusScheduleAutoGenerator = true;
    this.busScheduleAutoGeneratorsService.searchBusScheduleAutoGenerator(this.searchParams).subscribe({
      next: async (res: SearchBusScheduleAutoGenerator) => {
        if (res) {
          this.searchBusScheduleAutoGenerator = res;
          console.log(
            '🚀 ~ BusesComponent ~ this.busScheduleAutoGeneratorsService.searchBus ~ this.searchBusScheduleAutoGenerator:',
            this.searchBusScheduleAutoGenerator,
          );
          this.totalItem = this.searchBusScheduleAutoGenerator.totalItem;
          this.totalPage = this.searchBusScheduleAutoGenerator.totalPage;
          this.calendarEvents = await this.convertToCalendarEventData(
            this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators,
          );
        }
        this.isLoadingBusScheduleAutoGenerator = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusScheduleAutoGenerator = false;
      },
    });
  }

  setParamsToSearch() {
    if (this.viewDisplayMode === 'calendar') {
      this.searchParams.pageSize = 999999999;
      this.calcStartEndDate();
    } else {
      this.searchParams = {
        pageIdx: 1,
        startDate: null,
        endDate: null,
        pageSize: 5,
        keyword: '',
        sortBy: '',
      };
    }
  }

  calcStartEndDate() {
    const currentDate = new Date(); // Lấy ngày hiện tại

    if (this.viewMode === 'week') {
      const dayOfWeek = currentDate.getDay(); // 0 = Chủ nhật, 1 = Thứ hai, ...
      // Tính ngày đầu tuần (Thứ hai)
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Điều chỉnh Chủ nhật về Thứ hai trước đó
      // Tính ngày cuối tuần (Chủ nhật)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Thêm 6 ngày để đến Chủ nhật cuối tuần
      endOfWeek.setHours(23, 59, 59, 999); // Set thời gian cuối ngày
      startOfWeek.setHours(0, 0, 0, 0);
      this.searchParams.startDate = startOfWeek;
      this.searchParams.endDate = endOfWeek;
    } else if (this.viewMode === 'month') {
      // Tính ngày đầu tháng
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      // Tính ngày cuối tháng
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999); // Set thời gian cuối ngày
      startOfMonth.setHours(0, 0, 0, 0);
      this.searchParams.startDate = startOfMonth;
      this.searchParams.endDate = endOfMonth;
    } else if (this.viewMode === 'day') {
      // Tính toán cho chế độ ngày
      const startOfDay = new Date(currentDate);
      const endOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0); // Thời gian đầu ngày
      endOfDay.setHours(23, 59, 59, 999); // Thời gian cuối ngày
      this.searchParams.startDate = startOfDay;
      this.searchParams.endDate = endOfDay;
    }
  }

  onCurrentPageDataChange(event: any): void {
    const busScheduleAutoGenerators = event as readonly BusScheduleAutoGenerator[];
    this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators = [...busScheduleAutoGenerators];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators.forEach(({ _id }) =>
      this.updateCheckedSet(_id, checked),
    );
    this.refreshCheckedStatus();
  }

  updateCheckedSet(_id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(_id);
    } else {
      this.setOfCheckedId.delete(_id);
    }
  }

  onItemChecked(_id: string, checked: boolean): void {
    this.updateCheckedSet(_id, checked);
    this.refreshCheckedStatus();
  }

  deleteBusScheduleAutoGenerator(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete Bus',
        content:
          'Are you sure you want to delete this bus? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busScheduleAutoGeneratorsService.deleteBusScheduleAutoGenerator(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators =
                this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators.filter((bus) => bus._id !== id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusScheduleAutoGenerator(busScheduleAutoGenerator: any): void {
    if (this.viewDisplayMode == 'calendar') {
      const busScheduleAutoGenerator2Edit = this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators.find(
        (b: BusScheduleAutoGenerator) => b._id == busScheduleAutoGenerator._id,
      );
      this.utilsModal
        .openModal(
          BusScheduleAutogeneratorsDetailDialogComponent,
          { busScheduleAutoGenerator: busScheduleAutoGenerator2Edit },
          'large',
        )
        .subscribe((isReloadData: boolean) => {
          if (!isReloadData) return;
          this.loadData();
        });
      return;
    }
    const params = { busScheduleAutoGenerator: JSON.stringify(busScheduleAutoGenerator) };
    this.router.navigateByUrl(
      '/management/bus-management/bus-schedule/bus-schedule-autogenerators/bus-schedule-autogenerator-detail',
      { state: params },
    );
  }

  addBusScheduleAutoGenerator(startDate?: Date): void {
    if (this.viewDisplayMode == 'calendar') {
      this.utilsModal
        .openModal(BusScheduleAutogeneratorsDetailDialogComponent, { startDate }, 'large')
        .subscribe((busScheduleAutoGenerator: BusScheduleAutoGenerator) => {
          if (!busScheduleAutoGenerator) return;
          this.loadData();
        });
      return;
    }
    this.router.navigate([
      '/management/bus-management/bus-schedule/bus-schedule-autogenerators/bus-schedule-autogenerator-detail',
    ]);
  }

  cloneData(busScheduleAutoGenerator: BusScheduleAutoGenerator): void {
    delete (busScheduleAutoGenerator as any)._id;
    let busScheduleAutoGenerator2Create = new BusScheduleAutoGenerator2Create();
    busScheduleAutoGenerator2Create = { ...busScheduleAutoGenerator2Create, ...busScheduleAutoGenerator };

    this.busScheduleAutoGeneratorsService.createBusScheduleAutoGenerator(busScheduleAutoGenerator2Create).subscribe({
      next: (res: BusScheduleAutoGenerator) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  reloadBusScheduleAutoGeneratorPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchBusScheduleAutoGeneratorPage(keyword: string) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadData();
  }

  sortBusScheduleAutoGeneratorPage(sortBy: string) {
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadData();
  }

  reLoadDataEvent(params: { startDate: Date; endDate: Date }): void {
    this.searchParams = {
      ...this.searchParams,
      ...params,
    };
    // Xử lý logic theo khoảng thời gian startDate và endDate
    this.loadData();
  }

  changeviewDisplayMode(viewDisplayMode: string) {
    this.viewDisplayMode = viewDisplayMode;
    this.setParamsToSearch();
    this.loadData();
  }

  // Function to check if today is a run day and generate events
  convertToCalendarEventData(
    busScheduleAutoGenerators: BusScheduleAutoGenerator[],
  ): { _id: string; name: string; startDate: Date; status: string }[] {
    if (!busScheduleAutoGenerators || busScheduleAutoGenerators.length === 0) {
      return [];
    }

    const events: { _id: string; name: string; startDate: Date; status: string }[] = [];
    const startDate = new Date(this.searchParams.startDate || '');
    const endDate = new Date(this.searchParams.endDate || '');

    const processSpecificTimeSlots = (
      schedule: BusScheduleAutoGenerator,
      date: Date,
      events: { _id: string; name: string; startDate: Date; status: string }[],
    ) => {
      const isRunDayCheck = isRunDay(schedule, date);
      if (schedule.specificTimeSlots && schedule.specificTimeSlots.length > 0 && isRunDayCheck) {
        schedule.specificTimeSlots.forEach((specificTimeSlot: SpecificTimeSlot) => {
          const eventDate = new Date(date);
          const [hours, minutes, seconds] = specificTimeSlot.timeSlot.split(':').map(Number);

          eventDate.setHours(hours);
          eventDate.setMinutes(minutes);
          eventDate.setSeconds(seconds);

          events.push({
            _id: schedule._id,
            name: schedule.name || 'Unnamed Event',
            startDate: eventDate,
            status: schedule.status === EVENT_STATUS.SCHEDULED ? this.updateStatus(eventDate) : schedule.status,
          });
        });
      }
    };

    const generateEventsForDay = (date: Date) => {
      busScheduleAutoGenerators.forEach((schedule) => {
        const endDate = new Date(schedule.endDate ?? '');
        if (endDate && endDate < date) {
          return;
        }
        processSpecificTimeSlots(schedule, date, events);
      });
    };

    const iterateDays = (startDate: Date, endDate: Date) => {
      const date = new Date(startDate);
      while (date && endDate && date <= endDate) {
        generateEventsForDay(date);
        date.setDate(date.getDate() + 1); // Move to the next day
      }
    };

    const isRunDay = (busScheduleAutoGenerator: BusScheduleAutoGenerator, date: Date): boolean => {
      // Adjust startDate by subtracting preGenerateDays
      const adjustedStartDate = new Date(busScheduleAutoGenerator.startDate);
      console.log('🚀 ~ BusScheduleAutoGeneratorsComponent ~ adjustedStartDate:', adjustedStartDate);
      adjustedStartDate.setDate(adjustedStartDate.getDate() + busScheduleAutoGenerator.preGenerateDays);

      // Lấy ngày hôm nay, loại bỏ thời gian (giờ, phút, giây)
      const todayWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      console.log('🚀 ~ BusScheduleAutoGeneratorsComponent ~ todayWithoutTime:', todayWithoutTime);

      // Lấy phần ngày của adjustedStartDate (không tính giờ, phút, giây)
      const start = new Date(
        adjustedStartDate.getFullYear(),
        adjustedStartDate.getMonth(),
        adjustedStartDate.getDate(),
      );

      // Tính chênh lệch thời gian tính bằng mili-giây giữa hôm nay và ngày bắt đầu
      const diffMs = todayWithoutTime.getTime() - start.getTime();

      // Nếu lặp theo tuần, tính số tuần đã trôi qua
      if (busScheduleAutoGenerator.repeatType === 'weeks') {
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Tính chênh lệch số ngày
        const diffWeeks = Math.floor(diffDays / 7); // Số tuần đã trôi qua

        // Kiểm tra điều kiện tuần chạy
        const isWeekValid = diffWeeks >= 0 && diffWeeks % busScheduleAutoGenerator.repeatInterval === 0;

        // Kiểm tra điều kiện ngày chạy
        const isDayValid = busScheduleAutoGenerator.repeatDaysPerWeek.includes(
          todayWithoutTime.toLocaleString('en-US', { weekday: 'short' }),
        );

        // Kết quả cuối cùng
        return isWeekValid && isDayValid;
      } else {
        // Nếu lặp theo ngày, so sánh dựa trên số ngày
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Số ngày chênh lệch
        return diffDays >= 0 && diffDays % busScheduleAutoGenerator.repeatInterval === 0;
      }
    };

    iterateDays(startDate, endDate);
    console.log('🚀 ~ BusScheduleAutoGeneratorsComponent ~ events:', events);
    return events;
  }

  updateStatus(eventDate: Date): string {
    const currentDate = new Date();
    // Nếu eventDate ở tương lai, chưa tới thời điểm cần diễn ra sự kiện.
    if (eventDate > currentDate) {
      return 'scheduled';
    } else {
      return 'completed';
    }
  }

  triggerRunCreateBusSchedule(busScheduleAutoGenerator: any) {
    console.log(
      '🚀 ~ BusScheduleAutoGeneratorsComponent ~ triggerRunCreateBusSchedule ~ busScheduleAutoGenerator:',
      busScheduleAutoGenerator,
    );
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'warning',
        },
        title: 'Run Bus Schedule',
        content: 'Are you sure you want to run this bus schedule?',
        btn: [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busScheduleAutoGeneratorsService.runCreateBusSchedule(busScheduleAutoGenerator).subscribe({
          next: (res: any) => {
            if (res) {
              toast.success('Run bus schedule successfully');
              this.loadData();
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }
}
