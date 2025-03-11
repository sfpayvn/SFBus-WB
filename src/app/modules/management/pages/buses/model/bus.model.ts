export class SearchBus {
  buses: Bus[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Bus {
  _id: string = '';
  name: string = '';
  licensePlate: string = '';
  busServiceIds: string[] = [];
  busTypeId: string = '';
  busTemplateId: string = '';
  selected: boolean = false;
}

export interface Bus2Create extends Omit<Bus, '_id' | 'selected'> { }
export class Bus2Create {
}

export class Bus2Update extends Bus2Create {
  _id: string = '';
}
