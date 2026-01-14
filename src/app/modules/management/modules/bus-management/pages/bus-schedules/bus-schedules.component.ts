import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusSchedulesService } from './service/bus-schedules.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusSchedule, BusSchedule2Create, SearchBusSchedule } from './model/bus-schedule.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { BusScheduleDetailDialogComponent } from './components/bus-schedule-detail-dialog/bus-schedule-detail-dialog.component';
import { EVENT_STATUS_CLASSES, EVENT_STATUS_LABELS } from 'src/app/core/constants/status.constants';
import { CapsService } from '@rsApp/shared/services/caps.service';
import { MODULE_KEYS, FUNCTION_KEYS } from '@rsApp/core/constants/module-function-keys';

@Component({
  selector: 'app-bus-schedules',
  templateUrl: './bus-schedules.component.html',
  styleUrls: ['./bus-schedules.component.scss'],
  standalone: false,
})
export class BusSchedulesComponent implements OnInit {
  searchBusSchedule: SearchBusSchedule = new SearchBusSchedule();

  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  searchParams = {
    pageIdx: 1,
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: [] as any[],
  };

  totalPage: number = 0;
  totalItem: number = 0;

  viewDisplayMode: string = 'calendar';
  viewMode: 'list' | 'day' | 'week' | 'month' = 'week';

  isLoadingBusSchedule: boolean = false;

  statusClasses = EVENT_STATUS_CLASSES;

  busScheduleStatusLabels = EVENT_STATUS_LABELS;

  moduleKeys = MODULE_KEYS;
  functionKeys = FUNCTION_KEYS;

  constructor(
    private busSchedulesService: BusSchedulesService,
    private dialog: MatDialog,
    private utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.viewDisplayMode = this.pickModeFromUrl(this.router.url);
    this.setParamsToSearch();
    this.loadData();
  }

  private pickModeFromUrl(url: string): string {
    const path = url.split('?')[0].split('#')[0]; // bỏ query/hash
    const last = path.split('/').filter(Boolean).pop() ?? '';
    return last === 'scheduler' || last === 'schedule' ? 'table' : 'calendar';
  }

  loadData(): void {
    this.isLoadingBusSchedule = true;
    this.busSchedulesService.searchBusSchedule(this.searchParams, this.viewDisplayMode).subscribe({
      next: (res: SearchBusSchedule) => {
        if (res) {
          this.searchBusSchedule = res;
          this.totalItem = this.searchBusSchedule.totalItem;
          this.totalPage = this.searchBusSchedule.totalPage;
        }
        this.isLoadingBusSchedule = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusSchedule = false;
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
        pageSize: 5,
        keyword: '',
        sortBy: {
          key: 'createdAt',
          value: 'descend',
        },
        filters: [] as any[],
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

      this.addOrReplaceFilters({ key: 'startDate', value: startOfWeek });
      this.addOrReplaceFilters({ key: 'endDate', value: endOfWeek });
    } else if (this.viewMode === 'month') {
      // Tính ngày đầu tháng
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      // Tính ngày cuối tháng
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999); // Set thời gian cuối ngày
      startOfMonth.setHours(0, 0, 0, 0);

      this.addOrReplaceFilters({ key: 'startDate', value: startOfMonth });
      this.addOrReplaceFilters({ key: 'endDate', value: endOfMonth });
    } else if (this.viewMode === 'day') {
      // Tính toán cho chế độ ngày

      const dayRange = this.getDayRange(currentDate);
      this.addOrReplaceFilters({ key: 'startDate', value: dayRange.startOfDay });
      this.addOrReplaceFilters({ key: 'endDate', value: dayRange.endOfDay });
    }
  }

  getDayRange(date: Date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);

    startOfDay.setHours(0, 0, 0, 0); // Đặt thời gian đầu ngày
    endOfDay.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày

    return {
      startOfDay,
      endOfDay,
    };
  }

  onCurrentPageDataChange(event: any): void {
    const busSchedules = event as readonly BusSchedule[];
    this.searchBusSchedule.busSchedules = [...busSchedules];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusSchedule.busSchedules;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusSchedule.busSchedules.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusSchedule(id: string): void {
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
        this.busSchedulesService.deleteBusSchedule(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusSchedule.busSchedules = this.searchBusSchedule.busSchedules.filter((bus) => bus._id !== id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusSchedule(busSchedule: any): void {
    if (this.viewDisplayMode == 'calendar') {
      const busSchedule2Edit = this.searchBusSchedule.busSchedules.find((b: BusSchedule) => b._id == busSchedule._id);
      this.utilsModal
        .openModal(BusScheduleDetailDialogComponent, { busSchedule: busSchedule2Edit }, 'large')
        .subscribe((isReloadData: boolean) => {
          if (!isReloadData) return;
          this.loadData();
        });
      return;
    }
    const params = { busSchedule: JSON.stringify(busSchedule) };
    this.router.navigateByUrl('/management/bus-management/bus-schedule/bus-schedules/bus-schedule-detail', {
      state: params,
    });
  }

  addBusSchedule(startDate?: Date): void {
    if (this.viewDisplayMode == 'calendar') {
      this.utilsModal
        .openModal(BusScheduleDetailDialogComponent, { startDate }, 'large')
        .subscribe((isReloadData: boolean) => {
          if (!isReloadData) return;
          this.loadData();
        });
      return;
    }
    this.router.navigate(['/management/bus-management/bus-schedule/bus-schedules/bus-schedule-detail']);
  }

  cloneData(busSchedule: any): void {
    const busSchedule2Clone = this.searchBusSchedule.busSchedules.find((b: BusSchedule) => b._id == busSchedule._id);

    delete (busSchedule2Clone as any)._id;
    let busSchedule2Create = new BusSchedule2Create();
    busSchedule2Create = { ...busSchedule2Create, ...busSchedule2Clone };
    busSchedule2Create.status = 'un_published';

    this.busSchedulesService.createBusSchedule(busSchedule2Create).subscribe({
      next: (res: BusSchedule) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  reloadBusSchedulePage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchBusSchedulePage(keyword: string) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadData();
  }

  sortBusSchedulePage(sortBy: { key: string; value: string }) {
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadData();
  }

  reLoadDataEvent(params: { startDate: Date; endDate: Date }): void {
    this.addOrReplaceFilters({ key: 'startDate', value: params.startDate });
    this.addOrReplaceFilters({ key: 'endDate', value: params.endDate });
    // Xử lý logic theo khoảng thời gian startDate và endDate
    this.loadData();
  }

  convertToCalendarEventData(
    busSchedules: BusSchedule[],
  ): { _id: string; name: string; startDate: Date; status: string }[] {
    // Kiểm tra xem busSchedules có dữ liệu hay không
    if (!busSchedules || busSchedules.length === 0) {
      return [];
    }

    const events = busSchedules.map((schedule: any) => {
      return {
        _id: schedule._id,
        name: schedule.name || 'Unnamed Event',
        startDate: new Date(schedule.startDate),
        status: schedule.status,
      };
    });
    return events;
  }

  changeViewDisplayMode(viewDisplayMode: string) {
    this.viewDisplayMode = viewDisplayMode;
    this.setParamsToSearch();
    this.loadData();
  }

  addOrReplaceFilters(newItem: { key: string; value: any }): void {
    const idx = this.searchParams.filters.findIndex((i) => i.key === newItem.key && i.value === newItem.value);

    if (idx > -1) {
      // Thay thế phần tử cũ
      this.searchParams.filters[idx] = newItem;
    } else {
      // Thêm mới
      this.searchParams.filters.push(newItem);
    }
  }
}
