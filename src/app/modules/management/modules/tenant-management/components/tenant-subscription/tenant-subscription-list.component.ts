// tenant-subscription-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SearchTenantSubscription,
  SubscriptionStatus,
  TenantSubscription,
} from '../../model/tenant-subscription.model';
import { TenantSubscriptionService } from '../../service/tenant-subscription.service';

@Component({
  selector: 'app-tenant-subscription-list',
  templateUrl: './tenant-subscription-list.component.html',
  styleUrls: ['./tenant-subscription-list.component.scss'],
  standalone: false,
})
export class TenantSubscriptionListComponent implements OnInit {
  @Input() tenantId!: string;
  form!: FormGroup;

  // datasource
  searchResult: SearchTenantSubscription = new SearchTenantSubscription();
  loading = false;

  // table state

  statusOptions: { label: string; value: SubscriptionStatus }[] = [
    { label: 'Active', value: 'active' },
    { label: 'Canceled', value: 'canceled' },
    { label: 'Expired', value: 'expired' },
  ];

  searchParams = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: ([] = [
      {
        key: 'tenantId',
        value: this.tenantId,
      },
    ]),
  };

  constructor(private fb: FormBuilder, private tenantSubscriptionService: TenantSubscriptionService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      keyword: [''],
      status: [null],
      dateRange: [[]], // [start, end]
    });
    this.searchParams;
    // mock load lần đầu
    this.search();
  }

  search(): void {
    this.searchParams.pageIdx = 1;
    this.loadData();
  }

  reset(): void {
    this.form.reset({ keyword: '', status: null, dateRange: [] });
    this.search();
  }

  loadData(): void {
    this.loading = true;

    // Lấy filter
    const { keyword, status, dateRange } = this.form.value as {
      keyword: string;
      status: SubscriptionStatus | null;
      dateRange: Date[];
    };

    this.searchParams.keyword = keyword?.trim();

    if (status) {
      const filterByStatus = this.searchParams.filters.find((f) => f.key === 'status');
      if (filterByStatus) {
        filterByStatus.value = status;
      } else {
        this.searchParams.filters.push({ key: 'status', value: status });
      }
    }

    this.tenantSubscriptionService
      .searchTenantSubscription(this.searchParams)
      .subscribe((res: SearchTenantSubscription) => {
        if (res) {
          this.searchResult = res;
          this.loading = false;
        }
      });
  }

  onCurrentPageDataChange(tenantSubscriptions: readonly TenantSubscription[]): void {
    this.searchResult.tenantSubscriptions = [...tenantSubscriptions];
  }

  reloadTenantSubscriptionPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  // helpers
  statusTag(status: SubscriptionStatus): { nzColor: string; text: string } | undefined {
    switch (status) {
      case 'active':
        return { nzColor: 'green', text: 'Active' };
      case 'canceled':
        return { nzColor: 'red', text: 'Canceled' };
      case 'expired':
        return { nzColor: 'orange', text: 'Expired' };
      default:
        return undefined;
    }
  }

  formatDuration(item: TenantSubscription): string {
    const unit = item.durationUnit === 'month' ? 'month' : 'day';
    return `${item.duration} ${unit}${item.duration > 1 ? 's' : ''}`;
  }

  onView(item: TenantSubscription): void {
    // TODO: mở drawer/modal xem chi tiết limitationSnapshot
    console.log('view', item);
  }

  onCancel(item: TenantSubscription): void {
    // TODO: gọi API hủy (chỉ khi đang active)
    console.log('cancel', item._id);
  }
}
