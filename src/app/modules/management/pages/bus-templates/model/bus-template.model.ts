export class SearchBusTemplate {
  busTemplates: BusTemplate[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusTemplate {
  _id: string = '';
  name: string = '';
  icon: string = '';
  selected: boolean = false;
}

export class BusTemplate2Create {
  icon!: string;
  name: string = '';
}

export class BusTemplate2Update extends BusTemplate2Create {
  _id: string = '';
}
