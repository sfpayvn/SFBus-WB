import { BusSchedule } from '../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { GoodsCategory } from './goods-category.model';

export type DeliveryType = 'STATION' | 'ADDRESS';
export type FulfillmentMode = 'ROADSIDE' | 'STATION';

export class SearchGoods {
  goods: Goods[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
  countByStatus: Record<string, number> = {};
  countByPaymentStatus: Record<string, number> = {};
}

export class Goods {
  _id: string = '';
  busScheduleId: string = ''; // schedule hiện tại (currentScheduleId)
  busSchedule: BusSchedule = new BusSchedule();
  name: string = '';
  images: string[] = [];
  imageIds: string[] = [];
  goodsNumber: string = '';

  senderName: string = '';
  senderPhoneNumber: string = '';

  customerName: string = '';
  customerPhoneNumber: string = '';

  goodsPriority: number = 1;
  goodsImportant: boolean = false;

  quantity: number = 0;
  busRouteId: string = '';
  shippingCost: number = 0;
  cod: number = 0;
  goodsValue: number = 0;
  categories: GoodsCategory[] = [];
  categoriesIds: string[] = [];
  weight: number = 0;
  length: number = 0;
  width: number = 0;
  height: number = 0;
  note: string = '';
  status: string = '';
  paymentStatus: string = '';
  paidBy: string = 'sender'; // "sender" or "customer"

  paymentAmount?: number;
  paymentPaidAmount?: number;

  // Station relationship (id-based) - new fields per solution
  originStationId?: string; // station gửi (office gửi)
  destinationStationId?: string; // station nhận (office nhận / hub cuối)
  currentStationId?: string; // station hiện tại đang giữ hàng (null khi ON_BOARD)
  currentScheduleId?: string; // schedule hiện tại (alias cho busScheduleId)

  // Delivery type & address
  deliveryType?: DeliveryType; // STATION | ADDRESS

  pickupFulfillmentMode?: FulfillmentMode; // ROADSIDE | STATION
  deliveryFulfillmentMode?: FulfillmentMode; // ROADSIDE | STATION

  pickupAddress?: string; // nếu nhận dọc đường
  deliveryAddress?: string; // nếu giao tận nhà

  createdAt: Date = new Date();

  selected: boolean = false;
  isEditing: boolean = false;
  isRefreshing: boolean = false;
}

export interface Goods2Create extends Omit<Goods, '_id' | 'selected' | 'categories'> {}
export class Goods2Create {}

export class Goods2Update extends Goods2Create {
  _id: string = '';
}

export interface RequestUpdateGoodsScheduleAssignments {
  busScheduleId: string;
  goodsIds: string[];
}

export interface RequestQuickkUpdateGoodsStatus {
  goodsIds: string[];
  status: string;
}
