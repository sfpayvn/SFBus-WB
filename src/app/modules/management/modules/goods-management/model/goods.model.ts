import { BusSchedule } from '../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { GoodsCategory } from './goods-category.model';

export class SearchGoods {
  goods: readonly Goods[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Goods {
  _id: string = '';
  busScheduleId: string = '';
  busSchedule: BusSchedule = new BusSchedule();
  name: string = '';
  image: string = '';
  goodsNumber: string = '';

  senderName: string = '';
  senderPhoneNumber: string = '';
  senderAddress: string = '';

  customerName: string = '';
  customerPhoneNumber: string = '';
  customerAddress: string = '';

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

  paidBy: string = 'sender'; // "sender" or "customer"

  selected: boolean = false;
  isEditing: boolean = false;
}

export interface Goods2Create extends Omit<Goods, '_id' | 'selected' | 'categories'> {}
export class Goods2Create {}

export class Goods2Update extends Goods2Create {
  _id: string = '';
}
