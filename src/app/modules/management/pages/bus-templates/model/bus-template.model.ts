export class SearchBusTemplate {
  busTemplates: BusTemplate[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusTemplateSeat {
  _id: string = '';
  index: number = 0;
  typeId: string = '';
  name: string = '';
  status: string = '';
}

export class BusTemplateSeatLayout {
  name: string = '';
  seats: BusTemplateSeat[] = [];
}

export class BusTemplate {
  _id: string = '';
  name: string = '';
  seatLayouts: BusTemplateSeatLayout[] = [];
  selected: boolean = false;
}

export interface BusTemplate2Create extends Omit<BusTemplate, '_id' | 'selected'> { }
export class BusTemplate2Create {
}

export class BusTemplate2Update extends BusTemplate2Create {
  _id: string = '';
}
