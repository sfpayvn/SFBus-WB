import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Subscription } from 'rxjs';
import { GoodsCategoriesService } from '../../service/goods-categories.servive';
import { SearchGoodsCategory, GoodsCategory, GoodsCategory2Create } from '../../model/goods-category.model';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { GoodsCategoryDetailDialogComponent } from '../../component/goods-category-detail-dialog/goods-category-detail-dialog.component';
import { COMMON_STATUS_CLASSES, COMMON_STATUS_LABELS } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-goods-categories',
  templateUrl: './goods-categories.component.html',
  styleUrls: ['./goods-categories.component.scss'],
  standalone: false,
})
export class GoodsCategoriesComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchGoodsCategories: SearchGoodsCategory = new SearchGoodsCategory();

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

  statusClasses = COMMON_STATUS_CLASSES;

  goodsStatuses = COMMON_STATUS_LABELS;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private goodsCategoriesService: GoodsCategoriesService,
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
    this.goodsCategoriesService.searchGoodsCategories(this.searchParams).subscribe({
      next: (res: SearchGoodsCategory) => {
        if (res) {
          this.searchGoodsCategories = res;
          this.totalItem = this.searchGoodsCategories.totalItem;
          this.totalPage = this.searchGoodsCategories.totalPage;
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
    const goods = event as readonly GoodsCategory[];
    this.searchGoodsCategories.goodsCategories = goods;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchGoodsCategories.goodsCategories;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchGoodsCategories.goodsCategories.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteGoodsCategory(id: string): void {
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
        this.goodsCategoriesService.deleteGoodsCategories(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchGoodsCategories.goodsCategories = this.searchGoodsCategories.goodsCategories.filter(
                (goodsCategory) => goodsCategory._id !== id,
              );
              toast.success('Goods Category deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editGoodsCategory(goodsCategory: GoodsCategory): void {
    const dialogRef = this.dialog.open(GoodsCategoryDetailDialogComponent, {
      data: {
        title: 'Edit Goods Category',
        goodsCategory: { ...goodsCategory },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const goodsCategory2Update = {
          ...goodsCategory,
          name: result.name,
          iconId: result.iconId,
        };
        this.goodsCategoriesService.processUpdateGoodsCategories(result.files, goodsCategory2Update).subscribe({
          next: (res: GoodsCategory) => {
            if (res) {
              this.searchGoodsCategories.goodsCategories = this.searchGoodsCategories.goodsCategories.map(
                (goodsCategory: GoodsCategory) =>
                  goodsCategory._id === res._id ? { ...goodsCategory, ...res } : goodsCategory,
              );
              toast.success('Goods Category updated successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  addGoodsCategory(): void {
    const dialogRef = this.dialog.open(GoodsCategoryDetailDialogComponent, {
      data: {
        title: 'Add New Goods Category',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const goodsCategory2Create = new GoodsCategory2Create();
        goodsCategory2Create.name = result.name;
        goodsCategory2Create.iconId = result.iconId;

        this.goodsCategoriesService.processCreateGoodsCategories(result.files, goodsCategory2Create).subscribe({
          next: (res: GoodsCategory) => {
            if (res) {
              this.loadData();
              toast.success('SeatType added successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  cloneData(goodsCategory: GoodsCategory): void {
    delete (goodsCategory as any)._id;
    let goodsCategory2Create = new GoodsCategory2Create();
    goodsCategory2Create = { ...goodsCategory2Create, ...goodsCategory };

    this.goodsCategoriesService.createGoodsCategories(goodsCategory2Create).subscribe({
      next: (res: GoodsCategory) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    this.utilsModal.viewImage($event, image);
  }
}
