import { BusStation } from '../../bus-stations/model/bus-station.model';

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
  isDefault: boolean = false;
  selected: boolean = false;
  busStations: BusStation[] = [];
  isActive: boolean = true;
}

export class BusProvince2Create {
  icon!: string;
  name: string = '';
  isActive: boolean = true;
}

export class BusProvince2Update extends BusProvince2Create {}

export class CloneBusProvince {
  busProvince: BusProvince2Create = new BusProvince2Create();
  busStations: BusStation[] = [];
}
