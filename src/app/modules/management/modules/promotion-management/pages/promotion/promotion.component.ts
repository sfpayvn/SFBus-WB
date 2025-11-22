import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Subscription } from 'rxjs';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { SearchPromotion, Promotion, Promotion2Create } from '../../model/promotion.model';
import { PromotionService } from '../../service/promotion.service';
import { CapsService } from '@rsApp/shared/services/caps.service';
import { COMMON_STATUS_CLASSES, COMMON_STATUS_LABELS } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  standalone: false,
})
export class PromotionComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchPromotion!: SearchPromotion;

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

  isLoadingPromotion: boolean = false;
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

  promotionStatuses: { [key: string]: string } = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    expired: 'Đã hết hạn',
  };

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private promotionService: PromotionService,
    private dialog: MatDialog,
    public capsService: CapsService,
  ) {
    this.eventSubscription = [];
    this.searchPromotion = {
      promotions: [],
      totalItem: 0,
      totalPage: 0,
      pageIdx: 0,
    };
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    this.initListenEvent();
  }

  initListenEvent() {}

  loadData(): void {
    this.loadPromotion();
  }

  loadPromotion() {
    this.isLoadingPromotion = true;
    this.promotionService.searchPromotion(this.searchParams).subscribe({
      next: (res: SearchPromotion) => {
        if (res) {
          this.searchPromotion = res;
          this.totalItem = this.searchPromotion.totalItem;
          this.totalPage = this.searchPromotion.totalPage;
        }
        this.isLoadingPromotion = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingPromotion = false;
      },
    });
  }

  reloadPromotionPage(data: any): void {
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
    const promotion = event as readonly Promotion[];
    this.searchPromotion.promotions = [...promotion];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchPromotion.promotions;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchPromotion.promotions.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  addPromotion() {
    this.router.navigate(['/management/promotion-management/promotion/detail']);
  }

  editPromotion(promotion: Promotion) {
    this.router.navigate(['/management/promotion-management/promotion/detail'], { state: { promotion } });
  }

  deletePromotion(id: string): void {
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
        this.promotionService.deletePromotion(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchPromotion.promotions = this.searchPromotion.promotions.filter(
                (promotion) => promotion._id !== id,
              );
              toast.success('Promotion Category deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  cloneData(promotion: Promotion): void {
    delete (promotion as any)._id;
    let promotion2Create = new Promotion2Create();
    promotion2Create = { ...promotion2Create, ...promotion };

    this.promotionService.createPromotion(promotion2Create).subscribe({
      next: (res: Promotion) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  checkStatusPromotion(status: string, expireDate: Date) {
    expireDate = new Date(expireDate);
    const currentDate = new Date();
    if (currentDate > expireDate) {
      return 'expired';
    }
    return status;
  }
}
