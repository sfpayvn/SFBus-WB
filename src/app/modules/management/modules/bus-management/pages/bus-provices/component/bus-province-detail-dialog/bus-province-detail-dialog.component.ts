import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusProvince, BusProvince2Create, BusProvince2Update } from '../../model/bus-province.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { BusStation } from '../../../bus-stations/model/bus-station.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import _ from 'lodash';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';

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

  // Selection tracking with Map for O(1) lookup
  private selectedBusStationsMap: Map<string, boolean> = new Map();
  private selectedProvinceStationsMap: Map<string, boolean> = new Map();

  // Store initial values for change detection
  private initialFormValue: any = null;
  private initialBusProvinceStations: BusStation[] = [];

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private utilsModal: UtilsModal,
    public defaultFlagService: DefaultFlagService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.initForm();
  }

  private async initForm() {
    const { name } = this.busProvince;
    this.busProvinceForm = this.fb.group({
      name: [{ value: name, disabled: this.defaultFlagService.isDefault(this.busProvince) }, [Validators.required]],
    });

    // Store initial values after form is created
    this.initialFormValue = this.busProvinceForm.getRawValue();
    this.initialBusProvinceStations = _.cloneDeep(this.filteredBusProvinceStations);
  }

  get f() {
    return this.busProvinceForm.controls;
  }

  async initData() {
    this.busStations = await _.difference(this.busStations, this.busProvince.busStations);
    this.filteredBusStations = this.busStations;
    this.filteredBusProvinceStations = this.busProvince.busStations;

    // Initialize selection maps
    this.selectedBusStationsMap.clear();
    this.selectedProvinceStationsMap.clear();
  }

  closeDialog(): void {
    if (this.hasChanges()) {
      this.utilsModal
        .openModalConfirm('Lưu ý', 'Bạn có thay đổi chưa lưu, bạn có chắc muốn đóng không?', 'warning')
        .subscribe((result) => {
          if (result) {
            this.dialogRef.close();
            return;
          }
        });
    } else {
      this.dialogRef.close();
    }
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

  hasFormChanged(): boolean {
    const currentFormValue = this.busProvinceForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  hasStationsChanged(): boolean {
    const initialStationIds = this.initialBusProvinceStations.map((s) => s._id).sort();
    const currentStationIds = this.filteredBusProvinceStations.map((s) => s._id).sort();
    return JSON.stringify(initialStationIds) !== JSON.stringify(currentStationIds);
  }

  hasChanges(): boolean {
    return this.hasFormChanged() || this.hasStationsChanged();
  }

  onSubmit() {
    if (!this.busProvinceForm.valid) {
      this.utils.markFormGroupTouched(this.busProvinceForm);
      return;
    }

    // Check if there are any changes
    if (!this.hasChanges()) {
      this.dialogRef.close();
      return;
    }

    const { name } = this.busProvinceForm.getRawValue();

    // Các station mới được thêm vào province (không có trong initial)
    const busStationsAdded = this.filteredBusProvinceStations
      .filter((station) => !this.initialBusProvinceStations.some((initial) => initial._id === station._id))
      .map((busStation) => ({
        ...busStation,
        provinceId: this.busProvince._id,
      }));

    // Các station đã bị loại bỏ khỏi province (có trong initial nhưng không có trong current)
    const busStationsRemoved = this.initialBusProvinceStations
      .filter((initial) => !this.filteredBusProvinceStations.some((current) => current._id === initial._id))
      .map((busStation) => ({
        ...busStation,
        provinceId: '',
      }));

    const busProvince2Update: BusProvince2Update = {
      ...this.busProvince,
      name,
    };

    const data = {
      busProvince: this.hasFormChanged() ? busProvince2Update : null,
      busStations2Update: this.hasStationsChanged() ? _.union(busStationsAdded, busStationsRemoved) : null,
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

    // Tách các station được chọn và không được chọn từ mỗi bên
    const selectedFromProvince: BusStation[] = [];
    const unselectedFromProvince: BusStation[] = [];
    const selectedFromBus: BusStation[] = [];
    const unselectedFromBus: BusStation[] = [];

    // Duyệt province stations
    for (const station of this.filteredBusProvinceStations) {
      if (this.selectedProvinceStationsMap.get(station._id)) {
        selectedFromProvince.push(station);
      } else {
        unselectedFromProvince.push(station);
      }
    }

    // Duyệt bus stations
    for (const station of this.filteredBusStations) {
      if (this.selectedBusStationsMap.get(station._id)) {
        selectedFromBus.push(station);
      } else {
        unselectedFromBus.push(station);
      }
    }

    // Hoán đổi:
    // - filteredBusStations = các station được chọn từ province + các station không chọn của bus
    // - filteredBusProvinceStations = các station được chọn từ bus + các station không chọn của province
    this.filteredBusStations = [...selectedFromProvince, ...unselectedFromBus];
    this.filteredBusProvinceStations = [...selectedFromBus, ...unselectedFromProvince];

    // Swap Maps và clear selections
    const tempMap = this.selectedBusStationsMap;
    this.selectedBusStationsMap = this.selectedProvinceStationsMap;
    this.selectedProvinceStationsMap = tempMap;

    // Clear cả 2 Maps để reset trạng thái selected
    this.selectedBusStationsMap.clear();
    this.selectedProvinceStationsMap.clear();

    this.cdr.detectChanges();
  }

  toggleBusStation(busStation: any, isProvinceStation: boolean = false) {
    if (this.defaultFlagService.isDefault(this.busProvince)) return;

    const targetMap = isProvinceStation ? this.selectedProvinceStationsMap : this.selectedBusStationsMap;
    const currentState = targetMap.get(busStation._id) || false;

    targetMap.set(busStation._id, !currentState);
  }

  isStationSelected(busStation: any, isProvinceStation: boolean = false): boolean {
    const targetMap = isProvinceStation ? this.selectedProvinceStationsMap : this.selectedBusStationsMap;
    return targetMap.get(busStation._id) || false;
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
