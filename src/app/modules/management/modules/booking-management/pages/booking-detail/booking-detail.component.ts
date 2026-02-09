import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  SEAT_STATUS_CLASSES,
  SEAT_STATUS_LABELS,
  BOOKING_STATUS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_CLASSES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_CLASSES,
} from '@rsApp/core/constants/status.constants';
import { PaymentMethod } from '@rsApp/modules/dashboard/pages/report/models/report.model';
import { Payment, RequestPaymentDto } from '@rsApp/shared/models/payment.model';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { PaymentService } from '@rsApp/shared/services/payment/payment-service';
import { Utils } from '@rsApp/shared/utils/utils';
import { toast } from 'ngx-sonner';
import { Subscription, combineLatest, firstValueFrom } from 'rxjs';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { SeatType } from '../../../bus-management/pages/seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../bus-management/pages/seat-types/service/seat-types.servive';
import { PaymentMethodService } from '../../../payment-management/modules/payment-method/service/payment-method.service';
import { Booking } from '../../model/booking.model';
import { BookingService } from '../../service/booking.service';
import { Location } from '@angular/common';

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

  // Cache for seat types to avoid repeated computations
  private seatTypeCache = new Map<string, SeatType | undefined>();
  private paymentMethodCache = new Map<string, PaymentMethod>();

  seatStatusClasses = SEAT_STATUS_CLASSES;
  seatStatuses = SEAT_STATUS_LABELS;

  bookingStatus = BOOKING_STATUS;
  bookingStatusLabels = BOOKING_STATUS_LABELS;
  bookingStatusClasses = BOOKING_STATUS_CLASSES;

  paymentStatuses = PAYMENT_STATUS_LABELS;
  paymentStatusClasses = PAYMENT_STATUS_CLASSES;

  @Output() bookingChange = new EventEmitter<any>();

  selectedSeatIndex: number = 0;
  isCreatePayment: boolean = false;
  bookingForm!: FormGroup;

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
    private fb: FormBuilder,
    private bookingService: BookingService,
  ) {
    this.eventSubscription = [];
  }

  async ngOnInit(): Promise<void> {
    this.getQueryParams();
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
      // Clear cache when seat types change
      this.seatTypeCache.clear();
      this.initListenEvent();
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

  get createPaymentForm(): FormGroup | null {
    return this.bookingForm?.get('createPaymentForm') as FormGroup;
  }

  async toggleCreatePaymentForm($event?: any) {
    $event?.stopPropagation();
    const currentIsCreatePaymentForm = this.isCreatePayment;

    // Nếu đang ở chế độ create, chuyển về mode danh sách
    if (currentIsCreatePaymentForm) {
      if (this.bookingForm) {
        this.bookingForm.removeControl('createPaymentForm', { emitEvent: false });
      }
    } else {
      // Khởi tạo bookingForm nếu chưa có
      if (!this.bookingForm) {
        this.bookingForm = this.fb.group({
          isCreatePayment: [false],
        });
      }

      // Cập nhật lại paymentAmount trước
      await this.setBookingPaymentAmount();

      // Lấy giá trị paymentAmount từ booking
      const paymentAmount = this.booking.paymentAmount || 0;
      const defaultPaymentMethod = this.getDefaultPaymentMethod();

      // Tạo form thanh toán
      const createPaymentForm = this.fb.group({
        paymentMethod: [defaultPaymentMethod ? defaultPaymentMethod : null],
        maxPaymentAmount: [paymentAmount],
        paymentAmount: [paymentAmount, [Validators.required, Validators.min(0), Validators.max(paymentAmount)]],
      });

      this.bookingForm.addControl('createPaymentForm', createPaymentForm, { emitEvent: false });
    }

    this.isCreatePayment = !this.isCreatePayment;
  }

  getDefaultPaymentMethod() {
    return this.paymentMethods.find((method: any) => method.type === 'cash');
  }

  processPayment() {
    const createPaymentForm = this.createPaymentForm;

    if (!createPaymentForm || !createPaymentForm.valid) {
      if (createPaymentForm) {
        this.utils.markFormGroupTouched(createPaymentForm);
      }
      return;
    }

    const { paymentMethod, paymentAmount } = createPaymentForm.getRawValue() as {
      paymentMethod: PaymentMethod;
      paymentAmount: number;
    };

    if (!paymentMethod || !paymentAmount) {
      return;
    }

    if (paymentAmount > 0) {
      const requestPaymentDto: RequestPaymentDto = {
        referrentGroupNumber: this.booking.bookingGroupNumber,
        totalPrice: paymentAmount,
        transactionId: paymentMethod._id,
        paymentMethodId: paymentMethod._id,
      };

      this.paymentService.paymentBooking(requestPaymentDto).subscribe((payment2Result: Payment[]) => {
        if (!payment2Result || payment2Result.length === 0) {
          toast.error('Thanh toán không thành công');
          return;
        }

        toast.success('Thanh toán thành công');
        this.toggleCreatePaymentForm();

        // Load lại danh sách payments
        this.loadPayment(this.booking._id);

        // Emit sự kiện booking đã thay đổi
        this.bookingChange.emit(this.booking);
      });
    } else {
      // Tạo mã QR với thông tin paymentNumber trong booking
      toast.info('Chức năng thanh toán QR đang được phát triển');
    }
  }

  // Thêm các helper methods
  getSeatStatusLabel(status: string): string {
    return this.seatStatuses[status] || 'Không xác định';
  }

  getSeatStatusClass(status: string): string {
    return this.seatStatusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getBookingStatusLabel(status: string): string {
    return this.bookingStatusLabels[status] || 'Không xác định';
  }

  getBookingStatusClass(status: string): string {
    return this.bookingStatusClasses[status] || 'border-gray-300 bg-gray-100 text-gray-800';
  }

  getTypeOfSeat(cell: any) {
    if (!cell?.typeId) {
      return undefined;
    }

    // Check cache first
    if (this.seatTypeCache.has(cell.typeId)) {
      return this.seatTypeCache.get(cell.typeId);
    }

    // Compute and cache the result
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    this.seatTypeCache.set(cell.typeId, selectedType);

    return selectedType;
  }

  getPaymentMethod(id: string) {
    if (this.paymentMethodCache.has(id)) {
      return this.paymentMethodCache.get(id);
    }
    const method = this.paymentMethods.find((method: PaymentMethod) => method._id === id);
    if (method) {
      this.paymentMethodCache.set(id, method);
    }
    return method;
  }

  viewBusScheduleDetails() {
    this.router.navigate(['/bus-schedules/bus-schedule-detail'], {
      state: {
        busSchedule: this.busSchedule,
        booking: this.booking,
      },
    });
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
