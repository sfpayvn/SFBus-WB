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

export class Tenant {
  code: string = '';

  name: string = '';

  phoneNumber: string = '';

  email: string = '';

  address?: string;

  logoId?: string;

  logo?: string;
}

export class User {
  _id: string = '';
  tenantId: string = '';
  tenant?: Tenant;
  avatar: string = '';
  avatarId: string = '';
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  gender: string = '';
  roles: string[] = [];
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
