import { BusLayoutTemplate } from '../../bus-layout-templates/model/bus-layout-templates.model';
import { BusProvince } from '../../bus-provices/model/bus-province.model';
import { BusRoute, BusRouteBreakPoints } from '../../bus-routes/model/bus-route.model';
import {
  BusRouteScheduleTemplateBreakPoints,
  BusScheduleTemplateRoute,
} from '../../bus-schedule-templates/model/bus-schedule-template.model';
import { BusTemplate } from '../../bus-templates/model/bus-template.model';
import { Bus } from '../../buses/model/bus.model';

export class SearchBusSchedule {
  busSchedules: BusSchedule[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusScheduleRoute extends BusScheduleTemplateRoute {
  override breakPoints: BusRouteScheduleBreakPoints[] = [];
}

export class BusRouteScheduleBreakPoints extends BusRouteScheduleTemplateBreakPoints {
  timeSchedule: string = '';
  provinceId: string = '';
  province: BusProvince | undefined;
  name: string = '';
  detailAddress: string = '';
  location: string = '';
}

export class BusSeatPrices {
  seatTypeId: string = '';
  seatTypeName: string = '';
  price: number = 0;
}

export class BusSchedule {
  _id: string = '';
  name: string = '';
  busId: string = '';
  bus: Bus | undefined;
  busTemplateId: string = '';
  busTemplate: BusTemplate | undefined;
  busRouteId: string = '';
  busRoute: BusScheduleRoute | undefined;
  busScheduleTemplateId: string = '';
  busLayoutTemplateId: string = '';
  busLayoutTemplate: BusLayoutTemplate | undefined;
  busScheduleLayoutId: string = '';
  busSeatLayoutBlockIds: string[] = [];
  busSeatPrices: BusSeatPrices[] = [];
  busDriverIds: string[] = [];
  price: number = 0;
  status: string = '';
  startDate: Date | undefined;
  endDate: Date | undefined;
  selected: boolean = false;
}

export interface BusSchedule2Create extends Omit<BusSchedule, '_id' | 'selected'> {}
export class BusSchedule2Create {}

export class BusSchedule2Update extends BusSchedule2Create {
  _id: string = '';
}
