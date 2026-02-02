// tenant-subscription-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  COMMON_STATUS_CLASSES,
  COMMON_STATUS_LABELS,
  COMMON_STATUS_OPTIONS,
  DURATION_STATUS,
  DURATION_STATUS_LABELS,
} from '@rsApp/core/constants/status.constants';
import {
  SearchTenantSubscription,
  TenantSubscription,
} from '@rsApp/modules/management/modules/tenant-management/model/tenant-subscription.model';
import { TenantSubscriptionService } from '@rsApp/modules/management/modules/tenant-management/service/tenant-subscription.service';

@Component({
  selector: 'app-my-tenant-subscription',
  templateUrl: './my-tenant-subscription.component.html',
  styleUrls: ['./my-tenant-subscription.component.scss'],
  standalone: false,
})
export class MyTenantSubscriptionListComponent implements OnInit {
  // datasource
  searchResult: SearchTenantSubscription = new SearchTenantSubscription();

  loading = false;

  // table state

  statusOptions = COMMON_STATUS_OPTIONS;
  statusClasses = COMMON_STATUS_CLASSES;
  statusLabels = COMMON_STATUS_LABELS;

  searchParams: {
    pageIdx: number;
    startDate: Date | '';
    endDate: Date | '';
    pageSize: number;
    keyword: string;
    sortBy: {
      key: string;
      value: string;
    };
    filters: { key: string; value: any }[];
  } = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: [],
  };

  constructor(private tenantSubscriptionService: TenantSubscriptionService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.searchParams.pageIdx = 1;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.tenantSubscriptionService
      .searchMyTenantSubscription(this.searchParams)
      .subscribe((res: SearchTenantSubscription) => {
        if (res) {
          this.searchResult = res;
          this.loading = false;
        }
      });
  }

  formatDuration(item: TenantSubscription): string {
    if (item.durationUnit === DURATION_STATUS.LIFETIME) {
      return DURATION_STATUS_LABELS[DURATION_STATUS.LIFETIME];
    }
    return `${item.duration} ${item.durationUnit}${item.duration > 1 ? 's' : ''}`;
  }

  onView(item: TenantSubscription): void {
    // TODO: mở drawer/modal xem chi tiết limitationSnapshot
    console.log('view', item);
  }

  reloadTenantSubscriptionPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  onCancel(item: TenantSubscription): void {
    // TODO: gọi API hủy (chỉ khi đang active)
    console.log('cancel', item._id);
  }

  /**
   * Public method để refresh data từ parent component
   */
  refreshData(): void {
    console.log('🚀 ~ TenantSubscriptionListComponent ~ refreshData called');
    this.loadData();
  }
}
