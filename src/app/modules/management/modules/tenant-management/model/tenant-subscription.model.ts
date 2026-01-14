// tenant-subscription.model.ts
export type DurationUnit = string;
export type SubscriptionStatus = 'active' | 'canceled' | 'expired';

export interface TenantSubscription {
  _id: string;
  tenantId: string;
  subscriptionId: string;
  name: string;
  price: number;
  duration: number; // cùng đơn vị với durationUnit
  durationUnit: DurationUnit;
  limitationSnapshot: any; // có thể tạo type riêng khi cần render chi tiết
  startAt: string | Date;
  endAt: string | Date;
  status: SubscriptionStatus;
}

export class SearchTenantSubscription {
  pageIdx: number = 0;
  tenantSubscriptions: TenantSubscription[] = [];
  totalPage: number = 0;
  totalItem: number = 0;
}
