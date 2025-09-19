export class SearchUser {
  users: readonly User[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class UserAddress {
  _id: string = '';
  addressType: string = '';
  address: string = '';
  isDefault: boolean = false;
}

export class User {
  _id: string = '';
  tenantId: string = '';
  avatar: string = '';
  avatarId: string = '';
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  gender: string = '';
  role: string = '';
  birthdate: string = '';
  addresses: UserAddress[] = [];
  selected: boolean = false;
  isEmailVerified: boolean = false;
  isPhoneNumberVerified: boolean = false;
  isLocked: boolean = false;
  isDeleted: boolean = false;
}

export interface User2Create extends Omit<User, '_id' | 'avatar' | 'selected'> {}
export class User2Create {}

export class User2Update extends User2Create {
  _id: string = '';
}

export interface UserAddress2Create extends Omit<UserAddress, '_id'> {}
export class UserAddress2Create {}

export class UserAddress2Update extends UserAddress2Create {
  _id: string = '';
}
