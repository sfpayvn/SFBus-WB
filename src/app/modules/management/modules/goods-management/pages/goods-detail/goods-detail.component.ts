import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Utils } from "src/app/shared/utils/utils";
import { Location } from "@angular/common";
import { toast } from "ngx-sonner";
import { UtilsModal } from "src/app/shared/utils/utils-modal";
import { async, combineLatest, tap } from "rxjs";
import { Goods, Goods2Create, Goods2Update } from "../../model/goods.model";
import { GoodsCategory } from "../../model/goods-category.model";
import { BusSchedule } from "@rsApp/modules/management/modules/bus-management/pages/bus-schedules/model/bus-schedule.model";
import { GoodsService } from "../../service/goods.servive";
import { BusSchedulesService } from "@rsApp/modules/management/modules/bus-management/pages/bus-schedules/service/bus-schedules.servive";

interface BusScheduleGroupByRoute {
  route: string;
  busSchedules: BusSchedule[];
}

@Component({
  selector: "app-goods-detail",
  templateUrl: "./goods-detail.component.html",
  styleUrl: "./goods-detail.component.scss",
  standalone: false,
})
export class GoodsDetailComponent implements OnInit {
  mainForm!: FormGroup;

  goods!: Goods;
  goodsCategories: GoodsCategory[] = [];

  busSchedules: BusSchedule[] = [];
  busSchedulesGroupByRoute: BusScheduleGroupByRoute[] = [];

  passwordConditions: { [key: string]: boolean } = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  };

  passwordVisible: boolean = false;

  goodsImageFile!: File;
  goodsImage!: string;

  defaultImage = "assets/imgs/goods-deail.png";

  mode: "create" | "update" = "create";

  goodsStatuses = [
    {
      value: "pending",
      label: "Nhập hàng",
    },
    {
      value: "completed",
      label: "Hoàn thành",
    },
    {
      value: "on_board",
      label: "Đang trên đường",
    },
    {
      value: "dropped_off",
      label: "Đã Tới",
    },
    {
      value: "cancelled",
      label: "Đã hủy",
    },
  ];

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private goodsService: GoodsService,
    private utilsModal: UtilsModal,
    private busSchedulesService: BusSchedulesService,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    this.initForm();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params["goods"]) {
      this.goods = params["goods"] ? params["goods"] : null;
      this.mode = "update";
    }
  }

  async initData() {
    // const getBusSchedules = this.busSchedulesService.findAllAvailable(); // lấy tất cả các chuyến xe có thể chọn
    const getBusSchedules = this.busSchedulesService.findAll(); // lấy data to test
    combineLatest([getBusSchedules]).subscribe({
      next: ([busSchedules]) => {
        this.busSchedules = busSchedules;
        this.busSchedulesGroupByRoute = this.groupBusSchedulesByRoute(busSchedules);
        console.log("🚀 ~ GoodsDetailComponent ~ combineLatest ~ this.busSchedulesGroupByRoute:", this.busSchedulesGroupByRoute)
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  groupBusSchedulesByRoute(busSchedules: BusSchedule[]): BusScheduleGroupByRoute[] {
    const groupedSchedules = busSchedules.reduce((acc: Record<string, BusScheduleGroupByRoute>, busSchedule: BusSchedule) => {
      const route = busSchedule.busRoute?.name ?? "Unknown Route";

      if (!acc[route]) {
        acc[route] = { route, busSchedules: [] };
      }

      acc[route].busSchedules.push(busSchedule);
      return acc;
    }, {} as Record<string, BusScheduleGroupByRoute>);

    return Object.values(groupedSchedules);
  }


  async initForm() {
    const {
      image = "",
      name = "Iphone 15 Pro Max",
      goodsNumber = "",
      customerName = "Nguyen Van A",
      customerPhoneNumber = "0909090909",
      customerAddress = "123 Doi Can, Hanoi",
      quantity = "1",
      busScheduleId = "",
      busRouteId = "",
      shoppingCost = 0,
      cost = 0,
      goodsValue = 0,
      categories = [],
      note = "",
      status = "pending",
    } = this.goods || {};
    this.goodsImage = image ? image : this.defaultImage;
    this.mainForm = this.fb.group({
      image: [image],
      name: [name, [Validators.required]],
      busScheduleId: [busScheduleId, []],
      goodsNumber: [goodsNumber, []],
      customerName: [customerName, [Validators.required]],
      customerPhoneNumber: [
        customerPhoneNumber,
        [Validators.required, Validators.pattern(/(?:\+84|0084|0)(3|5|7|8|9)[0-9]{8}/)],
      ],
      customerAddress: [customerAddress, []],
      quantity: [quantity, [Validators.required]],
      status: [status],
    });
  }

  optionalValidator(validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === "") {
        return null; // Không validate nếu không có giá trị
      }
      return validator(control); // Thực hiện validate khi có giá trị
    };
  }

  get busSchedule() {
    return this.busSchedules.find(busSchedule => busSchedule._id == this.mainForm.get("busScheduleId")?.value);
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
    this.goodsImage = "";
    this.mainForm.patchValue({ avatar: "" });
  }

  openFilesCenterDialog() { }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    const data = this.mainForm.getRawValue();

    const Goods2Create: Goods2Create = {
      ...data,
    };
    let dataTransfer = new DataTransfer();
    if (this.goodsImageFile) {
      dataTransfer.items.add(this.goodsImageFile);
    }
    const files: FileList = dataTransfer.files;

    let request = [];
    let actionName = "create";

    if (this.mode == "update") {
      const Goods2Update = {
        ...Goods2Create,
        _id: this.goods._id, // Thêm thuộc tính _id
      };
      actionName = "update";
      request.push(this.updateGoods(files, Goods2Update));
    } else {
      request.push(this.createGoods(files, Goods2Create));
    }

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == "update") {
          const updatedState = { ...history.state, Goods: JSON.stringify(res[0]) };
          window.history.replaceState(updatedState, "", window.location.href);
          toast.success("Goods update successfully");
          return;
        }
        toast.success("Goods added successfully");
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
    return this.utils.formatDateToISOString(date);
  }
}
