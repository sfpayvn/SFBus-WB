export class SearchBusRoute {
  busRoutes: BusRoute[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusRouteBreakPoints {
  busStationId: string = '';
}

export class BusRoute {
  _id: string = '';
  name: string = '';
  breakPoints: BusRouteBreakPoints[] = [];
  distance: number = 0;
  price: number = 0;
  distanceTime: string = '';
  selected: boolean = false;
}

export interface BusRoute2Create extends Omit<BusRoute, '_id' | 'selected'> { }
export class BusRoute2Create {
}

export class BusRoute2Update extends BusRoute2Create {
  _id: string = '';
}
