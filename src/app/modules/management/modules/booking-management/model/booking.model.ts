import { Payment } from '@rsApp/shared/models/payment.model';
import { BusSchedule } from '../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { Promotion } from '../../promotion-management/model/promotion.model';

export class UserInforBooking {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
}

export class UserPaymentInforBooking {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  paymentMethodId?: string = '';
}

export class BookingItemSeat {
  _id: string = '';

  seatNumber: string = '';

  name: string = '';

  status: string = '';

  typeId: string = '';
}

export class BookingItem {
  _id: string = '';

  bookingItemNumber: string = '';

  userId: string = '';

  userInfo!: UserInforBooking;

  seat!: BookingItemSeat;

  price: number = 0;

  discountAmount: number = 0;

  afterDiscountPrice: number = 0;

  departure: string = '';

  destination: string = '';
}

export class Booking {
  _id: string = '';

  userId: string = '';

  userInfo!: UserInforBooking;

  bookingNumber: string = '';

  busScheduleId: string = '';

  busRouteId: string = '';

  busSchedule!: BusSchedule;

  bookingItems!: BookingItem[];

  promotion!: Promotion | null;

  payments!: Payment[] | null;

  totalPrice: number = 0;

  discountTotalAmout?: number = 0;

  afterDiscountTotalPrice: number = 0;

  userPaymentInformation!: UserPaymentInforBooking;

  bookingTime?: Date; // Thêm trường thời gian thanh toán

  paymentNumber: string = '';

  status: string = '';

  selected: boolean = false;

  note: string = '';
}

export interface Booking2Create
  extends Omit<
    Booking,
    | '_id'
    | 'selected'
    | 'bookingNumber'
    | 'bookingItems'
    | 'busSchedule'
    | 'bookingTime'
    | 'paymentNumber'
    | 'payments'
    | 'status'
  > {}
export class Booking2Create {
  bookingItems: BookingItem2Create[] = [];
}

export interface BookingItem2Create extends Omit<BookingItem, '_id' | 'bookingItemNumber' | 'seat'> {}
export class BookingItem2Create {
  seat!: BookingItemSeat2Create;
}

export interface BookingItemSeat2Create extends Omit<BookingItemSeat, 'seatNumber' | 'status'> {}
export class BookingItemSeat2Create {}

export interface Booking2Update extends Omit<Booking2Create, 'bookingItems'> {}
export class Booking2Update extends Booking2Create {
  _id: string = '';
  bookingNumber: string = '';
  override bookingItems: BookingItem2Update[] = [];
}

export interface BookingItem2Update extends Omit<BookingItem, '_id' | 'bookingItemNumber' | 'seat'> {}
export class BookingItem2Update {
  seat!: BookingItemSeat2Update;
}

export interface BookingItemSeat2Update extends Omit<BookingItemSeat, 'seatNumber' | 'status'> {}
export class BookingItemSeat2Update {}

export class SearchBooking {
  bookings: Booking[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}
