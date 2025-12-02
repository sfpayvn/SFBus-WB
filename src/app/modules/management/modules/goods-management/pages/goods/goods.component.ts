import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Subscription } from 'rxjs';
import { Goods2Create, SearchGoods } from '../../model/goods.model';
import { Goods } from '../../model/goods.model';
import { GoodsService } from '../../service/goods.servive';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { GOODS_STATUS_CLASSES, GOODS_STATUS_LABELS } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss'],
  standalone: false,
})
export class GoodsComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchGoods: SearchGoods = new SearchGoods();

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

  isLoadingGoods: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  filterRoles = [
    { text: 'User', value: 'user' },
    { text: 'Driver', value: 'driver' },
  ];

  totalPage: number = 0;
  totalItem: number = 0;

  statusClasses = GOODS_STATUS_CLASSES;

  goodsStatuses = GOODS_STATUS_LABELS;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private goodsService: GoodsService,
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
    this.loadGoods();
  }

  loadGoods() {
    this.isLoadingGoods = true;
    this.goodsService.searchGoods(this.searchParams).subscribe({
      next: (res: SearchGoods) => {
        if (res) {
          this.searchGoods = res;
          console.log('🚀 ~ GoodsComponent ~ this.goodsService.searchGoods ~ this.searchGoods:', this.searchGoods);
          this.totalItem = this.searchGoods.totalItem;
          this.totalPage = this.searchGoods.totalPage;
        }
        this.isLoadingGoods = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingGoods = false;
      },
    });
  }

  reloadGoodsPage(data: any): void {
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
    const goods = event as readonly Goods[];
    this.searchGoods.goods = goods;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchGoods.goods;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchGoods.goods.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  addGoods() {
    this.router.navigate(['/management/goods-management/goods/detail']);
  }

  editGoods(goods: Goods) {
    this.router.navigate(['/management/goods-management/goods/detail'], { state: { goods } });
  }

  deleteGoods(id: string): void {
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
        this.goodsService.deleteGoods(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchGoods.goods = this.searchGoods.goods.filter((goods) => goods._id !== id);
              toast.success('Goods Category deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  cloneData(goods: Goods): void {
    // delete (goods as any)._id;
    // let goods2Create = new Goods2Create();
    // goods2Create = { ...goods2Create, ...goods };
    // this.goodsService.createGoods(goods2Create).subscribe({
    //   next: (res: Goods) => {
    //     if (res) {
    //       this.loadData();
    //       toast.success('Nhân bản thành công');
    //     }
    //   },
    //   error: (error: any) => this.utils.handleRequestError(error),
    // });
  }
}
