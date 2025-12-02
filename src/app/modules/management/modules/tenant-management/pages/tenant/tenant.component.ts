import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Subscription } from 'rxjs';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { SearchTenant, Tenant } from '../../model/tenant.model';
import { TenantService } from '../../service/tenant.service';
import { COMMON_STATUS_CLASSES, COMMON_STATUS_LABELS } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  standalone: false,
})
export class TenantComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchTenant: SearchTenant = new SearchTenant();

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
    filters: {
      key: '',
      value: [],
    },
  };

  isLoadingTenant: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  filterRoles = [
    { text: 'User', value: 'user' },
    { text: 'Driver', value: 'driver' },
  ];

  totalPage: number = 0;
  totalItem: number = 0;

  statusClasses = COMMON_STATUS_CLASSES;

  tenantStatuses = COMMON_STATUS_LABELS;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private tenantService: TenantService,
    private dialog: MatDialog,
  ) {
    this.eventSubscription = [];
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    this.initListenEvent();
  }

  initListenEvent() {}

  loadData(): void {
    this.loadTenant();
  }

  loadTenant() {
    this.isLoadingTenant = true;
    this.tenantService.searchTenant(this.searchParams).subscribe({
      next: (res: SearchTenant) => {
        if (res) {
          this.searchTenant = res;
          this.totalItem = this.searchTenant.totalItem;
          this.totalPage = this.searchTenant.totalPage;
        }
        this.isLoadingTenant = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingTenant = false;
      },
    });
  }

  reloadTenantPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchGoodPage(keyword: any) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadData();
  }

  sortGoodPage(event: any) {
    const sortBy = event as { key: string; value: string };
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadData();
  }

  onCurrentPageDataChange(event: any): void {
    const tenant = event as readonly Tenant[];
    this.searchTenant.tenants = [...tenant];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchTenant.tenants;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchTenant.tenants.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(_id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(_id);
    } else {
      this.setOfCheckedId.delete(_id);
    }
  }

  onItemChecked(_id: string, checked: boolean): void {
    this.updateCheckedSet(_id, checked);
    this.refreshCheckedStatus();
  }

  addTenant() {
    this.router.navigate(['/management/tenant-management/tenant/detail']);
  }

  editTenant(tenant: Tenant) {
    this.router.navigate(['/management/tenant-management/tenant/detail'], { state: { tenant } });
  }

  deleteTenant(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete SeatType',
        content:
          'Are you sure you want to delete this seatType? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tenantService.deleteTenant(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchTenant.tenants = this.searchTenant.tenants.filter((tenant) => tenant._id !== id);
              toast.success('Tenant Category deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }
}
