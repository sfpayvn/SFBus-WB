import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusSchedulesService } from './service/bus-schedules.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusSchedule, SearchBusSchedule } from './model/bus-schedule.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { BusScheduleDetailDialogComponent } from './components/bus-schedule-detail-dialog/bus-schedule-detail-dialog.component';

@Component({
  selector: 'app-bus-schedules',
  templateUrl: './bus-schedules.component.html',
  styleUrls: ['./bus-schedules.component.scss'],
  standalone: false
})
export class BusSchedulesComponent implements OnInit {
  searchBusSchedule: SearchBusSchedule = new SearchBusSchedule();
  selectAll: boolean = false;

  searchParams = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 5,
    keyword: '',
    sortBy: ''
  };


  totalPage: number = 0;
  totalItem: number = 0;

  viewDisplayMode: string = 'calendar'
  viewMode: 'list' | 'day' | 'week' | 'month' = 'month';

  isLoadingBusSchedule: boolean = false;

  constructor(
    private busSchedulesService: BusSchedulesService,
    private dialog: MatDialog,
    private utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setParamsToSearch();
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusSchedule = true;
    this.busSchedulesService.searchBusSchedule(this.searchParams).subscribe({
      next: (res: SearchBusSchedule) => {
        if (res) {
          this.searchBusSchedule = res;
          console.log("🚀 ~ BusesComponent ~ this.busSchedulesService.searchBus ~ this.searchBusSchedule:", this.searchBusSchedule)
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
        startDate: '',
        endDate: '',
        pageSize: 5,
        keyword: '',
        sortBy: ''
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

  toggleBusSchedule(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusSchedule.busSchedules = this.searchBusSchedule.busSchedules.map((busSchedule: BusSchedule) => ({
      ...busSchedule,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusSchedule.busSchedules.some((busSchedule) => !busSchedule.selected);
  }

  deleteBusSchedule(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Bus',
        content:
          'Are you sure you want to delete this bus? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel'
          },
          {
            label: 'YES',
            type: 'submit'
          },
        ]
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
      this.utilsModal.openModal(BusScheduleDetailDialogComponent, { busSchedule: busSchedule2Edit }, 'large').subscribe((busSchedule: BusSchedule) => {
        if (!busSchedule) return;
        this.loadData();
      });
      return
    }
    const params = { busSchedule: JSON.stringify(busSchedule) };
    this.router.navigateByUrl('/bus-management/bus-schedule/bus-schedules/bus-schedule-detail', { state: params });
  }

  addBusSchedule(startDate?: Date): void {
    if (this.viewDisplayMode == 'calendar') {
      this.utilsModal.openModal(BusScheduleDetailDialogComponent, { startDate }, 'large').subscribe((busSchedule: BusSchedule) => {
        if (!busSchedule) return;
        this.loadData();
      });
      return
    }
    this.router.navigate(['/bus-management/bus-schedule/bus-schedules/bus-schedule-detail']);
  }

  reloadBusSchedulePage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data
    }
    this.loadData();
  }

  searchBusSchedulePage(keyword: string) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword
    }
    this.loadData();
  }

  sortBusSchedulePage(sortBy: string) {
    this.searchParams = {
      ...this.searchParams,
      sortBy
    }
    this.loadData();
  }

  reLoadDataEvent(params: { startDate: Date; endDate: Date }): void {
    this.searchParams = {
      ...this.searchParams,
      ...params
    }
    // Xử lý logic theo khoảng thời gian startDate và endDate
    this.loadData();
  }

  convertToCalendarEventData(busSchedules: BusSchedule[]): { _id: string, name: string; startDate: Date, status: string }[] {
    // Kiểm tra xem busSchedules có dữ liệu hay không
    if (!busSchedules || busSchedules.length === 0) {
      return [];
    }

    const events = busSchedules.map((schedule: any) => {
      return {
        _id: schedule._id,
        name: schedule.name || "Unnamed Event",
        startDate: new Date(schedule.startDate),
        status: schedule.status
      };
    });
    return events;
  }

  changeViewDisplayMode(viewDisplayMode: string) {
    this.viewDisplayMode = viewDisplayMode;
    this.setParamsToSearch();
    this.loadData();
  }
}
