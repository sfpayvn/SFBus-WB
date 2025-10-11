import { BusLayoutTemplate } from '../../bus-layout-templates/model/bus-layout-templates.model';
import { BusProvince } from '../../bus-provices/model/bus-province.model';
import { BusRoute, BusRouteBreakPoints } from '../../bus-routes/model/bus-route.model';
import { SeatType } from '../../../../../../../../../.history/src/app/modules/management/modules/bus-management/pages/seat-types/model/seat-type.model_20250518141530';
import { BusSeatPrices } from '../../bus-schedules/model/bus-schedule.model';

export class SearchBusScheduleTemplate {
  busScheduleTemplates: BusScheduleTemplate[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusScheduleTemplateRoute extends BusRoute {
  override breakPoints: BusRouteScheduleTemplateBreakPoints[] = [];
}

export class BusRouteScheduleTemplateBreakPoints extends BusRouteBreakPoints {
  timeOffset: string = '';
}

export class BusScheduleTemplateSeatPrices extends BusSeatPrices {}

export class BusScheduleTemplate {
  _id: string = '';
  name: string = '';
  busId: string = '';
  busDriverIds: string[] = [];
  busTemplateId: string = '';
  busRouteId: string = '';
  busRoute: BusScheduleTemplateRoute | undefined;
  busSeatLayoutBlockIds: string[] = [];
  busSeatPrices: BusScheduleTemplateSeatPrices[] = [];
  selected: boolean = false;
  isDefault: boolean = false;
}

export interface BusScheduleTemplate2Create extends Omit<BusScheduleTemplate, '_id' | 'selected'> {}
export class BusScheduleTemplate2Create {}

export class BusScheduleTemplate2Update extends BusScheduleTemplate2Create {
  _id: string = '';
}
