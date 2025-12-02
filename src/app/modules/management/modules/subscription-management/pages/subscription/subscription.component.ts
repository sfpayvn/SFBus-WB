import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { SubscriptionService } from '../../service/subscription.service';
import { SearchSubscriptions, Subscription } from '../../model/subscription.model';
import { COMMON_STATUS_CLASSES, COMMON_STATUS_LABELS } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  standalone: false,
})
export class SubscriptionComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchSubscription: SearchSubscriptions = new SearchSubscriptions();

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

  isLoadingSubscription: boolean = false;
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

  subscriptionStatuses = COMMON_STATUS_LABELS;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private subscriptionService: SubscriptionService,
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
    this.loadSubscription();
  }

  loadSubscription() {
    this.isLoadingSubscription = true;
    this.subscriptionService.searchSubscription(this.searchParams).subscribe({
      next: (res: SearchSubscriptions) => {
        if (res) {
          this.searchSubscription = res;
          this.totalItem = this.searchSubscription.totalItem;
          this.totalPage = this.searchSubscription.totalPage;
        }
        this.isLoadingSubscription = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingSubscription = false;
      },
    });
  }

  reloadSubscriptionPage(data: any): void {
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
    const subscription = event as readonly Subscription[];
    this.searchSubscription.subscriptions = [...subscription];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchSubscription.subscriptions;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchSubscription.subscriptions.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  addSubscription() {
    this.router.navigate(['/management/subscription-management/subscription/detail']);
  }

  editSubscription(subscription: Subscription) {
    this.router.navigate(['/management/subscription-management/subscription/detail'], { state: { subscription } });
  }

  deleteSubscription(id: string): void {
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
        this.subscriptionService.deleteSubscription(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchSubscription.subscriptions = this.searchSubscription.subscriptions.filter(
                (subscription) => subscription._id !== id,
              );
              toast.success('Subscription Category deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }
}
