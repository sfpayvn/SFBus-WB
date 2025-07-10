export class SearchSeatType {
  seatTypes: SeatType[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class SeatType {
  _id: string = '';
  name: string = '';
  icon: string = '';
  iconId: string = '';
  selected: boolean = false;
  isEnv: boolean = false;
}

export class SeatType2Create {
  iconId!: string;
  isEnv: boolean = false;
  name: string = '';
}

export class SeatType2Update extends SeatType2Create {
  _id: string = '';
}
