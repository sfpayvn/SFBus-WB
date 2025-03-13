import { BusProvince } from "../../bus-provices/model/bus-province.model";
import { BusRoute, BusRouteBreakPoints } from "../../bus-routes/model/bus-route.model";

export class SearchBusScheduleTemplate {
  busScheduleTemplates: BusScheduleTemplate[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusScheduleTemplateRoute extends BusRoute {
  override breakPoints: BusRouteScheduleBreakPoints[] = [];
}

export class BusRouteScheduleBreakPoints extends BusRouteBreakPoints {
  timeSchedule: string = '';
  provinceId: string = '';
  province: BusProvince | undefined;
  name: string = '';
  detailAddress: string = '';
  location: string = '';
}

export class BusScheduleTemplate {
  _id: string = '';
  name: string = '';
  busId: string = '';
  busRouteId: string = '';
  busRoute: BusScheduleTemplateRoute | undefined;
  busScheduleTemplateId: string = '';
  price: number = 0;
  remainSeat: number = 0;
  status: string = '';
  selected: boolean = false;
}

export interface BusScheduleTemplate2Create extends Omit<BusScheduleTemplate, '_id' | 'selected'> { }
export class BusScheduleTemplate2Create {
}

export class BusScheduleTemplate2Update extends BusScheduleTemplate2Create {
  _id: string = '';
}
