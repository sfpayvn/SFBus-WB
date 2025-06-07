import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';
import { BusStation2Create } from '../../model/bus-station.model';

export interface DialogData {
  title: string;
  busStation: BusStation2Create;
  busProvices: BusProvince[];
}

@Component({
  selector: 'app-bus-station-detail-dialog',
  templateUrl: './bus-station-detail-dialog.component.html',
  styleUrl: './bus-station-detail-dialog.component.scss',
  standalone: false
})
export class BusStationDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusStationDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busStation: BusStation2Create = this.data.busStation ?? new BusStation2Create();
  busProvices: BusProvince[] = this.data.busProvices ?? [];


  busStationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private async initForm() {

    const busProvice = this.busProvices.find(busProvice => busProvice._id === this.busStation.provinceId);

    this.busStationForm = this.fb.group({
      name: [this.busStation.name, [Validators.required]],
      busProvice: [busProvice?._id],
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.busStationForm.valid) {
      this.utils.markFormGroupTouched(this.busStationForm);
      return;
    }
    const { name } = this.busStationForm.getRawValue();
    const data = {
      ...this.busStation,
      name
    }
    this.dialogRef.close(data);
  }
}
