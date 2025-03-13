import { Component, OnInit } from '@angular/core';
import { BusRouteScheduleBreakPoints, BusScheduleTemplate, BusScheduleTemplate2Create, BusScheduleTemplate2Update, BusScheduleTemplateRoute } from '../../model/bus-schedule-template.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { combineLatest } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BusScheduleTemplatesService } from '../../service/bus-schedule-templates.servive';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { BusStationsService } from '../../../bus-stations/service/bus-stations.servive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';
import { BusRoute } from '../../../bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-routes/service/bus-routes.servive';
import { Bus } from '../../../buses/model/bus.model';
import { BusesService } from '../../../buses/service/buses.servive';
import { BusServicesService } from '../../../bus-services/service/bus-services.servive';
import { BusTypesService } from '../../../bus-types/service/bus-types.servive';
import { BusService } from '../../../bus-services/model/bus-service.model';
import { BusType } from '../../../bus-types/model/bus-type.model';
import { BusLayoutTemplate } from '../../../bus-layout-templates/model/bus-layout-templates.model';
import { BusLayoutTemplatesService } from '../../../bus-layout-templates/service/bus-layout-templates.servive';

interface BusReview extends Bus {
  busServices: BusService[],
  busType: BusType,
  isLoading: boolean
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

  buses: Bus[] = [];

  busReview!: BusReview;
  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busScheduleTemplatesService: BusScheduleTemplatesService,
    private busStationsService: BusStationsService,
    private busRoutesService: BusRoutesService,
    private busesService: BusesService,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
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

    let request = [findAllBusStations, findAllBusRoutes, findAllBuses];
    combineLatest(request).subscribe(async ([busStations, busRoutes, buses]) => {
      this.busStations = busStations;
      this.busRoutes = busRoutes;
      this.buses = buses;
      this.initForm();
    });
  }

  async initForm() {
    const { name = '', busId = '', busRouteId, busRoute } = this.busScheduleTemplate || {};

    this.busScheduleTemplateDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      busId: [busId, [Validators.required]],
      busRouteId: [busRouteId, [Validators.required]],
      busRoute: this.fb.group({
        name: [],
        breakPoints: this.fb.array([]),
        distance: [],
        distanceTime: []
      })
    });
  }

  get breakPoints(): FormArray {
    return this.busScheduleTemplateDetailForm.get('busRoute.breakPoints') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  drop(event: CdkDragDrop<BusStation[]>) {
    moveItemInArray(this.busStations, event.previousIndex, event.currentIndex);
  }

  async chooseBus(busId: string) {
    this.busReview = this.buses.find((bus: Bus) => bus._id === busId) as BusReview;
    this.busReview.isLoading = true
    let findAllBusServices = this.busServicesService.findAll(true);
    let findBusTypeById = this.busTypesService.findOne(this.busReview.busTypeId, true);

    const request = [findAllBusServices, findBusTypeById];
    combineLatest(request).subscribe(async ([busServices, busType]) => {
      const serviceOfBus = busServices.filter((service: BusService) =>
        this.busReview.busServiceIds.includes(service._id)
      );
      this.busReview.busServices = serviceOfBus;
      this.busReview.busType = busType;
      this.busReview.isLoading = false;
    })
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

  createBreakPoint(breakPoint: BusRouteScheduleBreakPoints): FormGroup {


    return this.fb.group({
      busStationId: [breakPoint.busStationId],
      timeOffset: ['', [Validators.required]]
    });
  }

  getBusStationByIdInform(idx: number) {
    const busStationId = this.breakPoints.controls[idx].get('busStationId')?.value;
    const busStation = this.busStations.find((busStation: BusStation) => busStation._id === busStationId) as BusStation;
    return busStation;

  }

  onSubmit() {
    if (!this.busScheduleTemplateDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleTemplateDetailForm);
      return;
    }

    const data = this.busScheduleTemplateDetailForm.getRawValue();
    const busSchedule2Create: BusScheduleTemplate2Create = {
      ...data
    };
    if (this.busScheduleTemplate) {
      const busSchedule2Update = {
        ...busSchedule2Create,
        _id: this.busScheduleTemplate._id, // Thêm thuộc tính _id
      };

      this.updateBus(busSchedule2Update);
      return;
    }

    this.createBus(busSchedule2Create);
  }

  updateBus(busSchedule2Update: BusScheduleTemplate2Update) {
    this.busScheduleTemplatesService.updateBusScheduleTemplate(busSchedule2Update).subscribe({
      next: (res: BusScheduleTemplate) => {
        if (res) {
          const updatedState = { ...history.state, busSchedule: JSON.stringify(res) };
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
