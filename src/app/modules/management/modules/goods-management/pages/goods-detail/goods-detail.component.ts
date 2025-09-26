import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { async, combineLatest, tap } from 'rxjs';
import { Goods, Goods2Create, Goods2Update } from '../../model/goods.model';
import { GoodsCategory } from '../../model/goods-category.model';
import { GoodsService } from '../../service/goods.servive';
import { GoodsCategoriesService } from '../../service/goods-categories.servive';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrl: './goods-detail.component.scss',
  standalone: false,
})
export class GoodsDetailComponent implements OnInit {
  @ViewChild('pdfContentInvoice', { static: false }) pdfContentInvoice!: ElementRef;
  @ViewChild('pdfContentShippingLabel', { static: false }) pdfContentShippingLabel!: ElementRef;

  mainForm!: FormGroup;

  @Input() goods!: Goods;
  @Input() isDialog: boolean = false;

  goodsCategories: GoodsCategory[] = [];

  busSchedules: BusSchedule[] = [];
  busSchedulesFiltered: BusSchedule[] = [];

  busSchedule: BusSchedule = new BusSchedule();
  busRoute: BusRoute = new BusRoute();

  busRoutes: BusRoute[] = [];

  goodsImageFile!: File;
  goodsImage!: string;

  defaultImage = 'assets/images/goods-deail.png';

  mode: 'create' | 'update' = 'create';

  goodsStatuses = [
    {
      value: 'pending',
      label: 'Nhập hàng',
    },
    {
      value: 'completed',
      label: 'Hoàn thành',
    },
    {
      value: 'on_board',
      label: 'Đang trên đường',
    },
    {
      value: 'dropped_off',
      label: 'Đã Tới',
    },
    {
      value: 'cancelled',
      label: 'Đã hủy',
    },
  ];

  paidByList = [
    { value: 'sender', label: 'Người gửi' },
    { value: 'customer', label: 'Người nhận' },
  ];

  searchKeywordBusSchedule: string = '';

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private goodsService: GoodsService,
    private utilsModal: UtilsModal,
    private busSchedulesService: BusSchedulesService,
    private goodsCategoriesService: GoodsCategoriesService,
    private busRoutesService: BusRoutesService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    if (this.goods) {
      this.mode = 'update';
    }
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['goods']) {
      this.goods = params['goods'] ? params['goods'] : null;
    }
  }

  async initData() {
    // const getBusSchedules = this.busSchedulesService.findAllAvailable(); // lấy tất cả các chuyến xe có thể chọn
    const getBusSchedules = this.busSchedulesService.findAll(); // lấy data to test
    const getGoodsCategories = this.goodsCategoriesService.findAll();
    const getBusRoutes = this.busRoutesService.findAll();
    combineLatest([getBusSchedules, getGoodsCategories, getBusRoutes]).subscribe({
      next: ([busSchedules, goodsCategories, busRoutes]) => {
        this.busSchedules = busSchedules;
        this.goodsCategories = goodsCategories;
        this.busRoutes = busRoutes;
        this.initForm();
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  onSearch(keyword: string) {
    this.searchKeywordBusSchedule = keyword;
    this.filterBusSchedules();
  }

  filterBusSchedules() {
    const { busRouteId } = this.mainForm.value;
    this.busSchedulesFiltered = [...this.busSchedules];

    // Bắt đầu từ toàn bộ danh sách
    if (busRouteId) {
      this.busSchedulesFiltered = this.busSchedules.filter((s) => s.busRouteId === busRouteId);
    }

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

  async initForm() {
    const {
      image = '',
      name = 'Iphone 15 Pro Max',
      goodsNumber = '',
      senderName = 'Nguyen Van A',
      senderPhoneNumber = '0909090909',
      senderAddress = '123 Doi Can, Hanoi',
      customerName = 'Nguyen Van B',
      customerPhoneNumber = '0909090909',
      customerAddress = '456 Nguyen Trai, Hanoi',
      quantity = '1',
      busScheduleId = '',
      busRouteId = '',
      shippingCost = '',
      cod = '',
      goodsValue = '',
      categories = [],
      weight = '',
      length = '',
      width = '',
      height = '',
      note = '',
      status = 'pending',
      paidBy = 'sender',
    } = this.goods || {};

    this.goodsImage = image ? image : this.defaultImage;
    this.mainForm = this.fb.group({
      image: [image],
      name: [name, [Validators.required]],
      categories: [categories, []],
      busScheduleId: [busScheduleId, []],
      busRouteId: [busRouteId, [Validators.required]],
      goodsNumber: [goodsNumber, []],

      senderName: [senderName, [Validators.required]],
      senderPhoneNumber: [
        senderPhoneNumber,
        [Validators.required, Validators.pattern(/(?:\+84|0084|0)(3|5|7|8|9)[0-9]{8}/)],
      ],
      senderAddress: [senderAddress, []],

      customerName: [customerName, [Validators.required]],
      customerPhoneNumber: [
        customerPhoneNumber,
        [Validators.required, Validators.pattern(/(?:\+84|0084|0)(3|5|7|8|9)[0-9]{8}/)],
      ],
      customerAddress: [customerAddress, []],

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

    this.filterBusSchedules();
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
    this.filterBusSchedules();
  }

  chooseBusSchedule(busScheduleId: string) {
    this.busSchedule = this.busSchedules.find((busSchedule) => busSchedule._id == busScheduleId) || new BusSchedule();
  }

  backPage() {
    this.location.back();
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
    const file = files[0];
    this.goodsImageFile = file;

    if (file) {
      this.readAndSetImage(file);
    }
  }

  private readAndSetImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      this.goodsImage = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.goodsImage = '';
    this.mainForm.patchValue({ avatar: '' });
  }

  openFilesCenterDialog() {}

  setDefaultValues2Create(data: any) {
    data.shippingCost = 0;
    data.cod = 0;
    data.goodsValue = 0;
    data.weight = 0;
    data.length = 0;
    data.width = 0;
    data.height = 0;
    data.address = 'Nhận tại trạm';
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    const data = this.mainForm.getRawValue();

    this.setDefaultValues2Create(data);

    const Goods2Create: Goods2Create = {
      ...data,
    };
    let dataTransfer = new DataTransfer();
    if (this.goodsImageFile) {
      dataTransfer.items.add(this.goodsImageFile);
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

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == 'update') {
          const updatedState = { ...history.state, goods: res[0] };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Goods update successfully');
          return;
        }
        toast.success('Goods added successfully');
        this.backPage();
      },
      error: (error: any) => this.utils.handleRequestError(error), // Xử lý lỗi
    });
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

  clearFormValue(controlName: string) {
    const control = this.mainForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }
}
