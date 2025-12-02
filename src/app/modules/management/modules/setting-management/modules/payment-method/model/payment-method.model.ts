export class PaymentBanking {
  providerId: string = '';

  token: string = '';

  bankName: string = '';

  accountNumber: string = '';

  accountName: string = '';
}

export class PaymentMethod {
  _id: string = '';

  tenantId: string = '';

  providerId: string = '';

  token: string = '';

  name: string = '';

  banking?: PaymentBanking;

  type: string = '';

  image: string = '';

  imageId: string = '';

  note?: string = '';

  status: string = '';

  isDefault?: boolean;

  isPaymentMethodDefault?: boolean;
}

export class AdminRequestPaymentMethod {
  paymentMethodId: string = '';
  transactionId: string = '';
  paymentNumber: string = '';
  totalPrice: number = 0;
}

export interface SearchPaymentMethodQuerySortFilter {
  key: string;
  value: string;
}

export interface SearchPaymentMethodQuery {
  pageIdx: number;
  pageSize: number;
  keyword: string;
  sortBy: SearchPaymentMethodQuerySortFilter;
  filters: SearchPaymentMethodQuerySortFilter[];
}

export interface SearchPaymentMethod {
  pageIdx: number;
  paymentMethods: PaymentMethod[];
  totalPage: number;
  totalItem: number;
}

export interface PaymentMethod2Create
  extends Omit<PaymentMethod, '_id' | 'selected' | 'isEditing' | 'createdAt' | 'updatedAt'> {}
export class PaymentMethod2Create {}

export interface PaymentMethod2Update extends PaymentMethod2Create {
  _id: string;
}
