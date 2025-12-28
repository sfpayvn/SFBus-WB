import { Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
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
} from '@rsApp/core/constants/status.constants';
import { Payment, RequestPaymentDto } from '@rsApp/shared/models/payment.model';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { toast } from 'ngx-sonner';
import { Subscription, combineLatest, firstValueFrom } from 'rxjs';
import { Utils } from 'src/app/shared/utils/utils';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { PaymentMethod } from '../../../payment-management/modules/payment-method/model/payment-method.model';
import { PaymentMethodService } from '../../../payment-management/modules/payment-method/service/payment-method.service';
import { GoodsCategory } from '../../model/goods-category.model';
import { Goods } from '../../model/goods.model';
import { GoodsCategoriesService } from '../../service/goods-categories.servive';
import { GoodsService } from '../../service/goods.servive';
import { Goods2Create, Goods2Update } from '../../model/goods.model';

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
export class GoodsDetailComponent implements OnInit {
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

  private paymentMethodCache = new Map<string, PaymentMethod>();

  searchKeywordBusSchedule: string = '';
  isLoadedBusSchedule: boolean = false;

  private initialFormValue: any = null;

  departureList: DepartureDestination[] = [];
  destinationList: DepartureDestination[] = [];

  dataDepartureListFilterMatchedSearch: DepartureDestination[] = [];
  dataDestinationListFilterMatchedSearch: DepartureDestination[] = [];

  eventSubscription!: Subscription[]; // Subscription

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private goodsService: GoodsService,
    public utilsModal: UtilsModal,
    private busSchedulesService: BusSchedulesService,
    private goodsCategoriesService: GoodsCategoriesService,
    private busRoutesService: BusRoutesService,
    private loadingService: LoadingService,
    private paymentMethodService: PaymentMethodService,
    private cdr: ChangeDetectorRef,
  ) {
    this.eventSubscription = [];
  }

  async ngOnInit() {
    this.getQueryParams();
    this.initListenEvent();
    this.initData();
    if (this.goods) {
      this.mode = 'update';
    }
  }

  async ngDestroy() {
    this.eventSubscription.forEach((sub) => sub.unsubscribe());
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
    const _id = this.goods._id;
    const goodsChangeSubscription = this.goodsService.listenGoodsChangeOfId(_id).subscribe(async (goods) => {
      await this.processGoodsChange(goods);
      this.setDataGoodsForm();
    });
    this.eventSubscription.push(goodsChangeSubscription);
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
      if (!departureNames.has(name)) {
        departureNames.add(name);
        this.departureList.push({
          value: name,
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
      if (!destinationNames.has(name)) {
        destinationNames.add(name);
        this.destinationList.push({
          value: name,
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
    console.log(
      '🚀 ~ GoodsDetailComponent ~ setListDepartureAndDestination ~ this.dataDestinationListFilterMatchedSearch:',
      this.dataDestinationListFilterMatchedSearch,
    );
  }

  private getColor(index: number): string {
    const hue = (index * 137) % 360; // Sử dụng 137 (số vàng) để tạo sự phân bố đều màu
    const saturation = 70; // Độ bão hòa, giữ ở mức nhạt
    const lightness = 85; // Độ sáng cao để đảm bảo màu sắc dịu
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
    } else if (type === 'destination') {
      // Khi chọn destination, departure chỉ hiển thị các điểm TRƯỚC điểm destination (bỏ các điểm sau và chính nó)
      const selectedDestination = this.destinationList.find((d) => d.value === selectedValue);
      if (!selectedDestination || selectedDestination.breakPointIndex === undefined) return;

      this.dataDepartureListFilterMatchedSearch = this.departureList.filter((dep: any) => {
        return dep.breakPointIndex !== undefined && dep.breakPointIndex < selectedDestination.breakPointIndex!;
      });
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
      const updatedState = { ...history.state, goods: goods };
      window.history.replaceState(updatedState, '', window.location.href);
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
      senderAddress: this.goods?.senderAddress || '',
      customerName: this.goods?.customerName || '',
      customerPhoneNumber: this.goods?.customerPhoneNumber || '',
      customerAddress: this.goods?.customerAddress || '',
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
    };

    // Patch the form
    try {
      this.mainForm.patchValue(patch, { emitEvent: false });
    } catch (e) {
      console.warn('setDataGoodsForm: patchValue failed', e);
    }

    // Update dependent selects / models
    this.busRoute = this.busRoutes.find((br) => br._id == this.mainForm.get('busRouteId')?.value) || new BusRoute();
    this.busSchedule =
      this.busSchedules.find((bs) => bs._id == this.mainForm.get('busScheduleId')?.value) || new BusSchedule();
    this.setGoodsPaymentAmount();

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
  }

  async initForm() {
    const {
      images = [],
      name = 'Iphone 15 Pro Max',
      goodsNumber = '',
      senderName = 'Nguyen Van A',
      senderPhoneNumber = '0909090909',
      senderAddress = '',
      customerName = 'Nguyen Van B',
      customerPhoneNumber = '0909090909',
      customerAddress = '',
      quantity = '1',
      busScheduleId = '',
      busRouteId = '',
      shippingCost = '',
      cod = '',
      goodsValue = '',
      categoriesIds = [],
      weight = '',
      length = '',
      width = '',
      height = '',
      note = '',
      status = 'new',
      paidBy = 'sender',
    } = this.goods || {};

    // Initialize images array from existing image
    if (images && images.length > 0) {
      this.goodsImages = [...images];
    } else {
      this.goodsImages = [];
    }
    console.log('🚀 ~ GoodsDetailComponent ~ setDataGoodsForm ~ this.goodsImages:', this.goodsImages);

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
      senderAddress: [{ value: senderAddress, disabled: !busRouteId }, []],

      customerName: [customerName, [Validators.required]],
      customerPhoneNumber: [customerPhoneNumber, [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
      customerAddress: [{ value: customerAddress, disabled: !busRouteId }, []],
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
    });

    this.busSchedule =
      this.busSchedules.find((busSchedule) => busSchedule._id == this.mainForm.get('busScheduleId')?.value) ||
      new BusSchedule();
    this.busRoute =
      this.busRoutes.find((busRoute) => busRoute._id == this.mainForm.get('busRouteId')?.value) || new BusRoute();
    this.loadBusSchedules();
    this.setListDepartureAndDestination();
    this.setGoodsPaymentAmount();

    this.initialFormValue = {
      formValue: this.mainForm.getRawValue(),
      images: [...this.goodsImages],
    };
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
    this.loadBusSchedules();
    this.setListDepartureAndDestination();
  }

  chooseBusSchedule(busScheduleId: string) {
    this.busSchedule = this.busSchedules.find((busSchedule) => busSchedule._id == busScheduleId) || new BusSchedule();
  }

  async backPage() {
    if (this.hasFormChanged()) {
      this.utilsModal
        .openModalConfirm('Lưu ý', 'Bạn có thay đổi chưa lưu, bạn có chắc muốn đóng không?', 'warning')
        .subscribe((result: any) => {
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

    // Xóa khỏi goodsImages
    this.goodsImages.splice(index, 1);

    toast.success('Đã xóa ảnh');
  }

  removeFileImage() {
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
      : this.busRoute?.breakPoints?.[this.busRoute.breakPoints.length - 1]?.busStation?.name || 'Nhận tại trạm';
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
      const updatedState = { ...history.state, goods: res[0] };
      window.history.replaceState(updatedState, '', window.location.href);

      // Update local images and patch form with server response
      this.goodsImages = this.goods.images && this.goods.images.length > 0 ? [...this.goods.images] : [];

      // Clear the image files after successful upload
      this.goodsImageFiles = [];

      // Update baseline BEFORE showing success message
      this.initialFormValue = {
        formValue: this.mainForm.getRawValue(),
        images: [...this.goodsImages],
      };

      if (actionName == 'update') {
        this.initListenEvent();
        toast.success('Goods update successfully');
        return;
      } else {
        this.mode = 'update';
        toast.success('Goods added successfully');
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

  clearFormValue(controlName: string) {
    console.log('🚀 ~ GoodsDetailComponent ~ clearFormValue ~ controlName:', controlName);
    const control = this.mainForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
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

  getDefaultPaymentMethod() {
    return this.paymentMethods.find((method: any) => method.type === 'cash');
  }

  getPaymentMethod(id: string) {
    if (this.paymentMethodCache.has(id)) {
      return this.paymentMethodCache.get(id);
    }
    const method = this.paymentMethods.find((method: PaymentMethod) => method._id === id);
    if (method) {
      this.paymentMethodCache.set(id, method);
    }
    return method;
  }

  createNewGoods() {
    const updatedState = { ...history.state, goods: null };
    window.history.replaceState(updatedState, '', window.location.href);
    this.goods = undefined as any;
    this.mode = 'create';
    this.resetForm();
  }

  // Trạng thái cho biết đây là thao tác hoàn tiền (payment hoàn tiền)
  isRefundPayment(): boolean {
    return (
      this.goods?.paymentStatus === 'paid' &&
      (this.goods?.cod || 0) > 0 &&
      this.goods?.status === this.goodsStatus.COMPLETED
    );
  }

  normalizeText(text: string) {
    return text
      .normalize('NFD') // Tách ký tự và dấu thành 2 phần riêng biệt
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
      .replace(/\s+/g, '') // Loại bỏ khoảng trắng (nếu cần)
      .toLowerCase(); // Chuyển toàn bộ thành chữ thường (tuỳ chọn)
  }
}
