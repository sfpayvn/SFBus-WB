import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Utils } from '@rsApp/shared/utils/utils';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { combineLatest, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Booking, Booking2Create } from '../../model/booking.model';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { SeatType } from '../../../bus-management/pages/seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../bus-management/pages/seat-types/service/seat-types.servive';

interface DepartureDestination {
  value: string;
  label: string;
  color: string;
  disabledd: boolean;
  selected: boolean;
}
@Component({
  selector: 'app-booking-detail',
  standalone: false,
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss',
})
export class BookingDetailComponent implements OnInit {
  @Input() booking: Booking = new Booking();
  @Input() isDialog: boolean = false;

  seatTypes: SeatType[] = [];

  busSchedule: BusSchedule = new BusSchedule();

  statusClasses: { [key: string]: string } = {
    not_picked_up: 'bg-yellow-100 border-yellow-300',
    picked_up: 'bg-blue-100 border-blue-300 ',
    on_board: 'bg-green-100 border-green-300 ',
    dropped_off: 'bg-purple-100 border-purple-300 ',
  };

  seatStatuses: { [key: string]: string } = {
    not_picked_up: 'Chưa đón',
    picked_up: 'Đã đón',
    on_board: 'Đã lên xe',
    dropped_off: 'Đã trả khách',
  };

  bookingStatuses: { [key: string]: string } = {
    reserved: 'Đã đặt',
    paid: 'Đã thanh toán',
    deposited: 'Đã đặt cọc',
  };

  bookingtatusClasses: { [key: string]: string } = {
    reserved: 'border-yellow-500 bg-yellow-200 text-yellow-800',
    paid: 'border-green-500 bg-green-200 text-green-800',
    deposited: 'border-red-500 bg-red-200 text-red-800',
  };

  @Output() bookingChange = new EventEmitter<any>();

  selectedSeatIndex: number = 0;

  eventSubscription!: Subscription[];

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    public utils: Utils,
    private seatTypesService: SeatTypesService,
    private busSchedulesService: BusSchedulesService,
    private location: Location,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.eventSubscription = [];
  }

  // Thêm các helper methods
  getSeatStatusLabel(status: string): string {
    return this.seatStatuses[status] || 'Không xác định';
  }

  getSeatStatusClass(status: string): string {
    return this.statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getBookingStatusLabel(status: string): string {
    return this.bookingStatuses[status] || 'Không xác định';
  }

  getBookingStatusClass(status: string): string {
    return this.bookingtatusClasses[status] || 'border-gray-300 bg-gray-100 text-gray-800';
  }

  async ngOnInit(): Promise<void> {
    this.getQueryParams();
    this.initListenEvent();
  }

  ngOnDestroy() {
    this.eventSubscription.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  async ngOnChanges(): Promise<void> {}

  async getQueryParams() {
    const params = history.state;
    if (!params || !params['booking']) {
      this.router.navigate(['/booking']);
      return;
    }
    this.booking = params['booking'] ? params['booking'] : null;
    this.initData();
  }

  initListenEvent() {}

  async initData(): Promise<void> {
    const busScheduleId = this.booking.busScheduleId || '';

    const findBusSchedule = this.busSchedulesService.findOne(busScheduleId);
    const findSeatTypes = this.seatTypesService.findAll();

    let request = [findBusSchedule, findSeatTypes];
    combineLatest(request).subscribe(([busSchedule, seatTypes]) => {
      this.busSchedule = busSchedule;
      this.seatTypes = seatTypes;
    });
  }

  getTypeOfSeat(cell: any) {
    console.log('🚀 ~ BookingDetailComponent ~ getTypeOfSeat ~ cell:', cell);
    // Tìm loại ghế tương ứng dựa trên type
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    console.log('🚀 ~ BookingDetailComponent ~ getTypeOfSeat ~ this.seatTypes:', this.seatTypes);
    return selectedType;
  }

  backPage() {
    this.location.back();
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
}
