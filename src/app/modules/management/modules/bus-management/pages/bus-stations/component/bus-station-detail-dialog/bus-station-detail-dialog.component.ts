import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';
import { BusStation, BusStation2Create } from '../../model/bus-station.model';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';

export interface DialogData {
  title: string;
  busStation: BusStation;
  busProvices: BusProvince[];
}

@Component({
  selector: 'app-bus-station-detail-dialog',
  templateUrl: './bus-station-detail-dialog.component.html',
  styleUrl: './bus-station-detail-dialog.component.scss',
  standalone: false,
})
export class BusStationDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusStationDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busStation: BusStation = this.data.busStation ?? new BusStation();
  busProvices: BusProvince[] = this.data.busProvices ?? [];

  busStationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
    private busProvincesService: BusProvincesService,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  private initData() {
    this.busProvincesService.findAll().subscribe({
      next: (res: BusProvince[]) => {
        if (res) {
          this.busProvices = res;
          this.initForm();
        }
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
      },
    });
  }

  private async initForm() {
    const busProvice = await this.busProvices.find((busProvice) => busProvice._id === this.busStation.provinceId);

    const { name, detailAddress, location } = this.busStation;

    this.busStationForm = this.fb.group({
      name: [{ value: name, disabled: this.defaultFlagService.isDefault(this.busStation) }, [Validators.required]],
      detailAddress: [{ value: detailAddress, disabled: this.defaultFlagService.isDefault(this.busStation) }],
      location: [{ value: location, disabled: this.defaultFlagService.isDefault(this.busStation) }],
      busProviceId: [
        { value: busProvice?._id, disabled: this.defaultFlagService.isDefault(this.busStation) },
        [Validators.required],
      ],
    });
  }

  get f() {
    return this.busStationForm.controls;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  clearFormValue(controlName: string) {
    if (this.defaultFlagService.isDefault(this.busStation)) return;

    const control = this.busStationForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.busStationForm.valid) {
      this.utils.markFormGroupTouched(this.busStationForm);
      return;
    }
    const { name, busProviceId } = this.busStationForm.getRawValue();
    const data = {
      ...this.busStation,
      name,
      provinceId: busProviceId,
    };
    this.dialogRef.close(data);
  }
}
