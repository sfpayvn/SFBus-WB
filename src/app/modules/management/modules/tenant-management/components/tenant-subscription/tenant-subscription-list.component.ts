// tenant-subscription-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchTenantSubscription, TenantSubscription } from '../../model/tenant-subscription.model';
import { TenantSubscriptionService } from '../../service/tenant-subscription.service';
import {
  COMMON_STATUS_CLASSES,
  COMMON_STATUS_LABELS,
  COMMON_STATUS_OPTIONS,
  DURATION_STATUS,
  DURATION_STATUS_LABELS,
} from '@rsApp/core/constants/status.constants';

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

  constructor(private fb: FormBuilder, private tenantSubscriptionService: TenantSubscriptionService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      keyword: [''],
      status: [null],
      dateRange: [[]], // [start, end]
    });

    const filterByTenantId = { key: 'tenantId', value: this.tenantId };
    this.searchParams.filters.push(filterByTenantId);
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
      status: string | null;
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
