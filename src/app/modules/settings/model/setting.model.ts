export class SearchSettings {
  settings: readonly Setting[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Setting {
  name: string = '';
  value: string = '';
  description?: string;
  groupName?: string;
}

export interface Setting2Create extends Omit<Setting, '_id'> {}
export class Setting2Create {}

export class Setting2Update extends Setting2Create {}
