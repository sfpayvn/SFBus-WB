import { BusSchedule } from "../../../modules/bus-management/pages/bus-schedules/model/bus-schedule.model";

export class SearchGoods {
  goods: readonly Goods[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Goods {
  _id: string = "";
  busScheduleId: string = "";
  busSchedule: BusSchedule = new BusSchedule();
  name: string = "";
  image: string = "";
  goodsNumber: string = "";
  customerName: string = "";
  customerPhoneNumber: string = "";
  customerAddress: string = "";
  quantity: number = 0;
  busRouteId: string = "";
  shoppingCost: number = 0;
  cost: number = 0;
  goodsValue: number = 0;
  categories: string[] = [];
  note: string = "";
  status: string = "";
  selected: boolean = false;
}

export interface Goods2Create extends Omit<Goods, "_id" | "selected"> { }
export class Goods2Create { }

export class Goods2Update extends Goods2Create {
  _id: string = "";
}
