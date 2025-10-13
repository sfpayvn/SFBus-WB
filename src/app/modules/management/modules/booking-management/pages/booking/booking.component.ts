import { Component, Input, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { combineLatest, of, Subscription } from 'rxjs';
import { Booking, SearchBooking } from '../../model/booking.model';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  standalone: false,
})
export class BookingComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchBooking: SearchBooking = new SearchBooking();

  searchParams = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: { key: '', value: [] as string[] },
  };

  isLoaded: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  filterRoles = [
    { text: 'User', value: 'user' },
    { text: 'Driver', value: 'driver' },
  ];

  totalPage: number = 0;
  totalItem: number = 0;

  bookingtatusClasses: { [key: string]: string } = {
    reserved: 'border-yellow-500 bg-yellow-200 text-yellow-800',
    paid: 'border-green-500 bg-green-200 text-green-800',
    deposited: 'border-red-500 bg-red-200 text-red-800',
  };

  bookingStatuses: { [key: string]: string } = {
    reserved: 'Đã đặt',
    paid: 'Đã thanh toán',
    deposited: 'Đã đặt cọc',
  };

  @Input() busRoutes: BusRoute[] = [];
  busRoute: BusRoute = null as any;

  @Input() busSchedules: BusSchedule[] = [];
  busSchedule: BusSchedule = null as any;

  startTimeScheduleValueBusScheduleSearch: Date | null = null;
  endTimeScheduleValueBusScheduleSearch: Date | null = null;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private bookingService: BookingService,
    private router: Router,
    private busRoutesService: BusRoutesService,
    private busSchedulesService: BusSchedulesService,
  ) {
    this.eventSubscription = [];
  }

  async ngOnInit(): Promise<void> {
    this.initListenEvent();
  }

  ionViewWillEnter() {
    this.initializeData();
  }

  initListenEvent() {}

  async initializeData() {
    this.loadBooking();

    const findBusRouteRequest = this.busRoutesService.findAll();
    const findBusSchedulesRequest = this.busSchedulesService.findAll(); // lấy data to test

    combineLatest([findBusRouteRequest, findBusSchedulesRequest]).subscribe(([busRoutes, busSchedules]) => {
      this.busRoutes = busRoutes;
      this.busSchedules = busSchedules;
    });
  }

  loadBooking() {
    this.isLoaded = false;
    this.bookingService.searchBooking(this.searchParams).subscribe({
      next: (res: SearchBooking) => {
        if (res) {
          this.searchBooking = res;
          this.totalItem = this.searchBooking.totalItem;
          this.totalPage = this.searchBooking.totalPage;
        }
        this.isLoaded = true;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoaded = true;
      },
    });
  }

  loadDataFindBooking(event: any) {
    const fields = ['busRouteId', 'busScheduleId', 'startDate', 'endDate', 'status', 'phoneNumber'];
    this.searchParams.keyword = event.keyword || '';
    this.searchParams.filters = { key: '', value: [] as string[] };
    fields.forEach((key) => {
      if (event[key]) {
        this.searchParams.filters.key = key;
        this.searchParams.filters.value.push(event[key]);
      }
    });

    this.loadBooking();
  }

  reloadBookingPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadBooking();
  }

  searchGoodPage(keyword: any) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadBooking();
  }

  sortGoodPage(event: any) {
    const sortBy = event as { key: string; value: string };
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadBooking();
  }

  onCurrentPageDataChange(event: any): void {
    const booking = event as Booking[];
    this.searchBooking.bookings = booking;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBooking.bookings;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBooking.bookings.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  editBooking(booking: Booking) {
    this.router.navigate(['/booking/detail'], { state: { booking } });
  }

  async deleteBooking(bookingId: string) {
    const booking = this.searchBooking.bookings.find((booking: Booking) => booking._id === bookingId);
    if (!booking) {
      return;
    }
    const header = '(*) Lưu ý';
    const content = `Bạn có chắc chắn muốn xóa vé <b>${booking.bookingNumber}</b> này không.`;
    const btns = [
      {
        name: 'Đóng',
        type: 'cancel',
      },
      {
        name: 'Đồng ý',
        type: 'confirm',
      },
    ];
    // const res = await this.utilsModal.openDialogConfirm(ModalDialogComponent, header, content, btns, 'modal-backdrop');
    // if (res) {
    //   this.bookingService.deleteBooking(booking._id).subscribe((res: any) => {
    //     if (res) {
    //       this.utilsModal.presentCusToast('Xóa thành công', '', 'success');
    //       this.loadBooking();
    //     } else {
    //       this.utilsModal.presentCusToast('Xóa thất bại', 'danger');
    //     }
    //   });
    // }
  }

  ///////////////////////////////// Choose  Bus Route ////////////////////////////////////////////////////////
  async openQuickUpdateDialog(event: MouseEvent) {
    let data = await this.openModalQuickUpdateWeb(event, '#quick-update-booking');

    return data;
  }

  async openModalQuickUpdateWeb(event: MouseEvent, id: string) {
    const dataInput = {
      busRoutes: this.busRoutes,
      busRoute: this.busRoute,

      busSchedules: this.busSchedules,
      busSchedule: this.busSchedule,

      startTimeScheduleValueBusScheduleSearch: this.startTimeScheduleValueBusScheduleSearch,
      endTimeScheduleValueBusScheduleSearch: this.endTimeScheduleValueBusScheduleSearch,
    };

    // const data = await this.utilsModal.openContextModal(QuickUpdateBookingDialogComponent, dataInput, event, id);
    // return data;
    return of({ selectedData: null }).toPromise();
  }
}
