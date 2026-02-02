// tenant-subscription.model.ts
export interface TenantSubscription {
  _id: string;
  tenantId: string;
  subscriptionId: string;
  name: string;
  price: number;
  duration: number; // cùng đơn vị với durationUnit
  durationUnit: string;
  limitationSnapshot: any; // có thể tạo type riêng khi cần render chi tiết
  startAt: string | Date;
  endAt: string | Date;
  status: string;
}

export class SearchTenantSubscription {
  pageIdx: number = 0;
  tenantSubscriptions: TenantSubscription[] = [];
  totalPage: number = 0;
  totalItem: number = 0;
}
