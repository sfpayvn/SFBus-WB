import { Component, Input, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { Booking, SearchBooking } from '../../model/booking.model';
import {
  BOOKING_STATUS_CLASSES,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_OPTIONS,
} from '@rsApp/core/constants/status.constants';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { BookingService } from '../../service/booking.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  standalone: false,
})
export class BookingComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchBooking: SearchBooking = new SearchBooking();
  filteredBookings: Booking[] = [];

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
    filters: [] as any[],
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

  bookingStatusClasses = BOOKING_STATUS_CLASSES;
  bookingStatusesLabel = BOOKING_STATUS_LABELS;

  @Input() busRoutes: BusRoute[] = [];
  busRoute: BusRoute = null as any;

  @Input() busSchedules: BusSchedule[] = [];
  busSchedule: BusSchedule = null as any;

  startTimeScheduleValueBusScheduleSearch: Date | null = null;
  endTimeScheduleValueBusScheduleSearch: Date | null = null;

  filterBookingStatus: string = '';

  get selectedIdsArray(): string[] {
    try {
      return Array.from(this.setOfCheckedId || []);
    } catch (e) {
      return [];
    }
  }

  // Return ordered payment status counts according to BOOKING_STATUS_OPTIONS
  get bookingStatusCounts() {
    const counts: Record<string, number> = {};
    const result: Array<{ key: string; label: string; value: number }> = [];

    for (const opt of BOOKING_STATUS_OPTIONS) {
      const key = opt.value as string;
      const label = opt.label as string;
      result.push({ key, label, value: counts[key] || 0 });
    }

    return result;
  }

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private bookingService: BookingService,
    private router: Router,
  ) {
    this.eventSubscription = [];
  }

  async ngOnInit(): Promise<void> {
    this.initializeData();
    this.initListenEvent();
  }

  ionViewWillEnter() {
    this.loadBooking();
  }

  initListenEvent() {
    const sub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      // re-initialize when returning to booking route
      if (this.router.url && this.router.url.startsWith('/booking')) {
        // this.loadBooking();
      }
    });
    this.eventSubscription.push(sub as Subscription);
  }

  ngOnDestroy() {
    this.eventSubscription.forEach((s) => s.unsubscribe());
  }

  async initializeData() {
    // const findBusRouteRequest = this.busRoutesService.findAll();
    // const findBusSchedulesRequest = this.busSchedulesService.findAll(); // lấy data to test
    // combineLatest([findBusRouteRequest, findBusSchedulesRequest]).subscribe(([busRoutes, busSchedules]) => {
    //   this.busRoutes = busRoutes;
    //   this.busSchedules = busSchedules;
    // });
  }

  loadBooking() {
    this.isLoaded = false;
    this.bookingService.searchBooking(this.searchParams).subscribe({
      next: (res: SearchBooking) => {
        if (res) {
          this.searchBooking = res;
          this.totalItem = this.searchBooking.totalItem;
          this.totalPage = this.searchBooking.totalPage;
          this.filteredBookings = [...res.bookings];
          console.log('🚀 ~ BookingComponent ~ loadBooking ~ this.filteredBookings:', this.filteredBookings);
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
    const { filters, sortBy } = event;
    const fields = ['busRouteId', 'busScheduleId', 'startDate', 'endDate', 'status', 'phoneNumber'];
    this.searchParams.keyword = filters.keyword || '';
    this.searchParams.filters = [];
    fields.forEach((key) => {
      if (filters[key]) {
        this.searchParams.filters.push({ key, value: filters[key] });
      }
    });
    if (sortBy && sortBy.key) {
      this.searchParams.sortBy = sortBy;
    }
    this.loadBooking();
  }

  reloadBookingPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadBooking();
  }

  searchBookingPage(keyword: any) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadBooking();
  }

  sortBookingPage(event: any) {
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

  addBooking() {
    this.router.navigate(['/management/booking-management/booking/detail']);
  }

  editBooking(booking: Booking) {
    this.router.navigate(['/management/booking-management/booking/detail'], { state: { booking } });
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

    this.utilsModal.openModalConfirm(header, content, 'dangerous', btns).subscribe((result) => {
      if (result) {
        this.bookingService.deleteBooking(booking._id).subscribe((res: any) => {
          if (res) {
            toast.success('Xóa vé thành công');
            this.loadBooking();
          } else {
            toast.error('Xóa vé thất bại');
          }
        });
      }
    });
  }

  filterBookingStatusChange(event: any) {
    if (event === this.filterBookingStatus) {
      return;
    }
    this.filterBookingStatus = event;
    this.searchParams.filters = this.searchParams.filters.filter((filter) => filter.key !== 'status');
    if (event === 'all') {
      this.loadBooking();
      return;
    }
    this.utils.addOrReplaceFilters({ key: 'status', value: event }, this.searchParams);
    this.loadBooking();
  }

  toggleBookingFilter(key: string) {
    const newKey = this.filterBookingStatus === key ? 'all' : key;
    this.filterBookingStatusChange(newKey);
  }

  // sync selection from app-table (emits selected ids array)
  onTableSelectionChange(ids: string[]) {
    try {
      this.setOfCheckedId = new Set(ids || []);
    } catch (e) {
      this.setOfCheckedId = new Set<string>();
    }
    this.refreshCheckedStatus();
  }
}
