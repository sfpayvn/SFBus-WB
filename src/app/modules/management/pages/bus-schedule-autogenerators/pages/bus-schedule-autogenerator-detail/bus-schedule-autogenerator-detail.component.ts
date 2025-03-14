
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { BusScheduleAutoGeneratorsService } from '../../service/bus-schedule-autogenerators.servive';
import { BusScheduleAutoGenerator, BusScheduleAutoGenerator2Create, BusScheduleAutoGenerator2Update } from '../../model/bus-schedule-autogenerator.model';


@Component({
  selector: 'app-bus-schedule-autogenerator-detail',
  templateUrl: './bus-schedule-autogenerator-detail.component.html',
  styleUrl: './bus-schedule-autogenerator-detail.component.scss',
  standalone: false
})
export class BusScheduleAutoGeneratorDetailComponent implements OnInit {

  busScheduleAutoGeneratorDetailForm!: FormGroup;

  busScheduleAutoGenerator!: BusScheduleAutoGenerator;
  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busScheduleAutoGeneratorsService: BusScheduleAutoGeneratorsService,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params) {
    }
  }

  initData() {

  }

  async initForm() {
    const { name = '' } = this.busScheduleAutoGenerator || {};

    this.busScheduleAutoGeneratorDetailForm = this.fb.group({
      name: [name, [Validators.required]],
    });
  }

  get breakPoints(): FormArray {
    return this.busScheduleAutoGeneratorDetailForm.get('busRoute.breakPoints') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  onSubmit() {
    console.log("🚀 ~ onSubmit ~ this.busScheduleAutoGeneratorDetailForm:", this.busScheduleAutoGeneratorDetailForm)
    if (!this.busScheduleAutoGeneratorDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busScheduleAutoGeneratorDetailForm);
      return;
    }

    const data = this.busScheduleAutoGeneratorDetailForm.getRawValue();
    const busScheduleAutoGenerator2Create: BusScheduleAutoGenerator2Create = {
      ...data
    };
    if (this.busScheduleAutoGenerator) {
      const busScheduleAutoGenerator2Update = {
        ...busScheduleAutoGenerator2Create,
        _id: this.busScheduleAutoGenerator._id, // Thêm thuộc tính _id
      };

      this.updateBus(busScheduleAutoGenerator2Update);
      return;
    }

    this.createBus(busScheduleAutoGenerator2Create);
  }

  updateBus(busScheduleAutoGenerator2Update: BusScheduleAutoGenerator2Update) {
    this.busScheduleAutoGeneratorsService.updateBusScheduleAutoGenerator(busScheduleAutoGenerator2Update).subscribe({
      next: (res: BusScheduleAutoGenerator) => {
        if (res) {
          const updatedState = { ...history.state, busScheduleAutoGenerator: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Bus Route update successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBus(busScheduleAutoGenerator2Create: BusScheduleAutoGenerator2Create) {
    this.busScheduleAutoGeneratorsService.createBusScheduleAutoGenerator(busScheduleAutoGenerator2Create).subscribe({
      next: (res: BusScheduleAutoGenerator) => {
        if (res) {
          toast.success('Bus Route added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}

