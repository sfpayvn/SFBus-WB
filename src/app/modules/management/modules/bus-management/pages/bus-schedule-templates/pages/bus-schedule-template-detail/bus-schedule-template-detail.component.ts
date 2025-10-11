import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  BusRouteScheduleTemplateBreakPoints,
  BusScheduleTemplate,
  BusScheduleTemplate2Create,
  BusScheduleTemplate2Update,
  BusScheduleTemplateRoute,
} from '../../model/bus-schedule-template.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { combineLatest } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BusScheduleTemplatesService } from '../../service/bus-schedule-templates.servive';
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
import { BusTemplate } from '../../../bus-templates/model/bus-template.model';
import { BusTemplatesService } from '../../../bus-templates/service/bus-templates.servive';
import { BusLayoutTemplatesService } from '../../../bus-layout-templates/service/bus-layout-templates.servive';
import { BusLayoutTemplate } from '../../../bus-layout-templates/model/bus-layout-templates.model';
import { SeatType } from '../../../seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import { Router } from '@angular/router';
import { UserDriver } from 'src/app/modules/management/modules/user-management/model/driver.model';
import { DriversService } from 'src/app/modules/management/modules/user-management/service/driver.servive';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

interface BusTemplateReview extends BusTemplate {
  busServices: BusService[];
  busType: BusType;
  isLoading: boolean;
}
interface BusTemplateWithLayoutsMatrix extends BusLayoutTemplate {
  layoutsForMatrix: any;
}
@Component({
  selector: 'app-bus-schedule-template-detail',
  templateUrl: './bus-schedule-template-detail.component.html',
  styleUrls: ['./bus-schedule-template-detail.component.scss'],
  standalone: false,
})
export class BusScheduleTemplateDetailComponent implements OnInit {
  busScheduleTemplateDetailForm!: FormGroup;

  busScheduleTemplate!: BusScheduleTemplate;

  busRoutes: BusRoute[] = [];

  busStations: BusStation[] = [];

  busTemplates: BusTemplate[] = [];

  buses: Bus[] = [];
  filterdBuses: Bus[] = [];

  busServices: BusService[] = [];
  busTypes: BusType[] = [];

  drivers: UserDriver[] = [];

  busReview!: Bus;
  busTemplateReview!: BusTemplateReview;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix
  busLayoutTemplateReview!: BusTemplateWithLayoutsMatrix;
  busSeatLayoutBlockIds: string[] = [];

  seatTypes: SeatType[] = [];

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private busScheduleTemplatesService: BusScheduleTemplatesService,
    private busStationsService: BusStationsService,
    private busRoutesService: BusRoutesService,
    private busesService: BusesService,
    private busTemplatesService: BusTemplatesService,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
    private driversService: DriversService,
    private busLayoutTemplatesService: BusLayoutTemplatesService,
    private seatTypesService: SeatTypesService,
    private router: Router,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.busScheduleTemplate = params['busScheduleTemplate'] ? JSON.parse(params['busScheduleTemplate']) : null;
    }
  }

  initData() {
    let findAllBusStations = this.busStationsService.findAll();
    let findAllBusRoutes = this.busRoutesService.findAll();
    let findAllBuses = this.busesService.findAll();
    let findAllBusTemplates = this.busTemplatesService.findAll();

    let findAllBusServices = this.busServicesService.findAll();
    let findBusTypes = this.busTypesService.findAll();

    let findDrivers = this.driversService.findAllUserDriver();

    const findSeatTypes = this.seatTypesService.findAll();

    let request = [
      findAllBusStations,
      findAllBusRoutes,
      findAllBuses,
      findAllBusTemplates,
      findAllBusServices,
      findBusTypes,
      findDrivers,
      findSeatTypes,
    ];
    combineLatest(request).subscribe(
      async ([busStations, busRoutes, buses, busTemplates, busServices, busTypes, drivers, seatTypes]) => {
        this.busStations = busStations;
        this.busRoutes = busRoutes;

        this.buses = buses;
        this.busTemplates = busTemplates;

        this.busServices = busServices;
        this.busTypes = busTypes;

        this.drivers = drivers;

        this.seatTypes = seatTypes;

        this.initForm();
      },
    );
  }

  async initForm() {
    const {
      name = '',
      busId = '',
      busTemplateId = '',
      busRouteId,
      busRoute,
      busDriverIds = [],
      busSeatLayoutBlockIds = [],
    } = this.busScheduleTemplate || {};

    this.busSeatLayoutBlockIds = busSeatLayoutBlockIds;

    this.busScheduleTemplateDetailForm = this.fb.group({
      name: [
        { value: name, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        [Validators.required],
      ],
      busTemplateId: [
        { value: busTemplateId, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        [Validators.required],
      ],

      busId: [{ value: busId, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) }],
      busRouteId: [
        { value: busRouteId, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        [Validators.required],
      ],
      busRoute: this.fb.group({
        name: [{ value: busRoute?.name || '', disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) }],
        breakPoints: this.fb.array([]),
        distance: [
          { value: busRoute?.distance || '', disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        ],
        distanceTime: [
          {
            value: busRoute?.distanceTime || '',
            disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate),
          },
        ],
      }),
      busSeatPrices: this.fb.array([]),
      busDriverIds: [{ value: busDriverIds, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) }],
    });

    if (busRoute) {
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }

    if (busTemplateId) {
      const busTemplate = this.busTemplates.find((busTemplate: BusTemplate) => (busTemplate._id = busTemplateId));
      if (!busTemplate) return;
      this.setBusTemplateReview(busTemplate as BusTemplate);
    }

    if (busId) {
      this.chooseBus(busId);
    }
  }

  get f() {
    return this.busScheduleTemplateDetailForm.controls;
  }

  async setupBusSeatPrices() {
    const allIds = this.busLayoutTemplateReview.seatLayouts.flatMap((layout: any) =>
      layout.seats.filter((s: any) => s.status === 'available').map((s: any) => s.typeId),
    );

    // Dùng Set để loại trùng và spread về lại mảng
    const availableSeatIds = [...new Set(allIds)];

    this.seatTypes.map(async (seatType: SeatType) => {
      if (seatType.isEnv || !availableSeatIds.includes(seatType._id)) {
        return;
      }
      this.busSeatPricesForm.push(await this.createSeatPriceForm(seatType));
    });
  }

  async createSeatPriceForm(seatType: SeatType): Promise<FormGroup> {
    const { busSeatPrices } = this.busScheduleTemplate || {};

    let seatPrice = '';
    // Tìm kiếm giá vé cho loại ghế hiện tại
    if (busSeatPrices && busSeatPrices.length > 0) {
      const foundPrice = busSeatPrices.find((price) => price.seatTypeId === seatType._id)?.price;
      seatPrice = foundPrice !== undefined && foundPrice !== null ? String(foundPrice) : '';
    }

    return this.fb.group({
      seatTypeId: [{ value: seatType._id, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) }], // giữ giá trị tĩnh
      seatTypeName: [{ value: seatType.name, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) }], // giữ giá trị tĩnh
      seatTypeIcon: [{ value: seatType.icon, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) }], // giữ giá trị tĩnh
      price: [
        { value: seatPrice || '', disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        [Validators.required],
      ], // chỉ trường này được nhập
    });
  }

  get busSeatPricesForm(): FormArray {
    return this.busScheduleTemplateDetailForm.get('busSeatPrices') as FormArray;
  }

  setupBusLayoutTemplateReview(busTemplate: BusTemplate) {
    const findBusLayoutTemplate = this.busLayoutTemplatesService.findOne(busTemplate.busLayoutTemplateId);
    let request = [findBusLayoutTemplate];

    combineLatest(request).subscribe(([busLayoutTemplate]) => {
      this.busLayoutTemplateReview = busLayoutTemplate as BusTemplateWithLayoutsMatrix;
      console.log(
        '🚀 ~ BusScheduleTemplateDetailComponent ~ combineLatest ~ this.busLayoutTemplateReview:',
        this.busLayoutTemplateReview,
      );

      this.setupBusSeatPrices();
    });
  }

  get breakPoints(): FormArray {
    return this.busScheduleTemplateDetailForm.get('busRoute.breakPoints') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  editBusLayoutTemplate() {
    const allowedKeys = ['_id', 'name', 'seatLayouts']; // Danh sách các thuộc tính trong BusTemplate
    const combinedBusTemplate: BusLayoutTemplate = Object.fromEntries(
      Object.entries(this.busLayoutTemplateReview).filter(([key]) => allowedKeys.includes(key)),
    ) as BusLayoutTemplate;

    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busLayoutTemplate: JSON.stringify(combinedBusTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/management/bus-management/bus-design/bus-layout-templates/bus-layout-template-detail', {
      state: params,
    });
  }

  async chooseBus(busId: string) {
    const bus = this.buses.find((bus: Bus) => bus._id == busId) as Bus;
    this.busReview = bus;
  }

  async setBusTemplateReview(busTemplate: BusTemplate) {
    this.busTemplateReview = busTemplate as BusTemplateReview;
    this.busTemplateReview.isLoading = true;
    this.filterdBuses = await this.buses.filter((bus: Bus) => bus.busTemplateId == busTemplate._id);
    const serviceOfBus = this.busServices.filter((service: BusService) =>
      this.busTemplateReview.busServiceIds.includes(service._id),
    );
    const typeOfBus = this.busTypes.find((type: BusType) =>
      this.busTemplateReview.busTypeId.includes(type._id),
    ) as BusType;
    this.busTemplateReview.busServices = serviceOfBus;
    this.busTemplateReview.busType = typeOfBus;
    this.busTemplateReview.isLoading = false;
    this.setupBusLayoutTemplateReview(busTemplate as BusTemplate);
  }

  async chooseBusTemplate(busTemplateId: string) {
    const busTemplate = this.busTemplates.find(
      (busTemplate: BusTemplate) => busTemplate._id === busTemplateId,
    ) as BusTemplate;
    this.busTemplateReview = busTemplate as BusTemplateReview;
    this.filterdBuses = this.buses.filter((bus: Bus) => bus.busTemplateId == busTemplateId);

    this.busScheduleTemplateDetailForm.get('busId')?.patchValue('');
    this.setBusTemplateReview(busTemplate);
  }

  async chooseRoute(busRouteId: string) {
    this.breakPoints.clear();
    const busRouteForm = this.busScheduleTemplateDetailForm.get('busRoute') as FormGroup;
    const busRoute = this.busRoutes.find(
      (busRoute: BusRoute) => busRoute._id === busRouteId,
    ) as BusScheduleTemplateRoute;

    busRouteForm.get('name')?.patchValue(busRoute.name);
    busRouteForm.get('distance')?.patchValue(busRoute.distance);
    busRouteForm.get('distanceTime')?.patchValue(busRoute.distanceTime);

    if (busRoute) {
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }
  }

  createBreakPoint(breakPoint: BusRouteScheduleTemplateBreakPoints): FormGroup {
    const { timeOffset = '' } = breakPoint;
    return this.fb.group({
      busStationId: [
        { value: breakPoint.busStationId || '', disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        [Validators.required],
      ],
      timeOffset: [
        { value: timeOffset, disabled: this.defaultFlagService.isDefault(this.busScheduleTemplate) },
        [Validators.required, Validators.pattern(/^(\d{1,2}(h|m)?|\d{1,2})$/)],
      ],
    });
  }

  getBusStationByIdInform(idx: number) {
    const busStationId = this.breakPoints.controls[idx].get('busStationId')?.value;
    const busStation = this.busStations.find((busStation: BusStation) => busStation._id === busStationId) as BusStation;
    return busStation;
  }

  clearFormValue(controlName: string, formGroup: FormGroup) {
    if (this.defaultFlagService.isDefault(this.busScheduleTemplate)) return;

    const control = formGroup.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  async onSubmit() {
    if (!this.busScheduleTemplateDetailForm.valid) {
      // Mark the form as touched if invalid
      this.utils.markFormGroupTouched(this.busScheduleTemplateDetailForm);
      return;
    }

    try {
      // Wait for the async function to retrieve block IDs
      const busSeatLayoutBlockIds = await this.getBusSeatLayoutTemplateBlock();

      // Prepare data for creation or update
      const data = this.busScheduleTemplateDetailForm.getRawValue();
      const busSchedule2Create: BusScheduleTemplate2Create = {
        ...data,
        busSeatLayoutBlockIds,
      };

      const busSeatPricesData = this.busSeatPricesForm.getRawValue();

      busSchedule2Create.busSeatPrices = busSeatPricesData.map((price: any) => ({
        seatTypeId: price.seatTypeId,
        price: Number(price.price), // Ensure price is a number
        seatTypeName: price.seatTypeName, // Keep the seat type name
      }));

      // Check if a template exists for updating; otherwise, create a new one
      if (this.busScheduleTemplate) {
        const busSchedule2Update = {
          ...busSchedule2Create,
          _id: this.busScheduleTemplate._id, // Add the _id attribute
        };

        await this.updateBus(busSchedule2Update); // Ensure the update process completes
      } else {
        await this.createBus(busSchedule2Create); // Ensure the creation process completes
      }
    } catch (error) {
      console.error('Error in onSubmit:', error); // Log error for debugging
    }
  }

  getSeatTypeById(id: string): SeatType | undefined {
    return this.seatTypes.find((seatType: SeatType) => seatType._id === id);
  }

  async getBusSeatLayoutTemplateBlock(): Promise<string[]> {
    const blockIds: string[] = []; // Collect block IDs in this array
    // Iterate through layouts to retrieve block IDs
    this.busLayoutTemplateReview.layoutsForMatrix.forEach((layout: any) => {
      layout.seatsLayoutForMatrix.forEach((row: any) => {
        row.forEach((cell: any) => {
          if (cell.status === 'blocked' && this.getSeatTypeById(cell.typeId)?.isEnv === false) {
            blockIds.push(cell._id); // Add the block ID to the array
          }
        });
      });
    });

    return blockIds; // Return the array of block IDs
  }

  updateBus(busSchedule2Update: BusScheduleTemplate2Update) {
    this.busScheduleTemplatesService.updateBusScheduleTemplate(busSchedule2Update).subscribe({
      next: (res: BusScheduleTemplate) => {
        if (res) {
          const updatedState = { ...history.state, busScheduleTemplate: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Bus Route update successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBus(busSchedule2Create: BusScheduleTemplate2Create) {
    this.busScheduleTemplatesService.createBusScheduleTemplate(busSchedule2Create).subscribe({
      next: (res: BusScheduleTemplate) => {
        if (res) {
          this.busScheduleTemplate = res;
          const updatedState = { ...history.state, busScheduleTemplate: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.initForm();
          toast.success('Bus Route added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
