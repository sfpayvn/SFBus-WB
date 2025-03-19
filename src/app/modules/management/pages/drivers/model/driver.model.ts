export class SearchDriver {
  drivers: Driver[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Driver {
  _id: string = '';
  name: string = '';
  avatar: string = '';
  selected: boolean = false;
}


export interface Driver2Create extends Omit<Driver, '_id' | 'selected'> { }
export class Driver2Create {
}

export class Driver2Update extends Driver2Create {
  _id: string = '';
}
