import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { BusRouteScheduleTemplateBreakPoints, BusScheduleTemplate, BusScheduleTemplate2Create, BusScheduleTemplate2Update, BusScheduleTemplateRoute } from '../../model/bus-schedule-template.model';
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
import { UserDriver } from 'src/app/modules/management/pages/user/model/driver.model';
import { DriversService } from 'src/app/modules/management/pages/user/service/driver.servive';

interface BusTemplateReview extends BusTemplate {
  busServices: BusService[],
  busType: BusType,
  isLoading: boolean
}
interface BusTemplateWithLayoutsMatrix extends BusLayoutTemplate {
  layoutsForMatrix: any;
}
@Component({
  selector: 'app-bus-schedule-template-detail',
  templateUrl: './bus-schedule-template-detail.component.html',
  styleUrls: ['./bus-schedule-template-detail.component.scss'],
  standalone: false
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
  busSeatLayoutTemplateBlockIds: string[] = [];

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.busScheduleTemplate = params["busScheduleTemplate"] ? JSON.parse(params["busScheduleTemplate"]) : null;
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

    let request = [findAllBusStations, findAllBusRoutes, findAllBuses, findAllBusTemplates, findAllBusServices, findBusTypes, findDrivers];
    combineLatest(request).subscribe(async ([busStations, busRoutes, buses, busTemplates, busServices, busTypes, drivers]) => {
      this.busStations = busStations;
      this.busRoutes = busRoutes;

      this.buses = buses;
      this.busTemplates = busTemplates;

      this.busServices = busServices;
      this.busTypes = busTypes;

      this.drivers = drivers;

      this.initForm();
    });
  }

  async initForm() {
    const { name = '', busId = '', busTemplateId = '', busRouteId, busRoute, price, busDriverIds = [], busSeatLayoutTemplateBlockIds = [] } = this.busScheduleTemplate || {};
    this.busSeatLayoutTemplateBlockIds = busSeatLayoutTemplateBlockIds;
    this.busScheduleTemplateDetailForm = this.fb.group({
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
      price: [price, [Validators.required]],
      busDriverIds: [busDriverIds],
    });

    if (busRoute) {
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }

    if (busTemplateId) {
      const busTemplate = this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id = busTemplateId);
      if (!busTemplate) return;
      this.setBusTemplateReview(busTemplate as BusTemplate);
    }

    if (busId) {
      this.chooseBus(busId);
    }
  }

  setupBusLayoutTemplateReview(busTemplate: BusTemplate) {
    const findBusLayoutTemplate = this.busLayoutTemplatesService.findOne(busTemplate.busLayoutTemplateId);
    const findSeatTypes = this.seatTypesService.findAll();
    let request = [findBusLayoutTemplate, findSeatTypes];

    combineLatest(request).subscribe(([busLayoutTemplate, seatTypes]) => {
      this.busLayoutTemplateReview = busLayoutTemplate as BusTemplateWithLayoutsMatrix;
      this.seatTypes = seatTypes;
    })
  }

  get breakPoints(): FormArray {
    return this.busScheduleTemplateDetailForm.get('busRoute.breakPoints') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  editBusTempate() {
    const allowedKeys = ["_id", "name", "seatLayouts"]; // Danh sách các thuộc tính trong BusTemplate
    const combinedBusTemplate: BusLayoutTemplate = Object.fromEntries(
      Object.entries(this.busLayoutTemplateReview).filter(([key]) => allowedKeys.includes(key))
    ) as BusLayoutTemplate;

    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busTemplate: JSON.stringify(combinedBusTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/bus-management/bus-design/bus-layout-templates/bus-layout-template-detail', { state: params });
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
      this.busTemplateReview.busServiceIds.includes(service._id)
    );
    const typeOfBus = this.busTypes.find((type: BusType) =>
      this.busTemplateReview.busTypeId.includes(type._id)
    ) as BusType;
    this.busTemplateReview.busServices = serviceOfBus;
    this.busTemplateReview.busType = typeOfBus;
    this.busTemplateReview.isLoading = false;
    this.setupBusLayoutTemplateReview(busTemplate as BusTemplate);
  }

  async chooseBusTemplate(busTemplateId: string) {
    const busTemplate = this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id === busTemplateId) as BusTemplate;
    this.busTemplateReview = busTemplate as BusTemplateReview;
    this.filterdBuses = this.buses.filter((bus: Bus) => bus.busTemplateId == busTemplateId);

    this.busScheduleTemplateDetailForm.get('busId')?.patchValue('');
    this.setBusTemplateReview(busTemplate)

  }

  async chooseRoute(busRouteId: string) {
    this.breakPoints.clear();
    const busRouteForm = this.busScheduleTemplateDetailForm.get('busRoute') as FormGroup;
    const busRoute = this.busRoutes.find((busRoute: BusRoute) => busRoute._id === busRouteId) as BusScheduleTemplateRoute;

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
      busStationId: [breakPoint.busStationId],
      timeOffset: [timeOffset, [Validators.required, Validators.pattern(/^(\d{1,2}(h|m)?|\d{1,2})$/)]]
    });
  }

  getBusStationByIdInform(idx: number) {
    const busStationId = this.breakPoints.controls[idx].get('busStationId')?.value;
    const busStation = this.busStations.find((busStation: BusStation) => busStation._id === busStationId) as BusStation;
    return busStation;

  }

  async onSubmit() {
    if (!this.busScheduleTemplateDetailForm.valid) {
      // Mark the form as touched if invalid
      this.utils.markFormGroupTouched(this.busScheduleTemplateDetailForm);
      return;
    }

    try {
      // Wait for the async function to retrieve block IDs
      const busSeatLayoutTemplateBlockIds = await this.getBusSeatLayoutTemplateBlock();

      // Prepare data for creation or update
      const data = this.busScheduleTemplateDetailForm.getRawValue();
      const busSchedule2Create: BusScheduleTemplate2Create = {
        ...data,
        busSeatLayoutTemplateBlockIds,
      };


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
      console.error("Error in onSubmit:", error); // Log error for debugging
    }
  }

  async getBusSeatLayoutTemplateBlock(): Promise<string[]> {
    const blockIds: string[] = []; // Collect block IDs in this array
    // Iterate through layouts to retrieve block IDs
    this.busLayoutTemplateReview.layoutsForMatrix.forEach((layout: any) => {
      layout.seatsLayoutForMatrix.forEach((row: any) => {
        row.forEach((cell: any) => {
          if (cell.status === 'blocked') {
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
          toast.success('Bus Route added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
