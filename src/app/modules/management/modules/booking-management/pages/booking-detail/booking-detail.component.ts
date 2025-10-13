import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { combineLatest, tap } from 'rxjs';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { Booking, Booking2Create, Booking2Update } from '../../model/booking.model';
import { BookingService } from '../../service/booking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss',
  standalone: false,
})
export class BookingDetailComponent implements OnInit {
  mainForm!: FormGroup;

  @Input() booking!: Booking;
  @Input() isDialog: boolean = false;

  mode: 'create' | 'update' | 'view' = 'create';

  bookingStatuses = [
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'completed', label: 'Hoàn thành' },
  ];

  paymentStatuses = [
    { value: 'pending', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'refunded', label: 'Đã hoàn tiền' },
  ];

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private bookingService: BookingService,
    private utilsModal: UtilsModal,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    if (this.booking) {
      this.mode = 'update';
    }
  }

  getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['mode']) {
        this.mode = params['mode'];
      }
      if (params['_id']) {
        this.loadBooking(params['_id']);
      }
    });
  }

  initData() {
    this.initForm();
  }

  initForm() {
    this.mainForm = this.fb.group({
      bookingCode: ['', Validators.required],
      customerName: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      customerEmail: ['', [Validators.email]],
      scheduleId: ['', Validators.required],
      routeName: [''],
      busName: [''],
      departureTime: [''],
      arrivalTime: [''],
      totalSeats: [0, [Validators.required, Validators.min(1)]],
      seatNumbers: [[]],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      paymentStatus: ['pending', Validators.required],
      bookingStatus: ['confirmed', Validators.required],
      pickupLocation: [''],
      dropoffLocation: [''],
      notes: [''],
    });

    if (this.mode === 'view') {
      this.mainForm.disable();
    }
  }

  loadBooking(_id: string) {
    this.bookingService.findOne(_id).subscribe({
      next: (res: Booking) => {
        this.booking = res;
        this.mainForm.patchValue(this.booking);
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
      },
    });
  }

  goBack() {
    this.location.back();
  }

  save() {
    if (this.mainForm.invalid) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (this.mode === 'create') {
      this.create();
    } else if (this.mode === 'update') {
      this.update();
    }
  }

  create() {
    const payload: Booking2Create = this.mainForm.value;
    this.bookingService.create(payload).subscribe({
      next: (res: any) => {
        toast.success('Booking created successfully');
        this.goBack();
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
      },
    });
  }

  update() {
    const payload: Booking2Update = {
      ...this.mainForm.value,
      _id: this.booking._id,
    };
    this.bookingService.update(payload).subscribe({
      next: (res: any) => {
        toast.success('Booking updated successfully');
        this.goBack();
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
      },
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.mainForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('email')) {
      return 'Invalid email format';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid phone number format (10 digits required)';
    }
    if (control?.hasError('min')) {
      return `${fieldName} must be greater than 0`;
    }
    return '';
  }
}
