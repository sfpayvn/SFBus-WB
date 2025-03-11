import { Component, OnInit } from '@angular/core';
import { BusRoute, BusRoute2Create, BusRoute2Update } from '../../model/bus-route.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common'
import { BusServicesService } from '../../../bus-services/service/bus-services.servive';
import { combineLatest } from 'rxjs';
import { BusTypesService } from '../../../bus-types/service/bus-types.servive';
import { BusTemplatesService } from '../../../bus-templates/service/bus-templates.servive';
import { BusTemplate } from '../../../bus-templates/model/bus-template.model';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BusRoutesService } from '../../service/bus-routes.servive';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { BusStationsService } from '../../../bus-stations/service/bus-stations.servive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';

@Component({
  selector: 'app-bus-route-detail',
  templateUrl: './bus-route-detail.component.html',
  styleUrl: './bus-route-detail.component.scss',
  standalone: false
})
export class BusRouteDetailComponent implements OnInit {

  busRouteDetailForm!: FormGroup;

  busRoute!: BusRoute;

  busStations: BusStation[] = [];
  busProvinces: BusProvince[] = [];

  filteredProvinces: any[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busRoutesService: BusRoutesService,
    private busStationsService: BusStationsService,
    private busProvincesService: BusProvincesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }


  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.busRoute = params["busRoute"] ? JSON.parse(params["busRoute"]) : null;
      console.log("🚀 ~ BusRouteDetailComponent ~ getQueryParams ~ this.busRoute:", this.busRoute)
    }
  }

  initData() {
    let findAllBusStations = this.busStationsService.findAll();
    let findAllBusProvinces = this.busProvincesService.findAll();


    let request = [findAllBusStations, findAllBusProvinces];
    combineLatest(request).subscribe(async ([busStations, busProvinces]) => {
      this.busStations = busStations;
      this.busProvinces = busProvinces;
      this.filterProvinces();
      this.initForm();
    });
  }

  async initForm() {
    const { name = '', distance = 0, distanceTime = '', price = 0, breakPoints = [] } = this.busRoute || {};

    this.busRouteDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      distance: [distance, [Validators.required]],
      distanceTime: [distanceTime, [Validators.required]],
      price: [price, [Validators.required]],
      breakPoints: this.fb.array(breakPoints.length > 0
        ? breakPoints.map(bp => this.createBreakPoint(bp.busStationId))
        : [this.createBreakPoint(), this.createBreakPoint()] // Add 2 default breakpoints if none exist
      )
    });
  }



  createBreakPoint(busStationId: string = ''): FormGroup {
    return this.fb.group({
      busStationId: [busStationId, Validators.required],
    });
  }

  addBreakPoint(busStationId: string = ''): void {
    const breakPoints = this.busRouteDetailForm.get('breakPoints') as FormArray;
    breakPoints.push(this.createBreakPoint(busStationId));
  }

  filterProvinces() {
    this.filteredProvinces = this.busProvinces
      // Lọc bỏ các tỉnh không có bus station
      .filter((province) =>
        this.busStations.some((busStation: any) => busStation.provinceId === province._id)
      )
      .map((province) => {
        const matchingBusStations = this.busStations.filter(
          (busStation: any) => busStation.provinceId === province._id
        );
        return {
          ...province,
          busStations: matchingBusStations, // Không lặp lại
        };
      });
  }

  removeBreakPoint(index: number): void {
    const breakPoints = this.busRouteDetailForm.get('breakPoints') as FormArray;

    if (index >= 0 && index < breakPoints.length) {
      breakPoints.removeAt(index);
    } else {
      console.warn(`Invalid index ${index}. Cannot remove breakpoint.`);
    }
  }


  get breakPoints(): FormArray {
    return this.busRouteDetailForm.get('breakPoints') as FormArray;
  }

  checkBreakPointsErrors() {
    const breakPoints = this.busRouteDetailForm?.get('breakPoints') as FormArray;
    return breakPoints?.controls?.some((control: any) => control?.get('busStationId')?.errors?.['required'] === true);
  }

  checkBreakPointsDuplicateErrors(): boolean {
    const breakPoints = this.busRouteDetailForm?.get('breakPoints') as FormArray;
    const busStationIds = breakPoints?.controls
      .map(control => control.get('busStationId')?.value)
      .filter(id => id && id.trim() !== ''); // Filter out empty or invalid values

    return busStationIds.some((id, index) => busStationIds.indexOf(id) !== index);
  }

  backPage() {
    this.location.back();
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.breakPoints.controls, event.previousIndex, event.currentIndex);
  }


  onSubmit() {
    if (!this.busRouteDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busRouteDetailForm);
      return;
    }

    const data = this.busRouteDetailForm.getRawValue();
    const busRoute2Create: BusRoute2Create = {
      ...data
    }
    console.log("🚀 ~ BusRouteDetailComponent ~ onSubmit ~ busRoute2Create:", busRoute2Create)
    if (this.busRoute) {
      const busRoute2Update = {
        ...busRoute2Create,
        _id: this.busRoute._id, // Thêm thuộc tính _id
      };

      this.updateBus(busRoute2Update);
      return;
    }

    this.createBus(busRoute2Create);
  }

  updateBus(busRoute2Update: BusRoute2Update) {
    this.busRoutesService.updateBusRoute(busRoute2Update).subscribe({
      next: (res: BusRoute) => {
        if (res) {
          const updatedState = { ...history.state, busRoute: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Bus Route update successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBus(busRoute2Create: BusRoute2Create) {
    this.busRoutesService.createBusRoute(busRoute2Create).subscribe({
      next: (res: BusRoute) => {
        if (res) {
          toast.success('Bus Route added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
