import { Component, OnInit } from '@angular/core';
import { BusSchedule, BusSchedule2Create, BusSchedule2Update } from '../../model/bus-schedule.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common'
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BusSchedulesService } from '../../service/bus-schedules.servive';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { BusStationsService } from '../../../bus-stations/service/bus-stations.servive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';

@Component({
  selector: 'app-bus-schedule-detail.',
  templateUrl: './bus-schedule-detail..component.html',
  styleUrl: './bus-schedule-detail..component.scss',
  standalone: false
})
export class BusScheduleDetailComponent implements OnInit {

  busScheduleDetailForm!: FormGroup;

  busSchedule!: BusSchedule;

  busStations: BusStation[] = [];
  busProvinces: BusProvince[] = [];

  filteredProvinces: any[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busSchedulesService: BusSchedulesService,
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
      this.busSchedule = params["busSchedule"] ? JSON.parse(params["busSchedule"]) : null;
      console.log("🚀 ~ BusScheduleDetailComponent ~ getQueryParams ~ this.busSchedule:", this.busSchedule)
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
    const { name = '' } = this.busSchedule || {};

    this.busScheduleDetailForm = this.fb.group({
      name: [name, [Validators.required]]
    });
  }



  createBreakPoint(busStationId: string = ''): FormGroup {
    return this.fb.group({
      busStationId: [busStationId, Validators.required],
    });
  }

  addBreakPoint(busStationId: string = ''): void {
    const breakPoints = this.busScheduleDetailForm.get('breakPoints') as FormArray;
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
    const breakPoints = this.busScheduleDetailForm.get('breakPoints') as FormArray;

    if (index >= 0 && index < breakPoints.length) {
      breakPoints.removeAt(index);
    } else {
      console.warn(`Invalid index ${index}. Cannot remove breakpoint.`);
    }
  }


  get breakPoints(): FormArray {
    return this.busScheduleDetailForm.get('breakPoints') as FormArray;
  }

  checkBreakPointsErrors() {
    const breakPoints = this.busScheduleDetailForm?.get('breakPoints') as FormArray;
    return breakPoints?.controls?.some((control: any) => control?.get('busStationId')?.errors?.['required'] === true);
  }

  checkBreakPointsDuplicateErrors(): boolean {
    const breakPoints = this.busScheduleDetailForm?.get('breakPoints') as FormArray;
    const busStationIds = breakPoints?.controls
      .map(control => control.get('busStationId')?.value)
      .filter(id => id && id.trim() !== ''); // Filter out empty or invalid values

    return busStationIds.some((id, index) => busStationIds.indexOf(id) !== index);
  }

  backPage() {
    this.location.back();
  }

  drop(event: CdkDragDrop<BusStation[]>) {
    moveItemInArray(this.busStations, event.previousIndex, event.currentIndex);
  }


  onSubmit() {
    if (!this.busScheduleDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleDetailForm);
      return;
    }

    const data = this.busScheduleDetailForm.getRawValue();
    const busSchedule2Create: BusSchedule2Create = {
      ...data
    }
    console.log("🚀 ~ BusScheduleDetailComponent ~ onSubmit ~ busSchedule2Create:", busSchedule2Create)
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
