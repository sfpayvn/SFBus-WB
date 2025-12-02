export class SearchBusLayoutTemplate {
  busLayoutTemplates: BusLayoutTemplate[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Seat {
  _id: string = '';
  index: number = 0;
  typeId: string = '';
  name: string = '';
  status: string = '';
}

export class BusSeatLayoutTemplate {
  name: string = '';
  seats: Seat[] = [];
}

export class BusLayoutTemplate {
  _id: string = '';
  name: string = '';
  seatLayouts: BusSeatLayoutTemplate[] = [];
  selected: boolean = false;
  isDefault: boolean = false;
}

export interface BusLayoutTemplate2Create extends Omit<BusLayoutTemplate, '_id' | 'selected'> {}
export class BusLayoutTemplate2Create {}

export class BusLayoutTemplate2Update extends BusLayoutTemplate2Create {
  _id: string = '';
}
