export class Payment {
  _id: string = '';

  bookingId: string = '';

  bookingNumber: string = '';

  userId: string = '';

  promotionId?: string = '';

  paymentMethodId: string = '';

  paymentNumber: string = '';

  status: string = '';

  paymentAmount: number = 0; // Số tiền khách trả

  chargedAmount: number = 0; // Số tiền đã thu

  selected: boolean = false; // Thêm trường selected để đánh dấu booking đã chọn

  createdAt!: Date;
}

export interface Payment2Create extends Omit<Payment, '_id' | 'selected'> {}
export class Payment2Create {}

export class Payment2Update extends Payment2Create {
  _id: string = '';
}

export class RequestPaymentDto {
  transactionId: string = '';
  referrentGroupNumber: string = '';
  totalPrice: number = 0;
  paymentMethodId: string = '';
}
