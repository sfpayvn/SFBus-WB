import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GOODS_STATUS_LABELS, GOODS_STATUS_CLASSES } from '@rsApp/core/constants/status.constants';
import { GoodsCategory } from '@rsApp/modules/management/modules/goods-management/model/goods-category.model';
import { Goods, SearchGoods } from '@rsApp/modules/management/modules/goods-management/model/goods.model';
import { GoodsCategoriesService } from '@rsApp/modules/management/modules/goods-management/service/goods-categories.servive';
import { GoodsService } from '@rsApp/modules/management/modules/goods-management/service/goods.servive';
import { Utils } from '@rsApp/shared/utils/utils';

import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-goods-recent-list',
  templateUrl: './goods-recent-list.component.html',
  styleUrls: ['./goods-recent-list.component.scss'],
  standalone: false,
})
export class GoodsRecentListComponent implements OnInit {
  goodsList: Goods[] = [];

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
    filters: [] as any[],
  };

  private categoryCache = new Map<string, GoodsCategory | undefined>();

  goodsStatuses = GOODS_STATUS_LABELS;
  goodsStatusClasses = GOODS_STATUS_CLASSES;

  isLoaded: boolean = false;
  expandedGoodsIds = new Set<string>();

  categories: GoodsCategory[] = [];

  constructor(
    private router: Router,
    private goodsService: GoodsService,
    public utils: Utils,
    private categoriesService: GoodsCategoriesService,
  ) {}

  toggleExpand(goodsId: string): void {
    if (this.expandedGoodsIds.has(goodsId)) {
      this.expandedGoodsIds.delete(goodsId);
    } else {
      this.expandedGoodsIds.add(goodsId);
    }
  }

  isExpanded(goodsId: string): boolean {
    return this.expandedGoodsIds.has(goodsId);
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  async initData(): Promise<void> {
    const findCategories = this.categoriesService.findAll();

    let request = [findCategories];
    combineLatest(request).subscribe(([categories]) => {
      this.categories = categories;
      this.categoryCache.clear();
      this.loadGoods();
    });
  }

  loadGoods() {
    this.isLoaded = false;

    try {
      this.goodsService.searchGoods(this.searchParams).subscribe({
        next: (res: SearchGoods) => {
          if (res) {
            this.goodsList = res.goods as Goods[];
            console.log('🚀 ~ GoodsRecentListComponent ~ loadGoods ~ this.goodsList:', this.goodsList);
          }
          this.isLoaded = true;
        },
        error: (error: any) => {
          this.utils.handleRequestError(error);
          this.isLoaded = true;
        },
      });
    } catch (err) {
      this.isLoaded = true;
      this.utils.handleUnexpectedError(err);
    }
  }

  getCategoryById(categoryId: string) {
    if (!categoryId) {
      return undefined;
    }

    if (this.categoryCache.has(categoryId)) {
      return this.categoryCache.get(categoryId);
    }

    const category = this.categories.find((c) => c._id === categoryId);
    this.categoryCache.set(categoryId, category);

    return category;
  }

  getGoodsStatusLabel(status: string): string {
    return this.goodsStatuses[status] || 'Không xác định';
  }

  getGoodsStatusClass(status: string): string {
    return this.goodsStatusClasses[status] || 'border-gray-300 bg-gray-100 text-gray-800';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewDetailGoods(goods: Goods) {
    this.router.navigate(['/goods/detail'], { state: { goods } });
  }
}
