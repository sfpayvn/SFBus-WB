
import { Component, OnInit } from '@angular/core';
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
import { BusRouteScheduleBreakPoints, BusSchedule, BusSchedule2Create, BusSchedule2Update, BusScheduleRoute } from '../../model/bus-schedule.model';
import { BusScheduleTemplatesService } from '../../../bus-schedule-templates/service/bus-schedule-templates.servive';
import { BusRouteScheduleTemplateBreakPoints, BusScheduleTemplate, BusScheduleTemplateRoute } from '../../../bus-schedule-templates/model/bus-schedule-template.model';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';

interface BusReview extends Bus {
  busServices: BusService[],
  busType: BusType,
  isLoading: boolean
}

@Component({
  selector: 'app-bus-schedule-detail.',
  templateUrl: './bus-schedule-detail..component.html',
  styleUrl: './bus-schedule-detail..component.scss',
  standalone: false
})
export class BusScheduleDetailComponent
  implements OnInit {

  busScheduleDetailForm!: FormGroup;

  busSchedule!: BusSchedule;

  busRoutes: BusRoute[] = [];
  busScheduleTemplates: BusScheduleTemplate[] = [];

  busProvinces: BusProvince[] = [];

  busStations: BusStation[] = [];

  buses: Bus[] = [];

  busReview!: BusReview;
  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busSchedulesService: BusSchedulesService,
    private busStationsService: BusStationsService,
    private busRoutesService: BusRoutesService,
    private busesService: BusesService,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
    private busScheduleTemplatesService: BusScheduleTemplatesService,
    private busProvincesService: BusProvincesService,

  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.busSchedule = params["busSchedule"] ? JSON.parse(params["busSchedule"]) : null;
    }
  }

  initData() {
    let findAllBusProvinces = this.busProvincesService.findAll();
    let findAllBusStations = this.busStationsService.findAll();
    let findAllBusRoutes = this.busRoutesService.findAll();
    let findAllBuses = this.busesService.findAll();
    let findAllBusScheduleTemplates = this.busScheduleTemplatesService.findAll();

    let request = [findAllBusProvinces, findAllBusStations, findAllBusRoutes, findAllBuses, findAllBusScheduleTemplates];
    combineLatest(request).subscribe(async ([busProvinces, busStations, busRoutes, buses, busScheduleTemplates]) => {
      this.busProvinces = busProvinces;
      this.busStations = busStations;
      this.busRoutes = busRoutes;
      this.buses = buses;
      this.busScheduleTemplates = busScheduleTemplates;
      this.initForm();
    });
  }

  async initForm() {
    const { name = '', busId = '', bus = null, busRouteId = '', busRoute = null, price = '', busScheduleTemplateId = '', busLayoutTemplateId = '' } = this.busSchedule || {};
    console.log("🚀 ~ initForm ~ this.busSchedule:", this.busSchedule)

    this.busScheduleDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      busId: [busId, [Validators.required]],
      bus: [bus],
      busRouteId: [busRouteId, [Validators.required]],
      busRoute: this.fb.group({
        name: [busRoute?.name || ''],
        breakPoints: this.fb.array([]),
        distance: [busRoute?.distance || ''],
        distanceTime: [busRoute?.distanceTime || '']
      }),
      busScheduleTemplateId: [busScheduleTemplateId],
      busLayoutTemplateId: [busLayoutTemplateId, [Validators.required]],
      price: [price, [Validators.required]],
    });

    if (busRoute) {
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(await this.createBreakPoint(breakPoint));
      }
    }
    console.log("🚀 ~ initForm ~ this.busScheduleDetailForm:", this.busScheduleDetailForm)
  }

  get breakPoints(): FormArray {
    return this.busScheduleDetailForm.get('busRoute.breakPoints') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  drop(event: CdkDragDrop<BusStation[]>) {
    moveItemInArray(this.busStations, event.previousIndex, event.currentIndex);
  }

  async chooseBus(busId: string) {
    const bus = this.buses.find((bus: Bus) => bus._id === busId) as Bus;
    this.busReview = bus as BusReview;
    this.busReview.isLoading = true
    let findAllBusServices = this.busServicesService.findAll(true);
    let findBusTypeById = this.busTypesService.findOne(this.busReview.busTypeId, true);

    const busScheduleDetailForm = this.busScheduleDetailForm as FormGroup;
    busScheduleDetailForm.get('bus')?.patchValue(bus);
    busScheduleDetailForm.get('busLayoutTemplateId')?.patchValue(bus.busLayoutTemplateId);

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

  async chooseRoute(busRouteId: string, busScheduleTemplateRoute?: BusScheduleTemplateRoute) {
    this.breakPoints.clear();
    const busRouteForm = this.busScheduleDetailForm.get('busRoute') as FormGroup;

    let busRoute: any;
    busRoute = this.busRoutes.find((busRoute: BusRoute) => busRoute._id === busRouteId) as BusScheduleTemplateRoute;
    if (busScheduleTemplateRoute) {
      busRoute = busScheduleTemplateRoute;
    }

    busRouteForm.get('name')?.patchValue(busRoute.name);
    busRouteForm.get('distance')?.patchValue(busRoute.distance);
    busRouteForm.get('distanceTime')?.patchValue(busRoute.distanceTime);


    if (busRoute) {
      for (const breakPoint of busRoute.breakPoints) {
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }
  }

  chooseBusScheduleTemplate(busScheduleTemplateId: string) {
    const busScheduleTemplate = this.busScheduleTemplates.find((busScheduleTemplate: BusScheduleTemplate) => busScheduleTemplate._id === busScheduleTemplateId) as BusScheduleTemplate;
    if (!busScheduleTemplate) {
      return;
    }

    const busScheduleDetailForm = this.busScheduleDetailForm as FormGroup;

    busScheduleDetailForm.get('name')?.patchValue(busScheduleTemplate.name);
    busScheduleDetailForm.get('price')?.patchValue(busScheduleTemplate.price);
    busScheduleDetailForm.get('busId')?.patchValue(busScheduleTemplate.busId);
    busScheduleDetailForm.get('busRouteId')?.patchValue(busScheduleTemplate.busRouteId);

    this.chooseBus(busScheduleTemplate.busId);
    this.chooseRoute(busScheduleTemplate.busRouteId, busScheduleTemplate.busRoute);

  }

  resetBusScheduleTemplate() {
    const busScheduleDetailForm = this.busScheduleDetailForm as FormGroup;
    busScheduleDetailForm.reset();
  }

  async createBreakPoint(breakPoint: BusRouteScheduleBreakPoints): Promise<FormGroup> {
    const { name = '', detailAddress = '', location = '', provinceId = '' } = await this.busStations.find((busStation: BusStation) => busStation._id === breakPoint.busStationId) as BusStation;
    const province = await this.busProvinces.find((busProvince: BusProvince) => busProvince._id === provinceId) as BusProvince;

    let timeSchedule = breakPoint.timeSchedule;
    if (!timeSchedule) {
      timeSchedule = this.calculateTimeSchedule(breakPoint.timeOffset)
    }

    return this.fb.group({
      busStationId: [breakPoint.busStationId],
      timeSchedule: [timeSchedule],
      name: [name],
      detailAddress: [detailAddress],
      location: [location],
      provinceId: [provinceId],
      province: [province],
    });
  }

  calculateTimeSchedule(offsetTime: string): string {
    const currentDate = new Date(); // Thời gian hiện tại

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

  onSubmit() {
    if (!this.busScheduleDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleDetailForm);
      return;
    }

    const data = this.busScheduleDetailForm.getRawValue();
    const busSchedule2Create: BusSchedule2Create = {
      ...data
    };
    console.log("🚀 ~ onSubmit ~ data:", data)
    if (this.busSchedule) {
      const busSchedule2Update = {
        ...busSchedule2Create,
        _id: this.busSchedule._id, // Thêm thuộc tính _id
      };

      this.updateBus(busSchedule2Update);
      return;
    }

    this.createBus(busSchedule2Create);
  }

  updateBus(busSchedule2Update: BusSchedule2Update) {
    this.busSchedulesService.updateBusSchedule(busSchedule2Update).subscribe({
      next: (res: BusSchedule) => {
        if (res) {
          const updatedState = { ...history.state, busSchedule: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
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
          toast.success('Bus Route added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}

