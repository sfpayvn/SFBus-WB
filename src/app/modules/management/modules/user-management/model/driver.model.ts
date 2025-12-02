import { User } from './user.model';

export class UserDriver extends User {
  userId: string = '';
  driverId: string = '';
  licenseNumber: string = '';
  licenseExpirationDate: Date | undefined;
  licenseType: string = '';
  licenseImage: string = '';
}

export class Driver {
  _id: string = '';
  userId: string = '';
  licenseNumber: string = '';
  licenseExpirationDate: Date | undefined;
  licenseType: string = '';
  licenseImage: string = '';
}

export interface Driver2Create extends Omit<Driver, '_id' | 'selected'> {}
export class Driver2Create {}

export class Driver2Update extends Driver2Create {
  _id: string = '';
}
