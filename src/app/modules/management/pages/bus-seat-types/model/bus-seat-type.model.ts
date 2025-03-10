export class SearchBusSeatType {
  seatTypes: BusSeatType[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusSeatType {
  _id: string = '';
  name: string = '';
  icon: string = '';
  blockIcon: string = '';
  selectedIcon: string = '';
  selected: boolean = false;
  isEnv: boolean = false;
}

export class BusSeatType2Create {
  icon!: string;
  isEnv: boolean = false;
  blockIcon!: string;
  selectedIcon!: string;
  name: string = '';
}

export class BusSeatType2Update extends BusSeatType2Create {
  _id: string = '';
}
