export class SearchBus {
  buses: Bus[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Bus {
  _id: string = '';
  name: string = '';
  icon: string = '';
  selected: boolean = false;
}

export class Bus2Create {
  icon!: string;
  name: string = '';
}

export class Bus2Update extends Bus2Create {
  _id: string = '';
}
