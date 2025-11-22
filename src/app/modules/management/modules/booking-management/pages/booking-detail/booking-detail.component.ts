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
import { BOOKING_STATUS_CLASSES, BOOKING_STATUS_LABELS } from 'src/app/core/constants/status.constants';

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
  private seatTypeCache: Map<string, SeatType | undefined> = new Map();

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

  bookingStatuses = BOOKING_STATUS_LABELS;

  bookingtatusClasses = BOOKING_STATUS_CLASSES;

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
      // Clear cache when seatTypes change
      this.seatTypeCache.clear();
    });
  }

  getTypeOfSeat(cell: any) {
    // Check cache first
    if (this.seatTypeCache.has(cell.typeId)) {
      return this.seatTypeCache.get(cell.typeId);
    }

    // Tìm loại ghế tương ứng dựa trên type
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    
    // Cache the result
    this.seatTypeCache.set(cell.typeId, selectedType);
    
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
