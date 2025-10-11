import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusProvince, BusProvince2Create } from '../../model/bus-province.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import _ from 'lodash';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

export interface DialogData {
  title: string;
  busProvince: BusProvince2Create;
  busStations: BusStation[];
}

export class BusProvinceUI extends BusProvince {
  busStations: BusStation[] = [];
}

@Component({
  selector: 'app-create-bus-province-dialog',
  templateUrl: './bus-province-detail-dialog.component.html',
  styleUrls: ['./bus-province-detail-dialog.component.scss'],
  standalone: false,
})
export class BusProvinceDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusProvinceDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busProvince: BusProvinceUI = { ...new BusProvinceUI(), ...this.data.busProvince };
  busStations: BusStation[] = this.data.busStations ?? new BusStation();

  busProvinceForm!: FormGroup;
  isRotated = false;

  filteredBusStations: BusStation[] = [];
  filteredBusProvinceStations: BusStation[] = [];

  constructor(private fb: FormBuilder, private utils: Utils, public defaultFlagService: DefaultFlagService) {}

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.initForm();
  }

  private async initForm() {
    const { name } = this.busProvince;
    this.busProvinceForm = this.fb.group({
      name: [{ value: name, disabled: this.defaultFlagService.isDefault(this.busProvince) }, [Validators.required]],
    });
  }

  get f() {
    return this.busProvinceForm.controls;
  }

  async initData() {
    this.busStations = await _.difference(this.busStations, this.busProvince.busStations);
    this.busStations = this.busStations.map((busStation) => ({
      ...busStation,
      selected: false,
    }));
    this.filteredBusStations = this.busStations;
    this.filteredBusProvinceStations = this.busProvince.busStations;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  clearFormValue(controlName: string) {
    if (this.defaultFlagService.isDefault(this.busProvince)) return;

    const control = this.busProvinceForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.busProvinceForm.valid) {
      this.utils.markFormGroupTouched(this.busProvinceForm);
      return;
    }
    const { name } = this.busProvinceForm.getRawValue();

    const busStationsOfProvince = this.filteredBusProvinceStations.map((busStation) => ({
      ...busStation,
      provinceId: this.busProvince._id,
    }));

    const busStationNotAsssign = _.difference(this.busProvince.busStations, this.filteredBusProvinceStations).map(
      (busStation) => ({
        ...busStation,
        provinceId: '',
      }),
    );

    const data = {
      busProvince: {
        ...this.busProvince,
        name,
      },
      busStations2Update: _.union(busStationsOfProvince, busStationNotAsssign),
    };
    this.dialogRef.close(data);
  }

  searchBusStations($event: any) {
    const keyword = $event.target.value;

    const lowerKeyword = keyword.toLowerCase();
    this.filteredBusStations = this.busStations.filter((station) => station.name.toLowerCase().includes(lowerKeyword));
  }

  searchBusProvinceStations($event: any) {
    const keyword = $event.target.value;

    const lowerKeyword = keyword.toLowerCase();
    this.filteredBusProvinceStations = this.busProvince.busStations.filter((station) =>
      station.name.toLowerCase().includes(lowerKeyword),
    );
  }

  toggleRotationBusStation() {
    this.isRotated = !this.isRotated;

    // Tách riêng các phần tử được chọn và không được chọn từ mỗi mảng
    const selectedProvince = this.filteredBusProvinceStations?.filter((b) => b.selected) || [];
    const unselectedProvince = this.filteredBusProvinceStations?.filter((b) => !b.selected) || [];

    const selectedStations = this.filteredBusStations?.filter((b) => b.selected) || [];
    const unselectedStations = this.filteredBusStations?.filter((b) => !b.selected) || [];

    // Đổi chỗ các phần được chọn giữa hai mảng:
    // - Mảng filteredBusStations nhận phần được chọn từ mảng busProvinceStations, sau đó là phần chưa chọn của chính nó.
    // - Mảng filteredBusProvinceStations nhận phần được chọn từ mảng busStations, sau đó là phần chưa chọn của chính nó.
    this.filteredBusStations = [...selectedProvince, ...unselectedStations];
    this.filteredBusProvinceStations = [...selectedStations, ...unselectedProvince];

    // Reset trạng thái selected cho tất cả các phần tử
    this.filteredBusStations = this.filteredBusStations.map((b) => ({ ...b, selected: false }));
    this.filteredBusProvinceStations = this.filteredBusProvinceStations.map((b) => ({ ...b, selected: false }));
  }

  // toggleRotationBusStation() {
  //   // Đảo trạng thái lật của bus station
  //   this.isRotated = !this.isRotated;

  //   // Sắp xếp lại filteredBusStations: Các phần tử selected đặt lên đầu, phần còn lại giữ nguyên thứ tự
  //   const selectedBusStations = this.filteredBusStations?.filter(bt => bt.selected) || [];
  //   const unselectedBusStations = this.filteredBusStations?.filter(bt => !bt.selected) || [];
  //   this.filteredBusStations = [...selectedBusStations, ...unselectedBusStations];

  //   // Sắp xếp lại filteredBusProvinceStations theo cùng cách
  //   const selectedBusProvinceStations = this.filteredBusProvinceStations?.filter(b => b.selected) || [];
  //   const unselectedBusProvinceStations = this.filteredBusProvinceStations?.filter(b => !b.selected) || [];
  //   this.filteredBusProvinceStations = [...selectedBusProvinceStations, ...unselectedBusProvinceStations];

  //   // Nếu cần, reset lại flag selected cho tất cả các phần tử
  //   this.filteredBusStations = this.filteredBusStations.map(bt => ({ ...bt, selected: false }));
  //   this.filteredBusProvinceStations = this.filteredBusProvinceStations.map(b => ({ ...b, selected: false }));
  // }

  toggleBusStation(busStation: any) {
    if (this.defaultFlagService.isDefault(busStation)) return;
    busStation.selected = !busStation.selected;
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
