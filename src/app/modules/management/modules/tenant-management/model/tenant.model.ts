export class TenantSetting {
  appearance: string = '';
  timezone: string = '';
}

export class Tenant {
  _id: string = '';
  code: string = '';
  name: string = '';
  phoneNumber: string = '';
  email?: string = '';
  address?: string = '';
  logoId?: string = '';
  logo?: string = '';
  setting?: TenantSetting = new TenantSetting();
  subscriptionId?: string = '';
  status: string = 'active'; // active, inactive, suspended
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  // For UI purposes
  selected: boolean = false;
  isEditing: boolean = false;
}

export class SearchTenantQuerySortFilter {
  key: string = '';
  value: string = '';
}

export class SearchTenantQuery {
  pageIdx: number = 0;
  pageSize: number = 10;
  keyword: string = '';
  sortBy: SearchTenantQuerySortFilter = new SearchTenantQuerySortFilter();
  filters: SearchTenantQuerySortFilter[] = [];
}

export class SearchTenant {
  pageIdx: number = 0;
  tenants: Tenant[] = [];
  totalPage: number = 0;
  totalItem: number = 0;
}

export interface Tenant2Create extends Omit<Tenant, '_id' | 'selected' | 'isEditing' | 'createdAt' | 'updatedAt'> {}
export class Tenant2Create {}

export class Tenant2Update extends Tenant2Create {
  _id: string = '';
}
