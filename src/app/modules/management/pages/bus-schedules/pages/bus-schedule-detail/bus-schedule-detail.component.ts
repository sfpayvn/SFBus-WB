
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
import { BusTemplate } from '../../../bus-templates/model/bus-template.model';
import { BusTemplatesService } from '../../../bus-templates/service/bus-templates.servive';

interface BusTemplateReview extends BusTemplate {
  busServices: BusService[],
  busType: BusType,
  isLoading: boolean
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

  busSchedule!: BusSchedule;

  busRoutes: BusRoute[] = [];
  busScheduleTemplates: BusScheduleTemplate[] = [];

  busProvinces: BusProvince[] = [];

  busStations: BusStation[] = [];

  busTemplates: BusTemplate[] = [];

  buses: Bus[] = [];
  filterdBuses: Bus[] = [];

  busReview!: Bus;
  busTemplateReview!: BusTemplateReview;

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
    private busTemplatesService: BusTemplatesService

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
    let findAllBusTemplates = this.busTemplatesService.findAll();

    let request = [findAllBusProvinces, findAllBusStations, findAllBusRoutes, findAllBuses, findAllBusScheduleTemplates, findAllBusTemplates];
    combineLatest(request).subscribe(async ([busProvinces, busStations, busRoutes, buses, busScheduleTemplates, busTemplates]) => {
      this.busProvinces = busProvinces;
      this.busStations = busStations;
      this.busRoutes = busRoutes;
      this.buses = buses;
      this.busScheduleTemplates = busScheduleTemplates;
      this.busTemplates = busTemplates;
      this.initForm();
    });
  }

  async initForm() {
    const { name = '', busId = '', bus = null, busTemplateId = '', busTemplate = null, busRouteId = '',
      busRoute = null, price = '', busScheduleTemplateId = '', busLayoutTemplateId = '' } = this.busSchedule || {};

    this.busScheduleDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      busId: [busId],
      bus: [bus],
      busTemplateId: [busTemplateId],
      busTemplate: [busTemplate],
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
        this.breakPoints.push(this.createBreakPoint(breakPoint));
      }
    }

    if (busTemplateId) {
      this.filterdBuses = await this.buses.filter((bus: Bus) => bus.busTemplateId == busTemplateId);
    }
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
    const bus = await this.buses.find((bus: Bus) => bus._id == busId) as Bus;

    this.busScheduleDetailForm.get('bus')?.patchValue(bus);
    this.busReview = bus;
  }

  async chooseBusTemplate(busTemplateId: string) {
    const busTemplate = await this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id === busTemplateId) as BusTemplate;
    this.busTemplateReview = busTemplate as BusTemplateReview;

    this.busTemplateReview.isLoading = true;

    this.filterdBuses = await this.buses.filter((bus: Bus) => bus.busTemplateId == busTemplateId);

    this.busScheduleDetailForm.get('busId')?.patchValue('');

    this.busScheduleDetailForm.get('busLayoutTemplateId')?.patchValue(busTemplate.busLayoutTemplateId);
    this.busScheduleDetailForm.get('busTemplate')?.patchValue(busTemplate);

    let findAllBusServices = this.busServicesService.findAll(true);
    let findBusTypeById = this.busTypesService.findOne(this.busTemplateReview.busTypeId, true);

    const request = [findAllBusServices, findBusTypeById];
    combineLatest(request).subscribe(async ([busServices, busType]) => {
      const serviceOfBus = busServices.filter((service: BusService) =>
        this.busTemplateReview.busServiceIds.includes(service._id)
      );
      this.busTemplateReview.busServices = serviceOfBus;
      this.busTemplateReview.busType = busType;
      this.busTemplateReview.isLoading = false;
    })
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


    await this.chooseBus(busScheduleTemplate.busId);
    await this.chooseRoute(busScheduleTemplate.busRouteId, busScheduleTemplate.busRoute);
    await this.chooseBusTemplate(busScheduleTemplate.busTemplateId);

    busScheduleDetailForm.get('busId')?.patchValue(busScheduleTemplate.busId);

  }

  resetBusScheduleTemplate() {
    const busScheduleDetailForm = this.busScheduleDetailForm as FormGroup;
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
    console.log("🚀 ~ onSubmit ~ this.busScheduleDetailForm:", this.busScheduleDetailForm)
    if (!this.busScheduleDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleDetailForm);
      return;
    }

    const data = this.busScheduleDetailForm.getRawValue();
    const busSchedule2Create: BusSchedule2Create = {
      ...data
    };
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

