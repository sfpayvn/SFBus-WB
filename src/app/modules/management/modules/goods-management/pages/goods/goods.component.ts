import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom, Subject, Subscription, takeUntil } from 'rxjs';
import {
  PRIORITYCLASSES,
  GOODS_STATUS_CLASSES,
  GOODS_STATUS,
  GOODS_STATUS_LABELS,
  GOODS_STATUS_OPTIONS,
  GOODS_PAYMENT_STATUS_LABELS,
  GOODS_PAYMENT_STATUS_CLASSES,
  GOODS_PAYMENT_STATUS_OPTIONS,
} from '@rsApp/core/constants/status.constants';
import { StorageService } from '@rsApp/shared/services/storage.service';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { toast } from 'ngx-sonner';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { BusStation } from '../../../bus-management/pages/bus-stations/model/bus-station.model';
import { BusStationsService } from '../../../bus-management/pages/bus-stations/service/bus-stations.servive';
import { SearchGoods, Goods, RequestUpdateGoodsScheduleAssignments } from '../../model/goods.model';
import { GoodsService } from '../../service/goods.servive';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss'],
  standalone: false,
})
export class GoodsComponent implements OnInit, OnDestroy {
  @ViewChild('goodsTableWrapper') goodsTableWrapper!: ElementRef<HTMLDivElement>;
  private dragListeners: Array<() => void> = [];

  eventSubscription!: Subscription[];
  private destroy$ = new Subject<void>();

  // Static caches to preserve data across component recreation
  private static cachedBusStationsOffices: BusStation[] | null = null;
  private static cachedBusRoutes: Map<string, BusRoute[]> = new Map();

  searchGoods: SearchGoods = new SearchGoods();
  filteredGooods: Goods[] = [];

  // Columns are declared in template via <app-table-column> elements

  searchParams = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 10,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: [] as any[],
  };

  isLoaded: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();
  priorityClasses = PRIORITYCLASSES;

  // expose selected ids as an array for templates (safe access)
  get selectedIdsArray(): string[] {
    try {
      return Array.from(this.setOfCheckedId || []);
    } catch (e) {
      return [];
    }
  }

  filterRoles = [
    { text: 'User', value: 'user' },
    { text: 'Driver', value: 'driver' },
  ];

  filterStatus: string = 'all';
  filterPaymentStatus: string = 'all';

  totalPage: number = 0;
  totalItem: number = 0;

  statusClasses = GOODS_STATUS_CLASSES;

  goodsStatuses = GOODS_STATUS;
  goodsStatusesLabel = GOODS_STATUS_LABELS;
  goodsStatusesOptions = GOODS_STATUS_OPTIONS;

  // Return ordered status counts according to GOODS_STATUS_OPTIONS with an "all" entry first
  get statusCounts() {
    const counts: Record<string, number> = (this.searchGoods && this.searchGoods.countByStatus) || {};
    const computedTotal = Object.values(counts).reduce((s, v) => s + (v || 0), 0);
    const allValue = counts.hasOwnProperty('all') ? counts['all'] : computedTotal;
    const result: Array<{ key: string; label: string; value: number }> = [];

    result.push({ key: 'all', label: 'TẤT CẢ', value: allValue || 0 });

    for (const opt of this.goodsStatusesOptions) {
      const key = opt.value as string;
      const label = opt.label as string;
      result.push({ key, label, value: counts[key] || 0 });
    }

    return result;
  }

  goodsPaymentStatuses = GOODS_PAYMENT_STATUS_LABELS;
  paymentStatusClasses = GOODS_PAYMENT_STATUS_CLASSES;

  // Return ordered payment status counts according to GOODS_PAYMENT_STATUS_OPTIONS
  get paymentStatusCounts() {
    const counts: Record<string, number> = {};
    const result: Array<{ key: string; label: string; value: number }> = [];

    for (const opt of GOODS_PAYMENT_STATUS_OPTIONS) {
      const key = opt.value as string;
      const label = opt.label as string;
      result.push({ key, label, value: counts[key] || 0 });
    }

    return result;
  }

  busStationsOffices: BusStation[] = [];

  busRoutes: BusRoute[] = [];

  startTimeScheduleValueBusScheduleSearch: Date | null = null;
  endTimeScheduleValueBusScheduleSearch: Date | null = null;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private goodsService: GoodsService,
    private router: Router,
    private busRoutesService: BusRoutesService,
    private busSchedulesService: BusSchedulesService,
    private busStationsService: BusStationsService,
    private storageService: StorageService,
    private renderer: Renderer2,
  ) {
    this.eventSubscription = [];
  }

  ngAfterViewInit(): void {}

  async ngOnInit(): Promise<void> {
    this.initListenEvent();
    this.initializeData();
  }

  ionViewWillEnter() {}

  initListenEvent() {
    const sub = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(async () => {
        // re-initialize when returning to booking route
        if (this.router.url && this.router.url.startsWith('/goods')) {
          const busStationOfficeId = (await this.storageService.get('currentStationId')) || '';
          this.utils.addOrReplaceFilters({ key: 'currentStationId', value: busStationOfficeId }, this.searchParams);
          await this.loadBusRoutes();
        }
      });
    this.eventSubscription.push(sub as Subscription);
  }

  ngOnDestroy() {
    this.eventSubscription.forEach((s) => s.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
    // remove drag listeners
    try {
      this.dragListeners.forEach((fn) => fn());
      this.dragListeners = [];
    } catch (e) {
      // ignore
    }
  }

  async initializeData() {
    const stored = await this.storageService.get('busStationsOffices');
    if ((!this.busStationsOffices || this.busStationsOffices.length === 0) && stored) {
      try {
        this.busStationsOffices = JSON.parse(stored || '[]');
      } catch (e) {
        this.busStationsOffices = [];
      }
    }
  }

  async loadGoods() {
    this.isLoaded = false;
    this.goodsService.searchGoods(this.searchParams).subscribe({
      next: async (res: SearchGoods) => {
        if (res) {
          this.searchGoods = res;
          this.totalItem = this.searchGoods.totalItem;
          this.totalPage = this.searchGoods.totalPage;
          this.refreshCheckedStatus();
          this.filteredGooods = [...res.goods];
        }
        this.isLoaded = true;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoaded = true;
      },
    });
  }

  loadDataFindGoods(event: any) {
    const { filters, sortBy } = event;
    const fields = ['busRouteId', 'busStationOfficeId', 'startDate', 'endDate', 'status', 'phoneNumber'];
    this.searchParams.keyword = filters.keyword || '';
    this.searchParams.filters = [];
    fields.forEach((key) => {
      const hasKey = Object.prototype.hasOwnProperty.call(filters, key);
      const value = hasKey ? filters[key] : undefined;

      // Map busStationOfficeId -> currentStationId for backend filters
      const mappedKey = key === 'busStationOfficeId' ? 'currentStationId' : key;

      if (hasKey && value !== null && value !== undefined && value !== '') {
        this.utils.addOrReplaceFilters({ key: mappedKey, value }, this.searchParams);
      } else {
        // Remove filter if the field is not present or has no meaningful value
        // Remove both the mapped key and the original key to be safe (e.g., busStationOfficeId -> currentStationId)
        this.searchParams.filters = this.searchParams.filters.filter(
          (filter) => filter.key !== mappedKey && filter.key !== key,
        );
      }
    });

    // preserve existing `busStationsOffices` when incoming filters don't contain it
    this.busStationsOffices = filters.busStationsOffices ?? this.busStationsOffices;

    //important: sortBy may be null/undefined
    if (sortBy && sortBy.key) {
      this.searchParams.sortBy = sortBy;
    }
    this.loadGoods();
  }

  getBusStationOffice(stationId: string): BusStation | undefined {
    if (!this.busStationsOffices || this.busStationsOffices.length === 0) {
      return undefined;
    }
    return this.busStationsOffices.find((station) => station._id === stationId);
  }

  getBusRoutes(routeId: string): BusRoute | undefined {
    if (this.busRoutes.length === 0) {
      return undefined;
    }
    return this.busRoutes.find((route) => route._id === routeId);
  }

  reloadGoodsPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadGoods();
  }

  searchGoodPage(keyword: any) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadGoods();
  }

  sortGoodPage(event: any) {
    const sortBy = event as { key: string; value: string };
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadGoods();
  }

  onCurrentPageDataChange(event: any): void {
    const goods = event as Goods[];
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

  // sync selection from app-table (emits selected ids array)
  onTableSelectionChange(ids: string[]) {
    try {
      this.setOfCheckedId = new Set(ids || []);
    } catch (e) {
      this.setOfCheckedId = new Set<string>();
    }
    this.refreshCheckedStatus();
  }

  addGoods() {
    this.router.navigate(['/management/goods-management/goods/detail']);
  }

  editGoods(goods: Goods) {
    this.router.navigate(['/management/goods-management/goods/detail'], { state: { goods } });
  }

  async deleteGoods(goodsId: string) {
    const goods = this.searchGoods.goods.find((goods: Goods) => goods._id === goodsId);
    if (!goods) {
      return;
    }
    const header = '(*) Lưu ý';
    const content = `Bạn có chắc chắn muốn xóa vé <b>${goods.goodsNumber}</b> này không.`;
    const btns = [
      {
        name: 'Đóng',
        type: 'cancel',
      },
      {
        name: 'Đồng ý',
        type: 'confirm',
      },
    ];
    this.utilsModal.openModalConfirm(header, content, 'dangerous', btns).subscribe((result) => {
      if (result) {
        this.goodsService.deleteGoods(goods._id).subscribe((res: any) => {
          if (res) {
            toast.success('Xóa thành công');
            this.loadGoods();
          } else {
            toast.error('Xóa thất bại');
          }
        });
      }
    });
  }

  ///////////////////////////////// Choose  Bus Route ////////////////////////////////////////////////////////

  async loadBusRoutes() {
    // Load busRoutes nếu chưa có
    if (this.busRoutes && this.busRoutes.length > 0) {
      return;
    }

    // Try static cache first
    const cached = GoodsComponent.cachedBusRoutes.get('all');
    if (cached) {
      this.busRoutes = cached;
      return;
    }

    try {
      this.busRoutes = await firstValueFrom(this.busRoutesService.findAll());
      GoodsComponent.cachedBusRoutes.set('all', this.busRoutes);
    } catch (error) {
      toast.error('Tải danh sách tuyến xe thất bại');
      return;
    }
  }

  filterStatusChange(event: any) {
    if (event === this.filterStatus) {
      return;
    }
    this.filterStatus = event;
    this.searchParams.filters = this.searchParams.filters.filter((filter) => filter.key !== 'status');
    if (event === 'all') {
      this.loadGoods();
      return;
    }
    this.utils.addOrReplaceFilters({ key: 'status', value: event }, this.searchParams);
    this.loadGoods();
  }

  filterPaymentStatusChange(event: any) {
    if (event === this.filterPaymentStatus) {
      return;
    }
    this.filterPaymentStatus = event;
    this.searchParams.filters = this.searchParams.filters.filter((filter) => filter.key !== 'paymentStatus');
    if (event === 'all') {
      this.loadGoods();
      return;
    }
    this.utils.addOrReplaceFilters({ key: 'paymentStatus', value: event }, this.searchParams);
    this.loadGoods();
  }

  // Toggle payment status filter: if clicked value is already selected, clear it
  togglePaymentFilter(key: string) {
    const newKey = this.filterPaymentStatus === key ? 'all' : key;
    this.filterPaymentStatusChange(newKey);
  }
}
