
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { combineLatest } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { BusStationsService } from '../../../bus-stations/service/bus-stations.servive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BusRoute } from '../../../bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-routes/service/bus-routes.servive';
import { Bus } from '../../../buses/model/bus.model';
import { BusesService } from '../../../buses/service/buses.servive';
import { BusServicesService } from '../../../bus-services/service/bus-services.servive';
import { BusTypesService } from '../../../bus-types/service/bus-types.servive';
import { BusService } from '../../../bus-services/model/bus-service.model';
import { BusType } from '../../../bus-types/model/bus-type.model';
import { BusSchedulesService } from '../../service/bus-schedules.servive';
import { BusRouteScheduleBreakPoints, BusSchedule, BusSchedule2Create, BusSchedule2Update } from '../../model/bus-schedule.model';
import { BusScheduleTemplatesService } from '../../../bus-schedule-templates/service/bus-schedule-templates.servive';
import { BusScheduleTemplate, BusScheduleTemplateRoute } from '../../../bus-schedule-templates/model/bus-schedule-template.model';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';
import { BusTemplate } from '../../../bus-templates/model/bus-template.model';
import { BusTemplatesService } from '../../../bus-templates/service/bus-templates.servive';
import { UsersService } from '../../../user/service/user.servive';
import { Driver, UserDriver } from '../../../user/model/driver.model';
import { DriversService } from '../../../user/service/driver.servive';
import { BusLayoutTemplate } from '../../../bus-layout-templates/model/bus-layout-templates.model';
import { SeatType } from '../../../seat-types/model/seat-type.model';
import { BusLayoutTemplatesService } from '../../../bus-layout-templates/service/bus-layout-templates.servive';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import { Router } from '@angular/router';

interface BusTemplateWithLayoutsMatrix extends BusLayoutTemplate {
  layoutsForMatrix: any;
}
@Component({
  selector: 'app-bus-schedule-detail',
  templateUrl: './bus-schedule-detail.component.html',
  styleUrl: './bus-schedule-detail.component.scss',
  standalone: false
})
export class BusScheduleDetailComponent
  implements OnInit {

  busScheduleDetailForm!: FormGroup;

  @Input() busSchedule!: BusSchedule;

  busRoutes: BusRoute[] = [];
  busScheduleTemplates: BusScheduleTemplate[] = [];

  busProvinces: BusProvince[] = [];

  busStations: BusStation[] = [];

  busTemplates: BusTemplate[] = [];

  busServices: BusService[] = [];
  busTypes: BusType[] = [];

  drivers: UserDriver[] = [];

  buses: Bus[] = [];
  filterdBuses: Bus[] = [];

  busReview!: Bus;
  busTemplateReview!: BusTemplate;
  isLoaddingBusTemplateReview = false;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix
  busLayoutTemplateReview!: BusTemplateWithLayoutsMatrix | null;
  seatTypes: SeatType[] = [];

  @Input() isDialog: boolean = false;
  @Input() startDate!: Date;
  @Output() saveScheduleEvent = new EventEmitter<BusSchedule>();

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private busSchedulesService: BusSchedulesService,
    private busStationsService: BusStationsService,
    private busRoutesService: BusRoutesService,
    private busesService: BusesService,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
    private busScheduleTemplatesService: BusScheduleTemplatesService,
    private busProvincesService: BusProvincesService,
    private busTemplatesService: BusTemplatesService,
    private driversService: DriversService,
    private busLayoutTemplatesService: BusLayoutTemplatesService,
    private seatTypesService: SeatTypesService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params["busSchedule"] && !this.isDialog) {
      this.busSchedule = params["busSchedule"] ? JSON.parse(params["busSchedule"]) : null;
    }
  }

  initData() {
    let findAllBusProvinces = this.busProvincesService.findAll();
    let findAllBusStations = this.busStationsService.findAll();
    let findAllBusRoutes = this.busRoutesService.findAll();
    let findAllBuses = this.busesService.findAll();
    let findAllBusScheduleTemplates = this.busScheduleTemplatesService.findAll();
    let findAllBusTemplates = this.busTemplatesService.findAll();

    let findAllBusServices = this.busServicesService.findAll();
    let findBusTypes = this.busTypesService.findAll();

    let findDrivers = this.driversService.findAllUserDriver();

    let request = [findAllBusProvinces, findAllBusStations, findAllBusRoutes, findAllBuses,
      findAllBusScheduleTemplates, findAllBusTemplates, findAllBusServices, findBusTypes, findDrivers];
    combineLatest(request).subscribe(async ([busProvinces, busStations, busRoutes, buses,
      busScheduleTemplates, busTemplates, busServices, busTypes, drivers]) => {
      this.busProvinces = busProvinces;
      this.busStations = busStations;
      this.busRoutes = busRoutes;
      this.buses = buses;
      this.busScheduleTemplates = busScheduleTemplates;
      this.busTemplates = busTemplates;
      this.busServices = busServices;
      this.busTypes = busTypes;
      this.drivers = drivers;
      this.initForm();
    });
  }

  async initForm() {
    const { name = '', busId = '', bus = null, busTemplateId = '', busTemplate = null, busRouteId = '', busScheduleLayoutId = '',
      busRoute = null, price = '', busScheduleTemplateId = '', busLayoutTemplateId = '', busDriverIds = [] } = this.busSchedule || {};

    this.busScheduleDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      busTemplateId: [busTemplateId, [Validators.required]],
      busId: [busId],
      busRouteId: [busRouteId, [Validators.required]],
      busRoute: this.fb.group({
        name: [busRoute?.name || ''],
        breakPoints: this.fb.array([]),
        distance: [busRoute?.distance || ''],
        distanceTime: [busRoute?.distanceTime || '']
      }),
      busScheduleTemplateId: [busScheduleTemplateId],
      busLayoutTemplateId: [busLayoutTemplateId, [Validators.required]],
      busDriverIds: [busDriverIds, [Validators.required]],
      price: [price, [Validators.required]],
    });

    if (busRoute) {
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }


    if (busTemplateId) {
      const busTemplate = this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id = busTemplateId);
      if (!busTemplate) return;

      if (busScheduleLayoutId) {
        this.setupBusScheduleLayout(busScheduleLayoutId);
      } else {
        const busScheduleTemplate = this.busScheduleTemplates.find((busScheduleTemplate: BusScheduleTemplate) => busScheduleTemplate._id === busScheduleTemplateId) as BusScheduleTemplate;
        const busSeatLayoutTemplateBlockIds = busScheduleTemplate.busSeatLayoutTemplateBlockIds;
        this.setupBusLayoutTemplateReview(busTemplate as BusTemplate, busSeatLayoutTemplateBlockIds);
      }
      this.setBusTemplateReview(busTemplate as BusTemplate);
    }
    this.busReview = bus as Bus;
  }

  setupBusScheduleLayout(busScheduleLayoutId: string) {
    const findBusLayoutTemplate = this.busSchedulesService.findScheduleLayoutById(busScheduleLayoutId);
    const findSeatTypes = this.seatTypesService.findAll();
    let request = [findBusLayoutTemplate, findSeatTypes];

    combineLatest(request).subscribe(async ([busLayoutTemplate, seatTypes]) => {
      console.log("🚀 ~ combineLatest ~ busLayoutTemplate:", busLayoutTemplate)
      this.busLayoutTemplateReview = busLayoutTemplate as BusTemplateWithLayoutsMatrix;
      this.seatTypes = seatTypes;
      this.busLayoutTemplateReview.layoutsForMatrix = [];
      this.busLayoutTemplateReview.layoutsForMatrix = await this.initializeMatrix(this.busLayoutTemplateReview.seatLayouts, this.busLayoutTemplateReview.layoutsForMatrix)
    })
  }

  setupBusLayoutTemplateReview(busTemplate: BusTemplate, busSeatLayoutTemplateBlockIds: string[]) {
    const findBusLayoutTemplate = this.busLayoutTemplatesService.findOne(busTemplate.busLayoutTemplateId);
    const findSeatTypes = this.seatTypesService.findAll();
    let request = [findBusLayoutTemplate, findSeatTypes];

    combineLatest(request).subscribe(async ([busLayoutTemplate, seatTypes]) => {
      this.busLayoutTemplateReview = busLayoutTemplate as BusTemplateWithLayoutsMatrix;
      this.seatTypes = seatTypes;
      this.busLayoutTemplateReview.layoutsForMatrix = [];

      this.busLayoutTemplateReview.layoutsForMatrix = await this.initializeMatrix(this.busLayoutTemplateReview.seatLayouts,
        this.busLayoutTemplateReview.layoutsForMatrix, busSeatLayoutTemplateBlockIds)
    })
  }

  async setBusTemplateReview(busTemplate: BusTemplate) {
    this.busTemplateReview = busTemplate as BusTemplate;
    this.isLoaddingBusTemplateReview = true;
    this.filterdBuses = await this.buses.filter((bus: Bus) => bus.busTemplateId == busTemplate._id);
    const serviceOfBus = this.busServices.filter((service: BusService) =>
      this.busTemplateReview.busServiceIds.includes(service._id)
    );
    const typeOfBus = this.busTypes.find((type: BusType) =>
      this.busTemplateReview.busTypeId.includes(type._id)
    ) as BusType;
    this.busTemplateReview.busServices = serviceOfBus;
    this.busTemplateReview.busType = typeOfBus;
    this.isLoaddingBusTemplateReview = false;
  }

  get breakPoints(): FormArray {
    return this.busScheduleDetailForm.get('busRoute.breakPoints') as FormArray;
  }

  breakPointTimeChange(idx: number) {
    // Lấy control hiện tại tại vị trí idx
    const currentControl = this.breakPoints.at(idx);
    const currentTimeValue = currentControl.value.timeSchedule;

    if (!currentTimeValue) {
      return; // Nếu không có giá trị thì không xử lý
    }

    // Chuyển đổi giá trị thành đối tượng Date
    let baselineTime = new Date(currentTimeValue);

    // Duyệt qua các item picker sau idx
    for (let i = idx + 1; i < this.breakPoints.length; i++) {
      const control = this.breakPoints.at(i);
      const nextTimeValue = control.value.timeSchedule;
      const nextTime = nextTimeValue ? new Date(nextTimeValue) : null;

      // Tính thời gian mong muốn cho picker tiếp theo = baselineTime + 10 phút
      const expectedTime = new Date(baselineTime.getTime() + 10 * 60 * 1000);

      // Nếu picker kế tiếp chưa có giá trị hoặc có giá trị nhỏ hơn expectedTime
      if (!nextTime || nextTime.getTime() < expectedTime.getTime()) {
        control.patchValue({ timeSchedule: expectedTime });
        // Cập nhật baselineTime thành expectedTime để tính cho picker tiếp theo
        baselineTime = expectedTime;
      } else {
        // Nếu picker kế tiếp đã có giá trị >= expectedTime, cho phép giữ nguyên và sử dụng giá trị đó làm baseline cho bước sau
        baselineTime = nextTime;
      }
    }
  }

  checkDisableDateTime(idx: number): ((current: Date | null) => boolean) & {
    nzDisabledTime: (current?: Date | Date[]) => {
      nzDisabledHours: () => number[];
      nzDisabledMinutes: (selectedHour: number) => number[];
      nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => number[];
    };
  } {
    // Determine the base time: use current time for the first picker, or the previous picker's value otherwise.
    let baseTime: Date;
    if (idx === 0) {
      baseTime = new Date();
    } else {
      const previousDateValue = this.breakPoints.controls[idx - 1]?.value.timeSchedule;
      baseTime = previousDateValue ? new Date(previousDateValue) : new Date();
    }

    // Disable date logic: prevent selecting dates earlier than `baseTime`.
    const disabledDate = (current: Date | null): boolean => {
      if (!current) return false;
      const baseDayStart = new Date(baseTime.getFullYear(), baseTime.getMonth(), baseTime.getDate());
      const currentDayStart = new Date(current.getFullYear(), current.getMonth(), current.getDate());
      return currentDayStart.getTime() < baseDayStart.getTime();
    };

    // Disable time logic: adjusts based on the selected date (`current`) dynamically.
    const disabledTime = (current?: Date | Date[]) => {
      // Fallback to `baseTime` if no `current` is provided
      const referenceTime = current ? new Date(current as Date) : baseTime;

      // If the selected date (`current`) is the same day as `baseTime`, disable past times.
      const isSameDay = referenceTime.toDateString() === baseTime.toDateString();

      return {
        nzDisabledHours: () => {
          if (isSameDay) {
            return Array.from({ length: baseTime.getHours() }, (_, i) => i); // Disable hours earlier than baseTime
          }
          return []; // No hours are disabled for other days
        },
        nzDisabledMinutes: (selectedHour: number) => {
          if (isSameDay && selectedHour === baseTime.getHours()) {
            return Array.from({ length: baseTime.getMinutes() }, (_, i) => i); // Disable minutes earlier than baseTime
          }
          return [];
        },
        nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => {
          if (isSameDay && selectedHour === baseTime.getHours() && selectedMinute === baseTime.getMinutes()) {
            return Array.from({ length: baseTime.getSeconds() }, (_, i) => i); // Disable seconds earlier than baseTime
          }
          return [];
        }
      };
    };

    // Attach `nzDisabledTime` property to `disabledDate` function.
    (disabledDate as any).nzDisabledTime = disabledTime;

    return disabledDate as ((current: Date | null) => boolean) & {
      nzDisabledTime: (current?: Date | Date[]) => {
        nzDisabledHours: () => number[];
        nzDisabledMinutes: (selectedHour: number) => number[];
        nzDisabledSeconds: (selectedHour: number, selectedMinute: number) => number[];
      };
    };
  }




  backPage() {
    this.location.back();
  }

  async initializeMatrix(
    seatLayouts: any,
    layoutsForMatrix: any,
    busSeatLayoutTemplateBlockIds?: string[]
  ): Promise<void> {
    for (const seatLayout of seatLayouts) {
      const layoutForMatrix = {
        name: seatLayout.name,
        seatDisplayRows: [],
        seatVisibleColumns: [],
        seatsLayoutForMatrix: Array.from({ length: this.rows }, (_, i) =>
          Array.from({ length: this.cols }, (_, j) => ({
            _id: "",
            index: i * this.cols + j + 1,
            typeId: "",
            name: "",
            status: "available", // Default status
            statusChanged: false,
            statusDeselected: false,
          }))
        ),
      };

      // Map seat data onto the matrix
      for (const cell of seatLayout.seats) {
        const row = Math.floor((cell.index - 1) / this.cols);
        const col = (cell.index - 1) % this.cols;

        layoutForMatrix.seatsLayoutForMatrix[row][col] = {
          ...cell,
          statusChanged: false,
          statusDeselected: false,
          status: busSeatLayoutTemplateBlockIds && busSeatLayoutTemplateBlockIds.includes(cell._id)
            ? "block" // Mark as blocked if present in the IDs list
            : cell.status, // Default to available
        };
      }

      // Update the display matrix
      await this.updateDisplayMatrix(
        layoutForMatrix.seatsLayoutForMatrix,
        layoutForMatrix.seatDisplayRows,
        layoutForMatrix.seatVisibleColumns,
        (matrix, displayRows, visibleColumns) => {
          layoutForMatrix.seatsLayoutForMatrix = matrix;
          layoutForMatrix.seatDisplayRows = displayRows;
          layoutForMatrix.seatVisibleColumns = visibleColumns;
        }
      );

      // Add the completed layout to the layouts array
      layoutsForMatrix.push(layoutForMatrix);
    }

    // Output the updated layouts
    return layoutsForMatrix;
  }


  async updateDisplayMatrix(
    matrix: any,
    displayRows: any,
    visibleColumns: any,
    out: (matrixOut: any, displayRowsOut: any, visibleColumnsOut: any) => void,
  ): Promise<void> {
    const rows = matrix.length;
    const cols = matrix[0].length;

    displayRows = Array(rows).fill(false);
    visibleColumns = Array(cols).fill(false);
    const selectedColumns: number[] = [];
    const selectedRows = new Set<number>();

    matrix.forEach((row: any, i: number) => {
      row.forEach((cell: any, j: number) => {
        if (cell.typeId) {
          displayRows[i] = true;
          selectedColumns.push(j);
          selectedRows.add(i);
        }
      });
    });

    const selectedRowsArray = Array.from(selectedRows).sort((a, b) => a - b);
    selectedRowsArray.forEach((row, index, array) => {
      for (let i = row; i <= array[array.length - 1]; i++) {
        displayRows[i] = true;
      }
    });

    if (selectedColumns.length > 0) {
      selectedColumns.sort((a, b) => a - b);
      const [firstCol, lastCol] = [selectedColumns[0], selectedColumns[selectedColumns.length - 1]];
      for (let j = firstCol; j <= lastCol; j++) {
        visibleColumns[j] = true;
      }
    }

    out(matrix, displayRows, visibleColumns);
  }

  onClickToggleStatus(row: number, col: number, layoutForMatrix: any, event: MouseEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    this.toggleStatus(row, col, layoutForMatrix, event);
  }

  toggleStatus(row: number, col: number, layoutForMatrix: any, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const currentMatrix = layoutForMatrix.seatsLayoutForMatrix;
    const cell = currentMatrix[row][col];

    const currentCellSeatType = this.seatTypes.find(item => item._id == cell.typeId);

    if (currentCellSeatType?.isEnv) {
      return
    }

    // Remove the current status class
    const cellElement = this.el.nativeElement.querySelector(`#cell-${layoutForMatrix.name.replace(' ', '')}-${cell.index}`);
    this.renderer.removeClass(cellElement, `status-${cell.status}`);

    //use for animation
    setTimeout(() => {
      if (cell.status === 'available') {
        cell.status = 'block';
        cell.icon = currentCellSeatType?.blockIcon;
      } else if (cell.status === 'block') {
        cell.status = 'available';
        cell.icon = currentCellSeatType?.icon;
      }

      // Add the new status class
      this.renderer.addClass(cellElement, `status-${cell.status}`);
    }, 100); // Ensure the revert animation completes before applying the new status
  }

  getIconByType(cell: any) {
    // Tìm loại ghế tương ứng dựa trên type
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    if (!selectedType) return "";

    // Trả về icon tương ứng dựa trên trạng thái của ghế
    if (cell.status === "selected") {
      return selectedType.selectedIcon
    } else if (cell.status === "block" || cell.status === "booked") {
      return selectedType.blockIcon
    }
    return selectedType.icon
  }

  editBusTempate() {
    const allowedKeys = ["_id", "name", "seatLayouts"]; // Danh sách các thuộc tính trong BusTemplate
    const combinedBusTemplate: BusLayoutTemplate = Object.fromEntries(
      this.busLayoutTemplateReview ? Object.entries(this.busLayoutTemplateReview).filter(([key]) => allowedKeys.includes(key)) : []
    ) as unknown as BusLayoutTemplate;

    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busTemplate: JSON.stringify(combinedBusTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/management/bus-layout-templates/bus-layout-template-detail', { state: params });
  }

  async chooseBus(busId: string) {
    const bus = await this.buses.find((bus: Bus) => bus._id == busId) as Bus;
    this.busScheduleDetailForm.get('bus')?.patchValue(bus);
    this.busReview = bus;
  }

  async chooseBusTemplate(busTemplateId: string) {
    const busTemplate = await this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id === busTemplateId) as BusTemplate;
    this.busTemplateReview = busTemplate as BusTemplate;
    this.busScheduleDetailForm.get('busId')?.patchValue('');
    this.busScheduleDetailForm.get('busLayoutTemplateId')?.patchValue(busTemplate.busLayoutTemplateId);
    this.busScheduleDetailForm.get('busTemplate')?.patchValue(busTemplate);
    this.setBusTemplateReview(busTemplate)
  }

  async chooseRoute(busRouteId: string, busScheduleTemplateRoute?: BusScheduleTemplateRoute) {
    const busRouteForm = this.busScheduleDetailForm.get('busRoute') as FormGroup;

    let busRoute: any;
    busRoute = await this.busRoutes.find((busRoute: BusRoute) => busRoute._id === busRouteId) as BusScheduleTemplateRoute;
    if (busScheduleTemplateRoute) {
      busRoute = busScheduleTemplateRoute;
    }

    busRouteForm.get('name')?.patchValue(busRoute.name);
    busRouteForm.get('distance')?.patchValue(busRoute.distance);
    busRouteForm.get('distanceTime')?.patchValue(busRoute.distanceTime);

    if (busRoute) {
      this.breakPoints.clear();
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }
  }

  async chooseBusScheduleTemplate(busScheduleTemplateId: string) {
    const busScheduleTemplate = await this.busScheduleTemplates.find((busScheduleTemplate: BusScheduleTemplate) => busScheduleTemplate._id === busScheduleTemplateId) as BusScheduleTemplate;
    if (!busScheduleTemplate) {
      return;
    }

    const busScheduleDetailForm = this.busScheduleDetailForm as FormGroup;

    busScheduleDetailForm.get('name')?.patchValue(busScheduleTemplate.name);
    busScheduleDetailForm.get('price')?.patchValue(busScheduleTemplate.price);


    busScheduleDetailForm.get('busRouteId')?.patchValue(busScheduleTemplate.busRouteId);
    busScheduleDetailForm.get('busTemplateId')?.patchValue(busScheduleTemplate.busTemplateId);
    busScheduleDetailForm.get('busDriverIds')?.patchValue(busScheduleTemplate.busDriverIds);

    await this.chooseBus(busScheduleTemplate.busId);
    await this.chooseRoute(busScheduleTemplate.busRouteId, busScheduleTemplate.busRoute);
    await this.chooseBusTemplate(busScheduleTemplate.busTemplateId);

    busScheduleDetailForm.get('busId')?.patchValue(busScheduleTemplate.busId);

    const busTemplate = this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id === busScheduleTemplate.busTemplateId) as BusTemplate;
    const busSeatLayoutTemplateBlockIds = busScheduleTemplate.busSeatLayoutTemplateBlockIds;

    this.setupBusLayoutTemplateReview(busTemplate as BusTemplate, busSeatLayoutTemplateBlockIds);
  }

  resetBusScheduleTemplate() {
    const busScheduleDetailForm = this.busScheduleDetailForm as FormGroup;
    this.busLayoutTemplateReview = null;
    busScheduleDetailForm.reset();
  }

  createBreakPoint(breakPoint: BusRouteScheduleBreakPoints): FormGroup {
    const { name = '', detailAddress = '', location = '', provinceId = '' } = this.busStations.find((busStation: BusStation) => busStation._id === breakPoint.busStationId) as BusStation;
    const province = this.busProvinces.find((busProvince: BusProvince) => busProvince._id === provinceId) as BusProvince;

    let timeSchedule = breakPoint.timeSchedule;
    if (!timeSchedule) {
      timeSchedule = this.calculateTimeSchedule(breakPoint.timeOffset)
    }

    return this.fb.group({
      busStationId: [breakPoint.busStationId],
      timeSchedule: [timeSchedule, [Validators.required]],
      name: [name],
      detailAddress: [detailAddress],
      location: [location],
      provinceId: [provinceId],
      province: [province],
    });
  }

  calculateTimeSchedule(offsetTime: string): string {
    let currentDate = new Date(); // Thời gian hiện tại
    if (this.startDate) {
      currentDate = this.startDate
    }

    // Tách phần số và đơn vị (nếu không có đơn vị thì mặc định là h - giờ)
    const match = offsetTime && offsetTime.match(/^(\d+)(h|m)?$/);

    if (!match) {
      return '';
    }

    const value = parseInt(match[1], 10); // Lấy số
    const unit = match[2] || 'h'; // Mặc định là 'h' nếu không có đơn vị

    let timeSchedule: Date;

    // Kiểm tra đơn vị
    if (unit === 'h') {
      // Nếu là giờ, cộng số giờ vào thời gian hiện tại
      timeSchedule = new Date(currentDate.getTime() + value * 3600000);
    } else if (unit === 'm') {
      // Nếu là phút, cộng số phút vào thời gian hiện tại
      timeSchedule = new Date(currentDate.getTime() + value * 60000);
    } else {
      throw new Error('Invalid unit. Only "h" (hours) or "m" (minutes) are supported.');
    }

    return timeSchedule.toISOString(); // Trả về thời gian ISO
  }

  getBusStationByIdInform(idx: number) {
    const busStationId = this.breakPoints.controls[idx].get('busStationId')?.value;
    const busStation = this.busStations.find((busStation: BusStation) => busStation._id === busStationId) as BusStation;
    return busStation;
  }

  async onSubmit() {
    console.log("🚀 ~ onSubmit ~ this.busScheduleDetailForm:", this.busScheduleDetailForm)
    if (!this.busScheduleDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleDetailForm);
      return;
    }

    const busSeatLayoutTemplateBlockIds = await this.getBusSeatLayoutTemplateBlock();

    const data = this.busScheduleDetailForm.getRawValue();

    const busSchedule2Create: BusSchedule2Create = {
      ...data,
      busTemplate: this.busTemplateReview,
      bus: this.busReview,
      busSeatLayoutTemplateBlockIds,
      startDate: data.busRoute.breakPoints[0].timeSchedule,
      endDate: data.busRoute.breakPoints.at(-1).timeSchedule
    };
    if (this.busSchedule) {
      const busSchedule2Update = {
        ...busSchedule2Create,
        busScheduleLayoutId: this.busSchedule.busScheduleLayoutId,
        _id: this.busSchedule._id, // Thêm thuộc tính _id
      };

      this.updateBus(busSchedule2Update);
      return;
    }

    this.createBus(busSchedule2Create);
  }

  async getBusSeatLayoutTemplateBlock(): Promise<string[]> {
    const blockIds: string[] = []; // Collect block IDs in this array
    // Iterate through layouts to retrieve block IDs
    this.busLayoutTemplateReview?.layoutsForMatrix?.forEach((layout: any) => {
      layout.seatsLayoutForMatrix.forEach((row: any) => {
        row.forEach((cell: any) => {
          if (cell.status === 'block') {
            blockIds.push(cell._id); // Add the block ID to the array
          }
        });
      });
    });

    return blockIds; // Return the array of block IDs
  }

  updateBus(busSchedule2Update: BusSchedule2Update) {
    this.busSchedulesService.updateBusSchedule(busSchedule2Update).subscribe({
      next: (res: BusSchedule) => {
        if (res) {
          const updatedState = { ...history.state, busSchedule: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.saveScheduleEvent.emit(res);
          toast.success('Bus Route update successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBus(busSchedule2Create: BusSchedule2Create) {
    this.busSchedulesService.createBusSchedule(busSchedule2Create).subscribe({
      next: (res: BusSchedule) => {
        if (res) {
          this.saveScheduleEvent.emit(res);
          toast.success('Bus Route added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}

