import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusProvince2Create } from '../../model/bus-province.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import _ from 'lodash';

export interface DialogData {
  title: string;
  busProvince: BusProvince2Create;
  busStations: BusStation[];
}

export class BusProvince2CreateUI extends BusProvince2Create {
  busStations: BusStation[] = [];
}

@Component({
  selector: 'app-create-bus-province-dialog',
  templateUrl: './create-bus-province-dialog.component.html',
  styleUrls: ['./create-bus-province-dialog.component.scss'],
  standalone: false
})
export class CreateEditBusProvinceDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditBusProvinceDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busProvince: BusProvince2CreateUI = { ...new BusProvince2CreateUI(), ...this.data.busProvince };
  busStations: BusStation[] = this.data.busStations ?? new BusStation();

  busProvinceForm!: FormGroup;
  isRotated = false;

  filteredBusStations: BusStation[] = [];
  filteredBusProvinceStations: BusStation[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.initForm();

  }

  private async initForm() {
    this.busProvinceForm = this.fb.group({
      name: [this.busProvince.name, [Validators.required]],
    });
  }

  async initData() {
    this.busStations = await _.difference(this.busStations, this.busProvince.busStations);
    this.busStations = this.busStations.map(busStation => ({
      ...busStation,
      selected: false
    }));
    this.filteredBusStations = this.busStations;
    this.filteredBusProvinceStations = this.busProvince.busStations;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.busProvinceForm.valid) {
      this.utils.markFormGroupTouched(this.busProvinceForm);
      return;
    }
    const { name } = this.busProvinceForm.getRawValue();

    const busStationsOfProvince = this.filteredBusProvinceStations.map(busStation => ({
      ...busStation,
      provinceId: this.busProvince._id
    }));


    const busStationNotAsssign = _.difference(this.busProvince.busStations, this.filteredBusProvinceStations).map(busStation => ({
      ...busStation,
      provinceId: ''
    }));

    const data = {
      busProvince: {
        ...this.busProvince,
        name,
      },
      busStations2Update: _.union(busStationsOfProvince, busStationNotAsssign)
    }
    this.dialogRef.close(data);
  }

  searchBusStations($event: any) {
    const keyword = $event.target.value;;

    const lowerKeyword = keyword.toLowerCase();
    this.filteredBusStations = this.busStations.filter(station =>
      station.name.toLowerCase().includes(lowerKeyword)
    );
  }

  searchBusProvinceStations($event: any) {
    const keyword = $event.target.value;;

    const lowerKeyword = keyword.toLowerCase();
    this.filteredBusProvinceStations = this.busProvince.busStations.filter(station =>
      station.name.toLowerCase().includes(lowerKeyword)
    );
  }

  toggleRotationBusStation() {
    this.isRotated = !this.isRotated;

    // Lọc các phần tử được chọn từ busProvince.busStations và busStations
    let busStationsOfProvince = this.filteredBusProvinceStations?.filter(b => b.selected) || [];
    let busStations = this.filteredBusStations?.filter(bt => bt.selected) || [];

    // Chuyển các phần tử đã chọn đến đầu mảng
    this.filteredBusStations = [...busStationsOfProvince, ...(this.filteredBusStations?.filter(bt => !bt.selected) || [])];
    this.filteredBusProvinceStations = [...busStations, ...(this.filteredBusProvinceStations?.filter(b => !b.selected) || [])];

    // Đặt tất cả selected về false
    this.filteredBusStations = this.filteredBusStations.map(bt => ({ ...bt, selected: false }));
    this.filteredBusProvinceStations = this.filteredBusProvinceStations.map(b => ({
      ...b, selected: false
    }));
  }


  toggleBusStation(busStation: any) {
    busStation.selected = !busStation.selected;
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
