export class SearchUser {
  users: User[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class User {
  _id: string = '';
  name: string = '';
  selected: boolean = false;
}


export interface User2Create extends Omit<User, '_id' | 'selected'> { }
export class User2Create {
}

export class User2Update extends User2Create {
  _id: string = '';
}
