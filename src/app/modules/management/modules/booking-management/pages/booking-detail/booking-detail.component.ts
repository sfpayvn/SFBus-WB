import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Utils } from '@rsApp/shared/utils/utils';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { combineLatest, firstValueFrom, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Booking, Booking2Create } from '../../model/booking.model';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { SeatType } from '../../../bus-management/pages/seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../bus-management/pages/seat-types/service/seat-types.servive';
import {
  BOOKING_STATUS,
  BOOKING_STATUS_CLASSES,
  BOOKING_STATUS_LABELS,
  SEAT_STATUS_CLASSES,
  SEAT_STATUS_LABELS,
} from 'src/app/core/constants/status.constants';
import { Payment } from '@rsApp/shared/models/payment.model';
import { PaymentMethod } from '../../../payment-management/modules/payment-method/model/payment-method.model';
import { PaymentService } from '@rsApp/shared/services/payment/payment-service';
import { PaymentMethodService } from '../../../payment-management/modules/payment-method/service/payment-method.service';

interface BookingDeteail extends Booking {
  paymentPaidAmount?: number;
  paymentAmount?: number;
}

@Component({
  selector: 'app-booking-detail',
  standalone: false,
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss',
})
export class BookingDetailComponent implements OnInit {
  @Input() booking: BookingDeteail = new Booking();
  @Input() isDialog: boolean = false;

  seatTypes: SeatType[] = [];
  busSchedule: BusSchedule = new BusSchedule();
  paymentMethods: PaymentMethod[] = [];
  payments: Payment[] = [];

  private seatTypeCache: Map<string, SeatType | undefined> = new Map();
  private paymentMethodCache = new Map<string, PaymentMethod>();

  bookingStatus = BOOKING_STATUS;
  bookingStatusLabels = BOOKING_STATUS_LABELS;
  bookingStatusClasses = BOOKING_STATUS_CLASSES;

  seatStatusClasses = SEAT_STATUS_CLASSES;
  seatStatuses = SEAT_STATUS_LABELS;

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
    private paymentService: PaymentService,
    private paymentMethodService: PaymentMethodService,
  ) {
    this.eventSubscription = [];
  }

  // Thêm các helper methods
  getSeatStatusLabel(status: string): string {
    return this.seatStatuses[status] || 'Không xác định';
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

    await this.loadPayment(this.booking._id || '');
  }

  async setBookingPaymentAmount() {
    const paymentAmount = await this.calcPaymentAmount();

    const paymentPaidAmount = await this.calcPaymentPaidAmount();

    this.booking.paymentAmount = paymentAmount;
    this.booking.paymentPaidAmount = paymentPaidAmount;
  }

  async calcPaymentAmount() {
    let paymentAmount = this.booking.afterDiscountTotalPrice;

    const payments = this.payments;
    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return paymentAmount;
    }

    await Promise.all(
      payments.map(async (payment: Payment) => {
        paymentAmount -= payment.chargedAmount;
      }),
    );
    return paymentAmount;
  }

  async calcPaymentPaidAmount() {
    let paymentPaidAmount = 0;

    const payments = this.payments;
    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return paymentPaidAmount;
    }

    await Promise.all(
      payments.map(async (payment: Payment) => {
        paymentPaidAmount += payment.chargedAmount;
      }),
    );
    return paymentPaidAmount;
  }

  async loadPayment(bookingId: string) {
    await this.loadPaymentMethods();

    this.paymentService.findAllByReferrentId(bookingId, true).subscribe({
      next: async (payments) => {
        this.payments = payments || [];
        this.setBookingPaymentAmount();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
      },
    });
  }

  async loadPaymentMethods() {
    if (this.paymentMethods.length === 0) {
      const findAllPaymentMethods = this.paymentMethodService.findPaymentMethods();
      this.paymentMethods = await firstValueFrom(findAllPaymentMethods);
    }
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
