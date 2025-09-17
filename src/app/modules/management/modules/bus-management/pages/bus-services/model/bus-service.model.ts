export class SearchBusService {
  busServices: BusService[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusService {
  _id: string = '';
  name: string = '';
  iconId: string = '';
  icon: string = '';
  selected: boolean = false;
}

export class BusService2Create {
  iconId!: string;
  name: string = '';
}

export class BusService2Update extends BusService2Create {
  _id: string = '';
}
