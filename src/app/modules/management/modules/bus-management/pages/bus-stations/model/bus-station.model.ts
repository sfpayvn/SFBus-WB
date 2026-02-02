export class SearchBusStation {
  busStations: BusStation[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusStation {
  _id: string = '';
  name: string = '';
  detailAddress: string = '';
  imageId: string = '';
  image: string = '';
  location: string = '';
  provinceId: string = '';
  isDefault: boolean = false;
  isOffice: boolean = false;
  isActive: boolean = true;
}

export class BusStation2Create {
  icon!: string;
  name: string = '';
  detailAddress: string = '';
  imageId: string = '';
  location: string = '';
  provinceId: string = '';
  isOffice: boolean = false;
}

export class BusStation2Update extends BusStation2Create {
  _id: string = '';
}
