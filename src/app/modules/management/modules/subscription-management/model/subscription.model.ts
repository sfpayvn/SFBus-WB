// subscription.models.ts (class-based, no constructor/from)

/** ====== Enums ====== */
export enum RuleType {
  Count = 'count',
  Unlimited = 'unlimited',
}

export enum WindowType {
  Calendar = 'calendar',
  Rolling = 'rolling',
}

export enum WindowUnit {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Lifetime = 'lifetime',
}

export enum DefaultAction {
  Allow = 'allow',
  Block = 'block',
}

/** ====== Core Classes ====== */
export class FunctionRule {
  key!: string;
  type: RuleType = RuleType.Count;
  quota?: number;
  windowType?: WindowType;
  windowUnit?: WindowUnit;
  windowSize?: number;
  burst?: number;
  concurrency?: number;
}

export class ModuleRule {
  key!: string;
  /** Luật áp cho cả module (nếu có) */
  moduleRule?: FunctionRule;
  /** Luật chi tiết theo từng function */
  functions: FunctionRule[] = [];
}

export class SubscriptionLimitation {
  defaultAction: DefaultAction = DefaultAction.Allow;
  modules: ModuleRule[] = [];
}

export class Subscription {
  /** FE dùng string cho id là đủ (API trả _id dạng string) */
  _id!: string;
  name!: string;
  price: number = 0;
  duration: number = 0;
  durationUnit: 'month' | 'day' | 'year' = 'month';
  description: string = '';
  limitation: string = ''; // JSON string của SubscriptionLimitation
  status: string = 'active'; // active, inactive, suspended
  popular: boolean = false; // Có thể dùng để đánh dấu gói phổ biến

  /** BE có thể trả string date; FE tuỳ chọn dùng string | Date */
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export class RegisterToSubscription {
  tenantId: string = '';
  subscriptionId: string = '';
  startDate: Date = new Date();
  duration: number = 0;
  replaceCurrent: boolean = false;
}

/** ====== Search/Filter Classes ====== */
export class SearchSubscriptionQuerySortFilter {
  key?: string;
  value?: string;
}

export class SearchSubscriptionQuery {
  pageIdx: number = 1;
  pageSize: number = 20;
  keyword?: string;
  sortBy?: SearchSubscriptionQuerySortFilter;
  filters: SearchSubscriptionQuerySortFilter[] = [];
}

export class SearchSubscriptions {
  pageIdx: number = 1;
  subscriptions: Subscription[] = [];
  totalPage: number = 0;
  totalItem: number = 0;
}

export interface Subscription2Create extends Omit<Subscription, '_id' | 'selected' | 'createdAt' | 'updatedAt'> {}

export interface Subscription2Update extends Subscription2Create {
  _id: string;
}
