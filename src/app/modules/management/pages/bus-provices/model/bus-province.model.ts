export class SearchBusProvince {
  busProvinces: BusProvince[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusProvince {
  _id: string = '';
  name: string = '';
  icon: string = '';
  selected: boolean = false;
}

export class BusProvince2Create {
  _id: string = '';
  icon!: string;
  name: string = '';
}

export class BusProvince2Update extends BusProvince2Create {
}
