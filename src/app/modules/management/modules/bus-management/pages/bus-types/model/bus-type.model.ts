export class SearchBusType {
  busTypes: BusType[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusType {
  _id: string = '';
  name: string = '';
  selected: boolean = false;
}

export class BusType2Create {
  name: string = '';
}

export class BusType2Update {
  _id: string = '';
  name: string = '';
}
