import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  GOODS_STATUS_OPTIONS,
  GOODS_STATUS,
  GOODS_STATUS_CLASSES,
  GOODS_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_CLASSES,
  GOODS_PAYMENT_STATUS_CLASSES,
  GOODS_PAYMENT_STATUS,
  DELIVERY_TYPE,
  DELIVERY_TYPE_OPTIONS,
  FULFILLMENT_MODE,
  FULFILLMENT_MODE_LABELS,
  FULFILLMENT_MODE_OPTIONS,
} from '@rsApp/core/constants/status.constants';
import { PaymentMethod } from '@rsApp/modules/dashboard/pages/report/models/report.model';
import { Payment, RequestPaymentDto } from '@rsApp/shared/models/payment.model';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { PaymentService } from '@rsApp/shared/services/payment/payment-service';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { toast } from 'ngx-sonner';
import { combineLatest, firstValueFrom, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Utils } from 'src/app/shared/utils/utils';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { BusStation } from '../../../bus-management/pages/bus-stations/model/bus-station.model';
import { PaymentMethodService } from '../../../payment-management/modules/payment-method/service/payment-method.service';
import { GoodsCategory } from '../../model/goods-category.model';
import { Goods, Goods2Create, Goods2Update } from '../../model/goods.model';
import { GoodsCategoriesService } from '../../service/goods-categories.servive';
import { GoodsService } from '../../service/goods.servive';
import { Location } from '@angular/common';

interface DepartureDestination {
  value: string;
  label: string;
  color: string;
  disabled: boolean;
  selected: boolean;
  breakPointIndex?: number; // Index in original breakPoints array
}

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrl: './goods-detail.component.scss',
  standalone: false,
})
export class GoodsDetailComponent implements OnInit, OnDestroy {
  @ViewChild('printContainer', { read: ViewContainerRef })
  printContainer!: ViewContainerRef;

  mainForm!: FormGroup;

  @Input() goods!: Goods;
  @Input() isDialog: boolean = false;

  goodsCategories: GoodsCategory[] = [];

  busSchedules: BusSchedule[] = [];
  busSchedulesFiltered: BusSchedule[] = [];

  busSchedule: BusSchedule = new BusSchedule();
  busRoute: BusRoute = new BusRoute();

  busRoutes: BusRoute[] = [];

  passwordConditions: { [key: string]: boolean } = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  };

  passwordVisible: boolean = false;

  goodsImageFiles: File[] = [];
  goodsImages: string[] = [];
  existingImageIds: string[] = []; // ImageIds từ database

  defaultImage = 'assets/images/goods-deail.png';

  mode: 'create' | 'update' = 'create';

  goodsStatusOptions = GOODS_STATUS_OPTIONS;
  goodsStatus = GOODS_STATUS;
  goodsStatusClasses = GOODS_STATUS_CLASSES;
  goodsStatusLabels = GOODS_STATUS_LABELS;

  deliveryType = DELIVERY_TYPE;
  deliveryTypeOptions = DELIVERY_TYPE_OPTIONS;

  fulfillmentMode = FULFILLMENT_MODE;
  fulfillmentModeLabels = FULFILLMENT_MODE_LABELS;
  fulfillmentModeOptions = FULFILLMENT_MODE_OPTIONS;

  paidByList = [
    { value: 'sender', label: 'Người gửi' },
    { value: 'customer', label: 'Người nhận' },
  ];

  paymentMethods: PaymentMethod[] = [];
  payments: Payment[] = [];
  isCreatePayment: boolean = false;
  paymentStatuses = PAYMENT_STATUS_LABELS;
  paymentStatusClasses = PAYMENT_STATUS_CLASSES;

  goodsPaymentStatusClasses = GOODS_PAYMENT_STATUS_CLASSES;

  private paymentMethodsCache = new Map<string, PaymentMethod>();
  private paymentMethodsLoaded: boolean = false;
  private busStationsCache = new Map<string, BusStation>();

  searchKeywordBusSchedule: string = '';
  isLoadedBusSchedule: boolean = false;

  private initialFormValue: any = null;
  private destroy$ = new Subject<void>();
  private blobUrls: string[] = [];

  departureList: DepartureDestination[] = [];
  destinationList: DepartureDestination[] = [];

  dataDepartureListFilterMatchedSearch: DepartureDestination[] = [];
  dataDestinationListFilterMatchedSearch: DepartureDestination[] = [];

  dataGoodsPriority: DepartureDestination[] = [];

  eventSubscription!: Subscription[]; // Subscription

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private goodsService: GoodsService,
    public utilsModal: UtilsModal,
    private busSchedulesService: BusSchedulesService,
    private goodsCategoriesService: GoodsCategoriesService,
    private busRoutesService: BusRoutesService,
    private loadingService: LoadingService,
    private paymentService: PaymentService,
    private paymentMethodService: PaymentMethodService,
    private cdr: ChangeDetectorRef,
    private location: Location,
  ) {
    this.eventSubscription = [];
  }

  async ngOnInit() {
    this.getQueryParams();
    this.initListenEvent();
    this.initData();
    if (this.goods) {
      this.mode = 'update';
      await this.loadPayment(this.goods._id || '');
    }
  }

  ngOnDestroy() {
    // Cleanup all subscriptions
    this.eventSubscription.forEach((sub) => sub.unsubscribe());

    // Cleanup destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();

    // Release all blob URLs
    this.blobUrls.forEach((url) => URL.revokeObjectURL(url));
    this.blobUrls = [];
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['goods']) {
      this.goods = params['goods'] ? params['goods'] : null;
    }
  }

  // Hàm lắng nghe sự kiện
  initListenEvent() {
    if (!this.goods || !this.goods._id) return;
    const _id = this.goods.busRouteId;
    // const goodsChangeSubscription = this.goodsService.listenGoodsChangeOfBusRouteId(_id).subscribe(async (goods) => {
    //   await this.processGoodsChange(goods);
    //   this.setDataGoodsForm();
    // });
    // this.eventSubscription.push(goodsChangeSubscription);
  }

  async initData() {
    const getGoodsCategories = this.goodsCategoriesService.findAll();
    const getBusRoutes = this.busRoutesService.findAll();
    combineLatest([getGoodsCategories, getBusRoutes]).subscribe({
      next: ([goodsCategories, busRoutes]) => {
        this.goodsCategories = goodsCategories;
        this.busRoutes = busRoutes;
        this.initForm();
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  loadBusSchedules() {
    this.isLoadedBusSchedule = false;
    const { busRouteId } = this.mainForm.value;

    const searchParams = {
      pageIdx: 1,
      pageSize: 999999,
      keyword: '',
      sortBy: {
        key: 'createdAt',
        value: 'descend',
      },
      filters: [] as any[],
    };

    if (!busRouteId) {
      return;
    }

    if (this.busSchedules.length > 0) {
      this.filterBusSchedules();
      this.isLoadedBusSchedule = true;
      return;
    }

    this.busSchedulesService.searchBusSchedule(searchParams).subscribe({
      next: (res: any) => {
        if (res) {
          this.busSchedules = res.busSchedules as BusSchedule[];
          this.filterBusSchedules();
        }
        this.isLoadedBusSchedule = true;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadedBusSchedule = true;
      },
    });
  }

  setListDepartureAndDestination() {
    const breakPoints = this.busRoute?.breakPoints || [];

    // Build departure list: exclude last breakpoint, keep all with their original indices
    this.departureList = [];
    const departureNames = new Set<string>();
    for (let i = 0; i < breakPoints.length - 1; i++) {
      const name = breakPoints[i].busStation.name;
      const id = breakPoints[i].busStation._id;
      const isOffice = breakPoints[i].busStation.isOffice;
      if (!departureNames.has(name) && isOffice) {
        departureNames.add(name);
        this.departureList.push({
          value: id,
          label: name,
          color: this.getColor(i),
          selected: false,
          disabled: false,
          breakPointIndex: i, // Store original index
        });
      }
    }

    // Build destination list: exclude first breakpoint, keep all with their original indices
    this.destinationList = [];
    const destinationNames = new Set<string>();
    for (let i = 1; i < breakPoints.length; i++) {
      const name = breakPoints[i].busStation.name;
      const id = breakPoints[i].busStation._id;
      const isOffice = breakPoints[i].busStation.isOffice;

      if (!destinationNames.has(name) && isOffice) {
        destinationNames.add(name);
        this.destinationList.push({
          value: id,
          label: name,
          color: this.getColor(i),
          selected: false,
          disabled: false,
          breakPointIndex: i, // Store original index
        });
      }
    }

    this.dataDepartureListFilterMatchedSearch = this.departureList;
    this.dataDestinationListFilterMatchedSearch = this.destinationList;
    this.dataGoodsPriority = this.dataDestinationListFilterMatchedSearch;
  }

  private getColor(index: number): string {
    const hue = (index * 137) % 360; // Sử dụng 137 (số vàng) để tạo sự phân bố đều màu
    const saturation = 70; // Độ bão hòa, giữ ở mức nhạt
    const lightness = 85; // Độ sáng cao để đảm bảo màu sắc dịu
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Find stationId by bus station name from breakPoints
   * Used to derive originStationId and destinationStationId
   */
  private findStationIdByName(stationName: string): string | undefined {
    if (!stationName) return undefined;
    const breakPoints = this.busRoute?.breakPoints || [];
    const breakPoint = breakPoints.find((bp: any) => bp.busStation?.name === stationName);
    return breakPoint?.busStation?._id;
  }

  onPointChange(event: any, type: string) {
    // Lấy giá trị được chọn từ event (nz-autocomplete trả về object với nzValue)
    const selectedValue = event?.nzValue || event?.value || event;

    if (!selectedValue) return;

    if (type === 'departure') {
      // Khi chọn departure, destination chỉ hiển thị các điểm SAU điểm departure (bỏ các điểm trước và chính nó)
      const selectedDeparture = this.departureList.find((d) => d.value === selectedValue);
      if (!selectedDeparture || selectedDeparture.breakPointIndex === undefined) return;

      this.dataDestinationListFilterMatchedSearch = this.destinationList.filter((dest: any) => {
        return dest.breakPointIndex !== undefined && dest.breakPointIndex > selectedDeparture.breakPointIndex!;
      });

      // Auto-populate originStationId from selected departure station name
      const stationId = this.findStationIdByName(selectedValue);
      if (stationId) {
        this.mainForm.get('originStationId')?.setValue(stationId, { emitEvent: false });
      }
    } else if (type === 'destination') {
      // Khi chọn destination, departure chỉ hiển thị các điểm TRƯỚC điểm destination (bỏ các điểm sau và chính nó)
      const selectedDestination = this.destinationList.find((d) => d.value === selectedValue);
      if (!selectedDestination || selectedDestination.breakPointIndex === undefined) return;

      const idx = this.dataGoodsPriority.findIndex((d) => d.value === selectedValue);

      this.mainForm.get('goodsPriority')?.enable();
      this.mainForm.get('goodsPriority')?.setValue(idx + 1);

      this.dataDepartureListFilterMatchedSearch = this.departureList.filter((dep: any) => {
        return dep.breakPointIndex !== undefined && dep.breakPointIndex < selectedDestination.breakPointIndex!;
      });

      // Auto-populate destinationStationId from selected destination station name
      const stationId = this.findStationIdByName(selectedValue);
      if (stationId) {
        this.mainForm.get('destinationStationId')?.setValue(stationId, { emitEvent: false });
      }
    }
  }

  onModelSeachDepartureDestinationListChange(event: any, type: 'departure' | 'destination'): void {
    const value = event?.target?.value;

    const keyword = value?.toLowerCase();

    if (type === 'departure') {
      this.dataDepartureListFilterMatchedSearch = this.departureList.filter(
        (departure: DepartureDestination) =>
          this.normalizeText(departure.value.toLowerCase()).includes(this.normalizeText(keyword)) ||
          this.normalizeText(departure.label.toLowerCase()).includes(this.normalizeText(keyword)),
      );

      this.dataDestinationListFilterMatchedSearch = this.destinationList.filter(
        (destination: DepartureDestination) =>
          this.normalizeText(destination.value.toLowerCase()).includes(this.normalizeText(keyword)) ||
          this.normalizeText(destination.label.toLowerCase()).includes(this.normalizeText(keyword)),
      );
    } else {
      this.dataDestinationListFilterMatchedSearch = this.destinationList.filter(
        (destination: DepartureDestination) =>
          this.normalizeText(destination.value.toLowerCase()).includes(this.normalizeText(keyword)) ||
          this.normalizeText(destination.label.toLowerCase()).includes(this.normalizeText(keyword)),
      );
    }
  }

  resetSeachDepartureDestinationList(type: 'departure' | 'destination') {
    if (type == 'departure') {
      this.mainForm.get('senderAddress')?.patchValue('');

      // Kiểm tra nếu destination có giá trị, filter departure dựa trên destination
      const destinationValue = this.mainForm.get('customerAddress')?.value;
      if (destinationValue) {
        const selectedDestination = this.destinationList.find((d) => d.value === destinationValue);
        if (selectedDestination && selectedDestination.breakPointIndex !== undefined) {
          this.dataDepartureListFilterMatchedSearch = this.departureList.filter((dep: any) => {
            return dep.breakPointIndex !== undefined && dep.breakPointIndex < selectedDestination.breakPointIndex!;
          });
        } else {
          this.dataDepartureListFilterMatchedSearch = this.departureList;
        }
      } else {
        this.dataDepartureListFilterMatchedSearch = this.departureList;
      }
    } else {
      this.mainForm.get('customerAddress')?.patchValue('');

      // Kiểm tra nếu departure có giá trị, filter destination dựa trên departure
      const departureValue = this.mainForm.get('senderAddress')?.value;
      if (departureValue) {
        const selectedDeparture = this.departureList.find((d) => d.value === departureValue);
        if (selectedDeparture && selectedDeparture.breakPointIndex !== undefined) {
          this.dataDestinationListFilterMatchedSearch = this.destinationList.filter((dest: any) => {
            return dest.breakPointIndex !== undefined && dest.breakPointIndex > selectedDeparture.breakPointIndex!;
          });
        } else {
          this.dataDestinationListFilterMatchedSearch = this.destinationList;
        }
      } else {
        this.dataDestinationListFilterMatchedSearch = this.destinationList;
      }
    }
  }

  onSearch(keyword: string) {
    this.searchKeywordBusSchedule = keyword;
    this.filterBusSchedules();
  }

  filterBusSchedules() {
    this.busSchedulesFiltered = [...this.busSchedules];
    // Lọc theo từ khóa tìm kiếm
    if (this.searchKeywordBusSchedule) {
      this.busSchedulesFiltered = this.busSchedulesFiltered.filter(
        (busSchedule: BusSchedule) =>
          busSchedule.bus?.name.toLowerCase().includes(this.searchKeywordBusSchedule.toLowerCase()) ||
          (busSchedule.startDate &&
            (this.formatDate(busSchedule.startDate) ?? '').includes(this.searchKeywordBusSchedule)) ||
          (busSchedule.startDate &&
            (this.formatTime(busSchedule.startDate) ?? '').includes(this.searchKeywordBusSchedule)) ||
          (busSchedule.endDate &&
            (this.formatDate(busSchedule.endDate) ?? '').includes(this.searchKeywordBusSchedule)) ||
          (busSchedule.endDate &&
            (this.formatTime(busSchedule.endDate) ?? '').includes(this.searchKeywordBusSchedule)) ||
          (busSchedule.startDate &&
            (this.formatTime(busSchedule.startDate) + ' - ' + (this.formatDate(busSchedule.startDate) ?? '')).includes(
              this.searchKeywordBusSchedule,
            )) ||
          (busSchedule.endDate &&
            (this.formatTime(busSchedule.endDate) + ' - ' + (this.formatDate(busSchedule.endDate) ?? '')).includes(
              this.searchKeywordBusSchedule,
            )),
      );
    }

    // Sắp xếp theo startDate tăng dần
    this.busSchedulesFiltered.sort((a, b) => {
      const dateA = a.startDate && new Date(a.startDate).getTime();
      const dateB = b.startDate && new Date(b.startDate).getTime();
      return (dateA ?? 0) - (dateB ?? 0);
    });
  }

  processGoodsChange(goods: Goods) {
    if (goods._id === this.goods._id) {
      this.goods = goods;
      this.utils.updateState({ goods: goods });
    }
  }

  setDataGoodsForm() {
    if (!this.mainForm) return;

    // Update images arrays for UI
    this.goodsImages = this.goods?.images && this.goods.images.length > 0 ? [...this.goods.images] : [];
    this.existingImageIds = this.goods?.imageIds ? [...this.goods.imageIds] : [];

    // Prepare patch values (ensure categories are ids)
    const categories = Array.isArray(this.goods?.categories)
      ? this.goods.categories.map((c: any) => (typeof c === 'string' ? c : c._id))
      : [];

    const patch: any = {
      images: this.goodsImages.length > 0 ? this.goodsImages[0] : '',
      name: this.goods?.name || '',
      categories: categories,
      busScheduleId: this.goods?.busScheduleId || null,
      busRouteId: this.goods?.busRouteId || null,
      goodsNumber: this.goods?.goodsNumber || '',
      senderName: this.goods?.senderName || '',
      senderPhoneNumber: this.goods?.senderPhoneNumber || '',
      customerName: this.goods?.customerName || '',
      customerPhoneNumber: this.goods?.customerPhoneNumber || '',
      goodsPriority: this.goods?.goodsPriority ?? null,
      goodsImportant: this.goods?.goodsImportant || false,
      quantity: this.goods?.quantity ?? '',
      shippingCost: this.goods?.shippingCost ?? '',
      cod: this.goods?.cod ?? '',
      goodsValue: this.goods?.goodsValue ?? '',
      weight: this.goods?.weight ?? '',
      length: this.goods?.length ?? '',
      width: this.goods?.width ?? '',
      height: this.goods?.height ?? '',
      status: this.goods?.status ?? '',
      paidBy: this.goods?.paidBy ?? '',
      originStationId: this.goods?.originStationId || '',
      destinationStationId: this.goods?.destinationStationId || '',
      currentStationId: this.goods?.currentStationId || '',
      pickupFulfillmentMode: this.goods?.pickupFulfillmentMode || this.fulfillmentMode.STATION,
      pickupAddress: this.goods?.pickupAddress || '',
      deliveryFulfillmentMode: this.goods?.deliveryFulfillmentMode || this.fulfillmentMode.STATION,
      deliveryType: this.goods?.deliveryType || DELIVERY_TYPE.STATION,
      deliveryAddress: this.goods?.deliveryAddress || '',
    };

    // Patch the form
    try {
      this.mainForm.patchValue(patch, { emitEvent: false });
      // If delivery is STATION and deliveryType is STATION, populate deliveryAddress from destinationStationId
      try {
        const deliveryFulfillmentMode = this.mainForm.get('deliveryFulfillmentMode')?.value;
        const deliveryTypeVal = this.mainForm.get('deliveryType')?.value;
        const destinationStationId = this.mainForm.get('destinationStationId')?.value;
        if (
          deliveryFulfillmentMode === this.fulfillmentMode.STATION &&
          deliveryTypeVal === DELIVERY_TYPE.STATION &&
          destinationStationId
        ) {
          const dest =
            this.dataDestinationListFilterMatchedSearch.find((d) => d.value === destinationStationId) ||
            this.destinationList.find((d) => d.value === destinationStationId);
          if (dest) {
            this.mainForm.get('deliveryAddress')?.setValue(dest.label, { emitEvent: false });
          }
        }
      } catch (e) {
        // ignore population errors
      }
    } catch (e) {
      console.warn('setDataGoodsForm: patchValue failed', e);
    }

    // Update dependent selects / models
    this.busRoute = this.busRoutes.find((br) => br._id == this.mainForm.get('busRouteId')?.value) || new BusRoute();
    this.busSchedule =
      this.busSchedules.find((bs) => bs._id == this.mainForm.get('busScheduleId')?.value) || new BusSchedule();
    this.loadPayment(this.goods._id || '');

    // Mark pristine and save baseline for change detection
    this.mainForm.markAsPristine();
    this.initialFormValue = {
      formValue: this.mainForm.getRawValue(),
      images: [...this.goodsImages],
    };
    // Ensure Angular updates the UI immediately
    try {
      this.cdr.detectChanges();
    } catch (e) {
      // ignore if change detection can't run here
    }
  }

  // Reset the form and images back to the initial state captured in `initialFormValue`.
  // This preserves `createPaymentForm` if it exists in the current form.
  resetForm() {
    if (!this.mainForm) return;
    // Default values (same defaults as used in initForm)
    const defaultValues = {
      images: [],
      name: 'Iphone 15 Pro Max',
      categories: [],
      busScheduleId: '',
      busRouteId: '',
      goodsNumber: '',

      senderName: 'Nguyen Van A',
      senderPhoneNumber: '0909090909',
      senderAddress: '',

      customerName: 'Nguyen Van B',
      customerPhoneNumber: '0909090909',
      customerAddress: '',

      quantity: '1',

      shippingCost: '',
      cod: '',

      goodsValue: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      status: 'new',
      paidBy: 'sender',
      originStationId: '',
      destinationStationId: '',
      currentStationId: '',
      pickupFulfillmentMode: this.fulfillmentMode.STATION,
      pickupAddress: '',
      deliveryFulfillmentMode: this.fulfillmentMode.STATION,
      deliveryType: DELIVERY_TYPE.STATION,
      deliveryAddress: '',
    };

    // Apply defaults: update existing controls or add them
    Object.keys(defaultValues).forEach((key) => {
      const val = (defaultValues as any)[key];
      if (this.mainForm.contains(key)) {
        try {
          // Special handling for address fields - disable if no busRouteId
          if ((key === 'senderAddress' || key === 'customerAddress') && !this.mainForm.get('busRouteId')?.value) {
            this.mainForm.get(key)!.disable({ emitEvent: false });
          } else {
            this.mainForm.get(key)!.enable({ emitEvent: false });
          }
          this.mainForm.get(key)!.setValue(val, { emitEvent: false });
          this.mainForm.get(key)!.markAsPristine();
        } catch (e) {
          // ignore
        }
      } else {
        // Handle disabled state for new controls
        if ((key === 'senderAddress' || key === 'customerAddress') && !this.mainForm.get('busRouteId')?.value) {
          this.mainForm.addControl(key, this.fb.control({ value: val, disabled: true }));
        } else {
          this.mainForm.addControl(key, this.fb.control(val));
        }
      }
    });

    this.mainForm.removeControl('createPaymentForm');

    // Reset images to default
    this.goodsImages = [];

    this.mainForm.markAsPristine();

    // Update baseline
    this.initialFormValue = {
      formValue: this.mainForm.getRawValue(),
      images: [...this.goodsImages],
    };
    // Ensure controls that depend on fulfillment mode are in sync after resetting values
    try {
      const pickupMode = this.mainForm.get('pickupFulfillmentMode')?.value;
      if (pickupMode !== undefined) {
        this.onPickupFulfillmentModeChange(pickupMode);
      }
      this.updateDeliveryAddressVisibility();
      this.updateDestinationStationValidator();
    } catch (e) {
      // ignore if handlers fail during reset
    }
  }

  async initForm() {
    const {
      images = [],
      name = 'Iphone 15 Pro Max',
      goodsNumber = '',
      senderName = 'Nguyen Van A',
      senderPhoneNumber = '0909090909',
      customerName = 'Nguyen Van B',
      customerPhoneNumber = '0909090909',
      goodsPriority = null,
      quantity = '1',
      busScheduleId = '',
      busRouteId = '',
      shippingCost = '',
      cod = '',
      goodsValue = '',
      goodsImportant = false,
      categoriesIds = [],
      weight = '',
      length = '',
      width = '',
      height = '',
      note = '',
      status = 'new',
      paidBy = 'sender',
      // New station & delivery fields
      originStationId = '',
      destinationStationId = '',
      currentStationId = '',
      deliveryFulfillmentMode = this.fulfillmentMode.STATION,
      pickupFulfillmentMode = this.fulfillmentMode.STATION,
      deliveryType = DELIVERY_TYPE.STATION,
      deliveryAddress = '',
      pickupAddress = '',
    } = this.goods || {};

    // Initialize images array from existing image
    if (images && images.length > 0) {
      this.goodsImages = [...images];
    } else {
      this.goodsImages = [];
    }

    // Lưu lại imageIds gốc
    if (this.goods && this.goods.imageIds) {
      this.existingImageIds = [...this.goods.imageIds];
    }

    this.mainForm = this.fb.group({
      images: [images, []],
      name: [name, [Validators.required]],
      categories: [categoriesIds, []],
      busScheduleId: [busScheduleId, []],
      busRouteId: [busRouteId, [Validators.required]],
      goodsNumber: [goodsNumber, []],

      senderName: [senderName, [Validators.required]],
      senderPhoneNumber: [senderPhoneNumber, [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],

      customerName: [customerName, [Validators.required]],
      customerPhoneNumber: [customerPhoneNumber, [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
      goodsPriority: [{ value: goodsPriority, disabled: true }, []],
      goodsImportant: [{ value: goodsImportant, disabled: !this.isChangeForm() }, []],

      quantity: [quantity],

      shippingCost: [shippingCost],
      cod: [cod],

      goodsValue: [goodsValue],
      weight: [weight],
      length: [length],
      width: [width],
      height: [height],

      status: [status],
      paidBy: [paidBy, [Validators.required]],

      // New station & delivery form controls
      originStationId: [originStationId, [Validators.required]],
      destinationStationId: [destinationStationId, []], // validators will be set dynamically
      currentStationId: [{ value: currentStationId, disabled: true }, []], // Always disabled, read-only // disabled if pickup is roadside

      pickupFulfillmentMode: [pickupFulfillmentMode, []], // STATION or ROADSIDE (empty)
      pickupAddress: [{ value: pickupAddress, disabled: pickupFulfillmentMode !== this.fulfillmentMode.ROADSIDE }, []],

      deliveryFulfillmentMode: [deliveryFulfillmentMode, []],

      // If initial deliveryFulfillmentMode is ROADSIDE, default deliveryType to ADDRESS
      deliveryType: [
        deliveryFulfillmentMode === this.fulfillmentMode.ROADSIDE ? DELIVERY_TYPE.ADDRESS : deliveryType,
        [],
      ], // STATION or ADDRESS - only visible when deliveryFulfillmentMode is STATION
      deliveryAddress: [
        {
          value: deliveryAddress,
          disabled: !(
            deliveryFulfillmentMode === this.fulfillmentMode.STATION && deliveryType === DELIVERY_TYPE.ADDRESS
          ),
        },
        [],
      ],
    });

    this.busSchedule =
      this.busSchedules.find((busSchedule) => busSchedule._id == this.mainForm.get('busScheduleId')?.value) ||
      new BusSchedule();
    this.busRoute =
      this.busRoutes.find((busRoute) => busRoute._id == this.mainForm.get('busRouteId')?.value) || new BusRoute();
    this.loadBusSchedules();
    this.setListDepartureAndDestination();
    this.setGoodsPaymentAmount();

    this.initFormChangeEvents();
    // Initialize deliveryAddress visibility state based on initial form values
    this.updateDeliveryAddressVisibility();

    this.initialFormValue = {
      formValue: this.mainForm.getRawValue(),
      images: [...this.goodsImages],
    };
  }

  initFormChangeEvents() {
    // pickupFulfillmentMode: Kiểm soát hiển thị currentStationId
    this.mainForm
      .get('pickupFulfillmentMode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onPickupFulfillmentModeChange(value);
      });

    // originStationId: Khi chọn trạm gửi, recalculate destination list
    this.mainForm
      .get('originStationId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onOriginStationChange(value);
      });

    // deliveryFulfillmentMode: Kiểm soát hiển thị deliveryType & deliveryAddress
    this.mainForm
      .get('deliveryFulfillmentMode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onDeliveryFulfillmentModeChange(value);
      });

    // deliveryType: Kiểm soát hiển thị deliveryAddress (chỉ khi deliveryFulfillmentMode = STATION)
    this.mainForm
      .get('deliveryType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onDeliveryTypeChange(value);
      });

    // destinationStationId: Khi chọn trạm nhận, nếu deliveryType = STATION thì auto-populate deliveryAddress
    this.mainForm
      .get('destinationStationId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onDestinationStationChange(value);
      });
  }

  get f() {
    return this.mainForm.controls;
  }

  get createPaymentForm(): FormGroup | null {
    return this.mainForm?.get('createPaymentForm') as FormGroup;
  }

  get bookingForm(): FormGroup {
    return this.mainForm;
  }

  hasFormChanged(): boolean {
    const currentFormValue = {
      formValue: this.mainForm.getRawValue(),
      images: [...this.goodsImages],
    };
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  // Handle pickupFulfillmentMode changes: enable/disable currentStationId and pickupAddress
  // - STATION: Disable pickupAddress, currentStationId always read-only
  // - ROADSIDE: Enable pickupAddress (pickupAddress required)
  private onPickupFulfillmentModeChange(value: string): void {
    const pickupAddressCtrl = this.mainForm.get('pickupAddress');
    const originStationCtrl = this.mainForm.get('originStationId');

    if (value === this.fulfillmentMode.STATION) {
      pickupAddressCtrl?.disable({ emitEvent: false });
      pickupAddressCtrl?.setValue('', { emitEvent: false });
      pickupAddressCtrl?.clearAsyncValidators();
      pickupAddressCtrl?.setValidators([]);
      pickupAddressCtrl?.updateValueAndValidity({ emitEvent: false });
      // Enable and require originStationId when pickup = STATION
      originStationCtrl?.enable({ emitEvent: false });
      originStationCtrl?.setValidators([Validators.required]);
      originStationCtrl?.updateValueAndValidity({ emitEvent: false });
    } else {
      // ROADSIDE: Enable pickupAddress (pickupAddress required)
      pickupAddressCtrl?.enable({ emitEvent: false });
      pickupAddressCtrl?.setValidators([Validators.required]);
      pickupAddressCtrl?.updateValueAndValidity({ emitEvent: false });
      // Disable and clear originStationId when pickup = ROADSIDE
      originStationCtrl?.disable({ emitEvent: false });
      originStationCtrl?.setValue('', { emitEvent: false });
      originStationCtrl?.clearAsyncValidators();
      originStationCtrl?.setValidators([]);
      originStationCtrl?.updateValueAndValidity({ emitEvent: false });
    }
  }

  // Handle originStationId changes: recalculate destination list based on selected origin station
  private onOriginStationChange(originStationId: string): void {
    // Set currentStationId = originStationId
    this.mainForm.get('currentStationId')?.setValue(originStationId, { emitEvent: false });

    if (!originStationId) {
      // If origin station is cleared, show all destinations
      this.dataDestinationListFilterMatchedSearch = this.destinationList;
      return;
    }

    // Find the selected origin station in the departure list
    const selectedOriginStation = this.departureList.find((d) => d.value === originStationId);

    if (!selectedOriginStation || selectedOriginStation.breakPointIndex === undefined) {
      this.dataDestinationListFilterMatchedSearch = this.destinationList;
      return;
    }

    // Filter destinations to show only stations AFTER the selected origin station
    this.dataDestinationListFilterMatchedSearch = this.destinationList.filter((dest: any) => {
      return dest.breakPointIndex !== undefined && dest.breakPointIndex > selectedOriginStation.breakPointIndex!;
    });
  }

  // Handle deliveryFulfillmentMode changes: enable/disable deliveryType and set defaults
  // - STATION: Enable deliveryType and set default to STATION if empty, destinationStationId required
  // - ROADSIDE: Disable deliveryType and clear value, destinationStationId not required
  private onDeliveryFulfillmentModeChange(value: string): void {
    const deliveryTypeCtrl = this.mainForm.get('deliveryType');
    const destinationStationCtrl = this.mainForm.get('destinationStationId');

    if (value === this.fulfillmentMode.STATION) {
      deliveryTypeCtrl?.enable({ emitEvent: false });
      // Set default value to STATION if empty
      if (!deliveryTypeCtrl?.value) {
        deliveryTypeCtrl?.setValue(DELIVERY_TYPE.STATION, { emitEvent: false });
      }
      // destinationStationId required when delivery = STATION
      deliveryTypeCtrl?.setValidators([Validators.required]);
      deliveryTypeCtrl?.updateValueAndValidity({ emitEvent: false });
      destinationStationCtrl?.setValidators([Validators.required]);
      destinationStationCtrl?.updateValueAndValidity({ emitEvent: false });
      // If deliveryType is STATION and a destination is selected, set deliveryAddress to station name
      const deliveryTypeVal = deliveryTypeCtrl?.value;
      const destId = destinationStationCtrl?.value;
      if (deliveryTypeVal === DELIVERY_TYPE.STATION && destId) {
        const dest =
          this.dataDestinationListFilterMatchedSearch.find((d) => d.value === destId) ||
          this.destinationList.find((d) => d.value === destId);
        if (dest) {
          this.mainForm.get('deliveryAddress')?.setValue(dest.label, { emitEvent: false });
        }
      }
      this.updateDeliveryAddressVisibility();
    } else {
      // ROADSIDE: Disable deliveryType
      deliveryTypeCtrl?.disable({ emitEvent: false });
      // Default deliveryType to ADDRESS for ROADSIDE fulfillment
      deliveryTypeCtrl?.setValue(DELIVERY_TYPE.ADDRESS, { emitEvent: false });
      deliveryTypeCtrl?.clearAsyncValidators();
      deliveryTypeCtrl?.setValidators([]);
      deliveryTypeCtrl?.updateValueAndValidity({ emitEvent: false });
      // destinationStationId not required when delivery = ROADSIDE
      destinationStationCtrl?.clearAsyncValidators();
      destinationStationCtrl?.setValidators([]);
      destinationStationCtrl?.updateValueAndValidity({ emitEvent: false });
      this.updateDeliveryAddressVisibility();
    }
  }

  // Handle deliveryType changes: update deliveryAddress visibility and validators
  // - Only applicable when deliveryFulfillmentMode is STATION
  private onDeliveryTypeChange(value: string): void {
    const deliveryFulfillmentMode = this.mainForm.get('deliveryFulfillmentMode')?.value;
    if (deliveryFulfillmentMode === this.fulfillmentMode.STATION) {
      this.updateDeliveryAddressVisibility();

      // If deliveryType = STATION (Nhận tại trạm), auto-populate deliveryAddress from destination station name
      if (value === DELIVERY_TYPE.STATION) {
        const destinationStationId = this.mainForm.get('destinationStationId')?.value;
        if (destinationStationId) {
          const destinationStation = this.dataDestinationListFilterMatchedSearch.find(
            (d) => d.value === destinationStationId,
          );
          if (destinationStation) {
            this.mainForm.get('deliveryAddress')?.setValue(destinationStation.label, { emitEvent: false });
          }
        }
      }
    }
  }

  // Handle destinationStationId changes: if deliveryType = STATION, auto-populate deliveryAddress
  private onDestinationStationChange(destinationStationId: string): void {
    const deliveryType = this.mainForm.get('deliveryType')?.value;
    const deliveryFulfillmentMode = this.mainForm.get('deliveryFulfillmentMode')?.value;

    // Only auto-populate deliveryAddress if:
    // - deliveryFulfillmentMode = STATION AND
    // - deliveryType = STATION (Nhận tại trạm)
    if (deliveryFulfillmentMode === this.fulfillmentMode.STATION && deliveryType === DELIVERY_TYPE.STATION) {
      if (!destinationStationId) {
        // Clear deliveryAddress if destination station is cleared
        this.mainForm.get('deliveryAddress')?.setValue('', { emitEvent: false });
        // Disable goodsPriority when destination cleared
        this.mainForm.get('goodsPriority')?.disable({ emitEvent: false });
        this.mainForm.get('goodsPriority')?.setValue(null, { emitEvent: false });
        return;
      }

      // Find the selected destination station and set its name as deliveryAddress
      const destinationStation = this.dataDestinationListFilterMatchedSearch.find(
        (d) => d.value === destinationStationId,
      );
      if (destinationStation) {
        this.mainForm.get('deliveryAddress')?.setValue(destinationStation.label, { emitEvent: false });
      }
    }

    // Whenever destinationStationId is set (including when set programmatically by chooseBusRoute),
    // compute goodsPriority index and enable the control so priority is available.
    try {
      if (destinationStationId) {
        const idx = this.dataGoodsPriority.findIndex((d) => d.value === destinationStationId);
        if (idx >= 0) {
          this.mainForm.get('goodsPriority')?.enable({ emitEvent: false });
          this.mainForm.get('goodsPriority')?.setValue(idx + 1, { emitEvent: false });
        } else {
          this.mainForm.get('goodsPriority')?.disable({ emitEvent: false });
          this.mainForm.get('goodsPriority')?.setValue(null, { emitEvent: false });
        }

        // Update departure list to show stations before selected destination
        const selectedDestination = this.destinationList.find((d) => d.value === destinationStationId);
        if (selectedDestination && selectedDestination.breakPointIndex !== undefined) {
          this.dataDepartureListFilterMatchedSearch = this.departureList.filter((dep: any) => {
            return dep.breakPointIndex !== undefined && dep.breakPointIndex < selectedDestination.breakPointIndex!;
          });
        }
      }
    } catch (e) {
      // ignore errors
    }
  }

  // Helper method to update deliveryAddress visibility based on deliveryFulfillmentMode and deliveryType
  // deliveryAddress hiển thị khi:
  // 1. deliveryFulfillmentMode = STATION AND deliveryType = ADDRESS (giao tận tay tại station)
  // 2. OR deliveryFulfillmentMode = ROADSIDE (giao dọc đường - cần địa chỉ cụ thể)
  // deliveryAddress phải required khi:
  // - deliveryFulfillmentMode = ROADSIDE HOẶC
  // - deliveryFulfillmentMode = STATION AND deliveryType = ADDRESS
  private updateDeliveryAddressVisibility() {
    const deliveryAddressCtrl = this.mainForm.get('deliveryAddress');
    const deliveryFulfillmentMode = this.mainForm.get('deliveryFulfillmentMode')?.value;
    const deliveryType = this.mainForm.get('deliveryType')?.value;

    // Enable deliveryAddress nếu:
    // - Giao dọc đường (ROADSIDE) HOẶC
    // - Drop tại station (STATION) + giao tận nơi (ADDRESS)
    if (
      deliveryFulfillmentMode === this.fulfillmentMode.ROADSIDE ||
      (deliveryFulfillmentMode === this.fulfillmentMode.STATION && deliveryType === DELIVERY_TYPE.ADDRESS)
    ) {
      deliveryAddressCtrl?.enable({ emitEvent: false });
      // Set required validator khi:
      // - Giao dọc đường (ROADSIDE) HOẶC
      // - Giao tại station + giao tận nơi (ADDRESS)
      deliveryAddressCtrl?.setValidators([Validators.required]);
      deliveryAddressCtrl?.updateValueAndValidity({ emitEvent: false });
    } else {
      deliveryAddressCtrl?.disable({ emitEvent: false });
      deliveryAddressCtrl?.setValue('', { emitEvent: false });
      deliveryAddressCtrl?.clearAsyncValidators();
      deliveryAddressCtrl?.setValidators([]);
      deliveryAddressCtrl?.updateValueAndValidity({ emitEvent: false });
    }
  }

  // Helper method to update destinationStationId validator based on deliveryFulfillmentMode
  // - Nếu deliveryFulfillmentMode = STATION: yêu cầu phải chọn destinationStationId
  // - Nếu deliveryFulfillmentMode = ROADSIDE: không yêu cầu destinationStationId (giao dọc đường)
  private updateDestinationStationValidator() {
    const destinationStationCtrl = this.mainForm.get('destinationStationId');
    const deliveryFulfillmentMode = this.mainForm.get('deliveryFulfillmentMode')?.value;

    if (deliveryFulfillmentMode === this.fulfillmentMode.STATION) {
      destinationStationCtrl?.setValidators([Validators.required]);
    } else {
      destinationStationCtrl?.clearAsyncValidators();
      destinationStationCtrl?.setValidators([]);
    }
    destinationStationCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  optionalValidator(validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return null; // Không validate nếu không có giá trị
      }
      return validator(control); // Thực hiện validate khi có giá trị
    };
  }

  get goodsCategory() {
    return this.goodsCategories.find((goodsCategory) =>
      this.mainForm.get('categories')?.value.includes(goodsCategory._id),
    );
  }

  chooseBusRoute(busRouteId: string) {
    this.busRoute = this.busRoutes.find((busRoute) => busRoute._id == busRouteId) || new BusRoute();
    this.mainForm.patchValue({ busScheduleId: null }); // Reset busScheduleId when busRoute changes
    this.mainForm.get('senderAddress')?.enable();
    this.mainForm.get('customerAddress')?.enable();
    this.mainForm.get('customerAddress')?.enable();
    this.loadBusSchedules();
    this.setListDepartureAndDestination();
    this.mainForm.patchValue({ originStationId: this.departureList[0]?.value || '' });
    this.mainForm.patchValue({ destinationStationId: this.destinationList.at(-1)?.value || '' });
  }

  chooseBusSchedule(busScheduleId: string) {
    this.busSchedule = this.busSchedules.find((busSchedule) => busSchedule._id == busScheduleId) || new BusSchedule();
  }

  async backPage() {
    if (this.hasFormChanged()) {
      this.utilsModal
        .openModalConfirm('Lưu ý', 'Bạn có thay đổi chưa lưu, bạn có chắc muốn đóng không?', 'warning')
        .subscribe((result) => {
          if (result) {
            this.location.back();
            return;
          }
        });
    } else {
      this.location.back();
    }
  }

  checkDisableDateTime = (current: Date): boolean => {
    // Lấy ngày hiện tại
    const today = new Date();
    // Lấy năm hiện tại trừ đi 12 để xác định ngưỡng năm
    const minYear = today.getFullYear() - 12;
    // Kiểm tra nếu ngày chọn lớn hơn năm tối thiểu
    return current.getFullYear() > minYear;
  };

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const MAX_IMAGES = 5;
    const availableSlots = MAX_IMAGES - this.goodsImages.length;

    // Check if already at max capacity
    if (availableSlots <= 0) {
      toast.warning(`Đã đủ ${MAX_IMAGES} ảnh. Vui lòng xóa ảnh cũ trước khi thêm mới.`);
      event.target.value = '';
      return;
    }

    let addedCount = 0;
    let duplicateCount = 0;
    let exceededCount = 0;

    // Add selected files with validation
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if we still have available slots
      if (addedCount >= availableSlots) {
        exceededCount = files.length - i;
        break;
      }

      // Check for duplicate files (by name and size)
      const isDuplicate = this.goodsImageFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size,
      );

      if (isDuplicate) {
        duplicateCount++;
        continue;
      }

      this.goodsImageFiles.push(file);
      this.readAndSetImage(file);
      addedCount++;
    }

    if (exceededCount > 0) {
      toast.warning(`${exceededCount} ảnh vượt quá giới hạn ${MAX_IMAGES} ảnh`);
    }

    // Clear input để có thể chọn lại cùng file
    event.target.value = '';
  }

  private readAndSetImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const imageUrl = URL.createObjectURL(blob);
      this.goodsImages.push(imageUrl);
      this.blobUrls.push(imageUrl); // Track for cleanup
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeImage(index: number) {
    const numExistingImages = this.existingImageIds.length;

    // Nếu xóa existing image (index < số lượng existing)
    if (index < numExistingImages) {
      this.existingImageIds.splice(index, 1);
    } else {
      // Xóa new image file
      const fileIndex = index - numExistingImages;
      this.goodsImageFiles.splice(fileIndex, 1);
    }

    // Revoke blob URL if it exists
    const url = this.goodsImages[index];
    if (url && this.blobUrls.includes(url)) {
      URL.revokeObjectURL(url);
      this.blobUrls = this.blobUrls.filter((u) => u !== url);
    }

    // Xóa khỏi goodsImages
    this.goodsImages.splice(index, 1);

    toast.success('Đã xóa ảnh');
  }

  removeFileImage() {
    // Release all blob URLs
    this.blobUrls.forEach((url) => URL.revokeObjectURL(url));
    this.blobUrls = [];

    this.goodsImages = [];
    this.goodsImageFiles = [];
    this.existingImageIds = [];
    this.mainForm.patchValue({ images: [] });
  }

  openFilesCenterDialog() {}

  setDefaultValues2Create(data: any) {
    data.shippingCost = data.shippingCost ? data.shippingCost : 0;
    data.cod = data.cod ? data.cod : 0;
    data.goodsValue = data.goodsValue ? data.goodsValue : 0;
    data.weight = data.weight ? data.weight : 0;
    data.length = data.length ? data.length : 0;
    data.width = data.width ? data.width : 0;
    data.height = data.height ? data.height : 0;
    data.senderAddress = data.senderAddress
      ? data.senderAddress
      : this.busRoute?.breakPoints?.[0]?.busStation?.name || 'Gửi tại trạm';
    data.customerAddress = data.customerAddress
      ? data.customerAddress
      : this.busRoute?.breakPoints?.at(-1)?.busStation?.name || 'Nhận tại trạm';
  }

  /**
   * Xử lý data fulfillment mode trước khi submit
   * - pickupFulfillmentMode = STATION: set pickupAddress = tên station đầu tiên, originStationId = Id station đầu tiên
   * - deliveryFulfillmentMode = ROADSIDE: xóa destinationStationId
   */
  processFulfillmentModeData(data: any) {
    // Xử lý pickup fulfillment mode
    if (data.pickupFulfillmentMode === this.fulfillmentMode.STATION) {
      const firstDeparture = this.departureList && this.departureList.length > 0 ? this.departureList[0] : null;
      if (firstDeparture) {
        data.pickupAddress = firstDeparture.label; // Tên station
        data.originStationId = firstDeparture.value; // Id station
      }
    } else if (data.pickupFulfillmentMode === this.fulfillmentMode.ROADSIDE) {
      // Clear originStationId when pickup = ROADSIDE
      data.originStationId = '';
      data.currentStationId = this.dataDepartureListFilterMatchedSearch[0]?.value || '';
    }

    // Xử lý delivery fulfillment mode
    if (data.deliveryFulfillmentMode === this.fulfillmentMode.ROADSIDE) {
      data.destinationStationId = '';
      // Ensure deliveryType defaults to ADDRESS for roadside deliveries
      data.deliveryType = DELIVERY_TYPE.ADDRESS;
    }

    return data;
  }

  async onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      toast.error('Vui lòng điền đầy đủ thông tin theo yêu cầu');
      return;
    }

    if (!this.hasFormChanged()) {
      return;
    }

    const data = this.mainForm.getRawValue();

    this.setDefaultValues2Create(data);
    this.processFulfillmentModeData(data);

    const Goods2Create: Goods2Create = {
      ...data,
      categoriesIds: data.categories,
    };

    let dataTransfer = new DataTransfer();
    // Add all image files to DataTransfer
    for (const file of this.goodsImageFiles) {
      dataTransfer.items.add(file);
    }
    const files: FileList = dataTransfer.files;

    let request = [];
    let actionName = 'create';
    if (this.mode == 'update') {
      const Goods2Update = {
        ...Goods2Create,
        _id: this.goods._id, // Thêm thuộc tính _id
      };
      actionName = 'update';
      request.push(this.updateGoods(files, Goods2Update));
    } else {
      request.push(this.createGoods(files, Goods2Create));
    }

    try {
      const res: any = await firstValueFrom(combineLatest(request));
      if (!res) {
        return;
      }
      this.goods = res[0];
      this.utils.updateState({ goods: res[0] });

      this.goodsImages = this.goods.images && this.goods.images.length > 0 ? [...this.goods.images] : [];

      // Clear the image files after successful upload
      this.goodsImageFiles = [];

      // Update baseline BEFORE showing success message
      this.initialFormValue = {
        formValue: this.mainForm.getRawValue(),
        images: [...this.goodsImages],
      };

      if (actionName == 'update') {
        toast.success('Goods update successfully');
        return;
      } else {
        this.initListenEvent();
        this.mode = 'update';
        toast.success('Goods added successfully');
        this.loadPayment(this.goods._id || '');
      }
    } catch (error: any) {
      this.utils.handleRequestError(error);
      throw error;
    }
  }

  // Kiểm tra xem form có phải là form thay đổi hay không
  // Trả về true khi trạng thái goods là `new` hoặc `pending`
  isChangeForm(): boolean {
    const status = this.goods?.status || this.goodsStatus.NEW;
    return status === this.goodsStatus.NEW || status === this.goodsStatus.PENDING;
  }

  // Lấy giá trị form hoặc fallback vào model `goods`
  getFormValue(controlName: string): any {
    try {
      const v = this.mainForm?.get(controlName)?.value;
      if (v !== undefined && v !== null && v !== '') return v;
    } catch (e) {
      // ignore
    }
    return (this.goods as any)?.[controlName];
  }

  // Trả về tên các phân loại được chọn (chuỗi nối)
  getCategoryNames(): string {
    const ids = this.getFormValue('categories');
    if (!ids || !Array.isArray(ids)) return '';
    return this.goodsCategories
      .filter((c) => ids.includes(c._id))
      .map((c) => c.name)
      .join(', ');
  }

  // Trả về label cho paidBy
  getPaidByLabel(): string {
    const val = this.getFormValue('paidBy');
    const found = this.paidByList.find((p) => p.value === val);
    return found ? found.label : val || '';
  }

  // Format giá tiền hoặc thêm đơn vị
  formatWithUnit(controlName: string, unit?: string) {
    const val = this.getFormValue(controlName);
    if (val === undefined || val === null || val === '') return '';
    if (unit === '₫') return this.utils.formatPriceToVND(Number(val));
    return `${val} ${unit || ''}`.trim();
  }

  updateGoods(files: FileList, Goods2Update: Goods2Update) {
    return this.goodsService.processUpdateGoods(files, Goods2Update);
  }

  createGoods(files: FileList, Goods2Create: Goods2Create) {
    return this.goodsService.processCreateGoods(files, Goods2Create);
  }

  formatTime(date: Date | undefined) {
    if (!date) return;
    date = new Date(date);
    return this.utils.formatTime(date);
  }

  formatDate(date: Date | undefined) {
    if (!date) return;
    return this.utils.formatDate(date);
  }

  getBusRouteName(): string {
    const id = this.getFormValue('busRouteId');
    if (!id) return this.busRoute?.name || '';
    const found = this.busRoutes.find((b) => b._id === id);
    return found ? found.name : this.busRoute?.name || '';
  }

  getBusScheduleLabel(): string {
    const id = this.getFormValue('busScheduleId');
    let bs = this.busSchedules.find((b) => b._id === id) || this.busSchedule;
    if (!bs || !bs._id) return '';
    const busName = bs.bus?.name || 'Chưa có xe';
    const time = bs.startDate ? this.formatTime(bs.startDate) : '';
    const date = bs.startDate ? this.formatDate(bs.startDate) : '';
    return `${busName}${time || date ? ' • ' : ''}${time}${time && date ? ' - ' : ''}${date}`.trim();
  }

  getStationNameById(stationId: string | undefined): string {
    if (!stationId) return '-';
    const breakPoints = this.busRoute?.breakPoints || [];
    if (this.busStationsCache.has(stationId)) {
      return this.busStationsCache.get(stationId)?.name || 'N/A';
    }
    const station = breakPoints.find((bp: any) => bp.busStation?._id === stationId);
    this.busStationsCache.set(stationId, station?.busStation || new BusStation());
    return station?.busStation?.name || 'N/A';
  }

  clearFormValue(controlName: string) {
    const control = this.mainForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  // Load payment methods (cached)
  async loadPaymentMethods() {
    if (this.paymentMethodsLoaded) return;
    try {
      const res = await firstValueFrom(this.paymentMethodService.findPaymentMethods());
      this.paymentMethods = res || [];
      this.paymentMethodsLoaded = true;
      this.paymentMethods.forEach((m) => this.paymentMethodsCache.set(m._id, m));
    } catch (error) {
      console.error('loadPaymentMethods error', error);
    }
  }

  async loadPayment(goodsId: string) {
    await this.loadPaymentMethods();

    this.paymentService
      .findAllByReferrentId(goodsId, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (payments) => {
          this.payments = payments || [];
          await this.setGoodsPaymentAmount();
        },
        error: (error) => {
          console.error('Error loading payments:', error);
        },
      });
  }

  async setGoodsPaymentAmount() {
    const paymentAmount = await this.calcPaymentAmount();
    const paymentPaidAmount = await this.calcPaymentPaidAmount();

    if (this.goods) {
      this.goods.paymentAmount = paymentAmount;
      this.goods.paymentPaidAmount = paymentPaidAmount;
    }
  }

  async calcPaymentAmount() {
    let paymentAmount = (this.goods?.shippingCost || 0) + (this.goods?.cod || 0);

    if (!this.payments || !Array.isArray(this.payments) || this.payments.length === 0) {
      return paymentAmount;
    }

    await Promise.all(
      this.payments.map(async (payment: Payment) => {
        if (payment.status == 'completed') {
          paymentAmount -= payment.chargedAmount;
        }
      }),
    );
    return paymentAmount;
  }

  async calcPaymentPaidAmount() {
    let paymentPaidAmount = 0;

    if (!this.payments || !Array.isArray(this.payments) || this.payments.length === 0) {
      return paymentPaidAmount;
    }

    await Promise.all(
      this.payments.map(async (payment: Payment) => {
        paymentPaidAmount += payment.chargedAmount;
      }),
    );
    return paymentPaidAmount;
  }

  // Tổng số tiền đã hoàn (tính từ các payment có chargedAmount < 0)
  getRefundedAmount(): number {
    if (!this.payments || !Array.isArray(this.payments) || this.payments.length === 0) return 0;
    return this.payments.reduce(
      (sum: number, p: Payment) => sum + (p.status === GOODS_PAYMENT_STATUS.REFUNDED ? Math.abs(p.chargedAmount) : 0),
      0,
    );
  }

  // Kiểm tra có được phép tạo thanh toán mới hay không
  canCreatePayment(): boolean {
    // Guard: no goods loaded
    if (!this.goods) return false;

    // Total amount that can be collected for this goods (shipping + COD)
    const totalDue = (this.goods.shippingCost || 0) + (this.goods.cod || 0);

    // If fully refunded or nothing to collect -> cannot create payment
    if (this.goods.paymentStatus === GOODS_PAYMENT_STATUS.REFUNDED) return false;
    if (totalDue === this.goods.paymentPaidAmount) return false;

    return true;
  }

  async toggleCreatePaymentForm($event?: any) {
    $event?.stopPropagation();

    await this.loadPaymentMethods();

    const currentIsCreatePaymentForm = this.isCreatePayment;

    if (currentIsCreatePaymentForm) {
      if (this.mainForm) {
        this.mainForm.removeControl('createPaymentForm', { emitEvent: false });
        this.initialFormValue = {
          formValue: this.mainForm.getRawValue(),
          images: [...this.goodsImages],
        };
      }
    } else {
      if (!this.mainForm) {
        return;
      }

      if (this.hasFormChanged()) {
        if (!this.mainForm.valid) {
          this.utils.markFormGroupTouched(this.mainForm);
          toast.error('Vui lòng điền đầy đủ thông tin theo yêu cầu');
          return;
        }

        this.utilsModal
          .openModalConfirm('Lưu ý', 'Bạn có thay đổi chưa lưu, bạn có chắc muốn đóng không?', 'warning')
          .subscribe(async (result) => {
            if (result) {
              await this.onSubmit();
              return;
            }
          });
      }

      await this.setGoodsPaymentAmount();

      // // Nếu không được phép tạo thanh toán mới thì báo lỗi và bỏ qua
      // if (!this.isRefundPayment()) {
      //   toast.error("Không thể tạo thanh toán mới: số tiền hoàn trả đã bằng COD hoặc hàng đã được thanh toán");
      //   return;
      // }

      const paymentAmount = this.goods?.paymentAmount || 0;
      const defaultPaymentMethod = this.getDefaultPaymentMethod();

      // Tính tổng đã hoàn và phần còn lại được hoàn dựa trên COD
      const refundedAmount = this.getRefundedAmount();
      const refundRemaining = Math.max(0, (this.goods?.cod || 0) - refundedAmount);

      const isRefund = this.isRefundPayment();
      const maxAmount = isRefund ? refundRemaining : paymentAmount;
      const minAmount = isRefund ? refundRemaining : 1;

      const createPaymentForm = this.fb.group({
        paymentMethod: [defaultPaymentMethod ? defaultPaymentMethod : null],
        maxPaymentAmount: [maxAmount],
        paymentAmount: [maxAmount, [Validators.required, Validators.min(minAmount), Validators.max(maxAmount)]],
      });

      this.mainForm.addControl('createPaymentForm', createPaymentForm, { emitEvent: false });
    }

    this.isCreatePayment = !this.isCreatePayment;
  }

  getDefaultPaymentMethod() {
    return this.paymentMethods.find((method: any) => method.type === 'cash');
  }

  getPaymentMethod(id: string) {
    if (this.paymentMethodsCache.has(id)) {
      return this.paymentMethodsCache.get(id);
    }
    const method = this.paymentMethods.find((method: PaymentMethod) => method._id === id);
    if (method) {
      this.paymentMethodsCache.set(id, method);
    }
    return method;
  }

  processPayment() {
    const createPaymentForm = this.createPaymentForm;

    if (!createPaymentForm || !createPaymentForm.valid) {
      if (createPaymentForm) {
        this.utils.markFormGroupTouched(createPaymentForm);
      }
      return;
    }

    let { paymentMethod, paymentAmount } = createPaymentForm.getRawValue() as {
      paymentMethod: PaymentMethod;
      paymentAmount: number;
    };

    if (!paymentMethod || !paymentAmount) {
      return;
    }

    if (this.isRefundPayment()) {
      paymentAmount = -paymentAmount;
    }

    const requestPaymentDto: RequestPaymentDto = {
      referrentGroupNumber: this.goods.goodsNumber,
      totalPrice: paymentAmount,
      transactionId: paymentMethod._id,
      paymentMethodId: paymentMethod._id,
    };

    try {
      this.paymentService.paymentGoods(requestPaymentDto).subscribe(
        (payment2Result: Payment[]) => {
          if (!payment2Result || payment2Result.length === 0) {
            toast.error('Thanh toán không thành công');
            return;
          }

          toast.success('Thanh toán thành công');
          this.toggleCreatePaymentForm();

          this.loadPayment(this.goods._id);
        },
        (error) => {
          toast.error('Thanh toán không thành công');
        },
      );
    } catch (error: any) {
      toast.error('Thanh toán không thành công');
    }
  }

  createNewGoods() {
    this.utils.updateState({ goods: null });

    this.goods = undefined as any;
    this.mode = 'create';
    this.resetForm();
  }

  // Trạng thái cho biết đây là thao tác hoàn tiền (payment hoàn tiền)
  isRefundPayment(): boolean {
    return this.goods?.paymentStatus === GOODS_PAYMENT_STATUS.READY_REFUND;
  }

  normalizeText(text: string) {
    return text
      .normalize('NFD') // Tách ký tự và dấu thành 2 phần riêng biệt
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
      .replace(/\s+/g, '') // Loại bỏ khoảng trắng (nếu cần)
      .toLowerCase(); // Chuyển toàn bộ thành chữ thường (tuỳ chọn)
  }
}
