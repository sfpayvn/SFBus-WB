export class SearchBusStation {
  busStations: BusStation[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusStation {
  _id: string = '';
  name: string = '';
  icon: string = '';
  provinceId: string = '';
  selected: boolean = false;
}

export class BusStation2Create {
  icon!: string;
  name: string = '';
  detailAddress: string = '';
  provinceId: string = '';
}

export class BusStation2Update extends BusStation2Create {
  _id: string = '';
}
