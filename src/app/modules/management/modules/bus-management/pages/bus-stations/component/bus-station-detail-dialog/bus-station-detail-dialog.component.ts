import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { BusProvince } from '../../../bus-provices/model/bus-province.model';
import { BusStation, BusStation2Create } from '../../model/bus-station.model';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { BusProvincesService } from '../../../bus-provices/service/bus-provinces.servive';
import _ from 'lodash';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { FilesCenterDialogComponent } from '@rsApp/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from '@rsApp/modules/management/modules/files-center-management/model/file-center.model';
import { toast } from 'ngx-sonner';

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
  busStation: BusStation = this.data?.busStation ?? new BusStation();
  busProvices: BusProvince[] = this.data?.busProvices ?? [];

  busStationForm!: FormGroup;

  busStationImage: string = '';
  busStationImageFile!: File;

  private initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
    private busProvincesService: BusProvincesService,
    private utilsModal: UtilsModal,
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
    let busProvice: BusProvince | undefined;

    if (this.busStation) {
      busProvice = await this.busProvices.find((bp) => bp._id === this.busStation.provinceId);
    }

    const { name = '', detailAddress = '', location = '', imageId = '', image = '', isOffice = false, isActive = true } = this.busStation;

    this.busStationImage = image;

    this.busStationForm = this.fb.group({
      name: [{ value: name, disabled: this.defaultFlagService.isDefault(this.busStation) }, [Validators.required]],
      detailAddress: [{ value: detailAddress, disabled: this.defaultFlagService.isDefault(this.busStation) }],
      location: [{ value: location, disabled: this.defaultFlagService.isDefault(this.busStation) }],
      busProviceId: [
        { value: (busProvice && busProvice._id) || '', disabled: this.defaultFlagService.isDefault(this.busStation) },
        [Validators.required],
      ],
      imageId: [{ value: imageId, disabled: this.defaultFlagService.isDefault(this.busStation) }, Validators.required],
      isOffice: [{ value: isOffice, disabled: this.defaultFlagService.isDefault(this.busStation) }],
      isActive: [{ value: isActive, disabled: this.defaultFlagService.isDefault(this.busStation) }],
    });
    this.initialFormValue = JSON.parse(JSON.stringify(this.busStationForm.getRawValue()));
  }

  get f() {
    return this.busStationForm.controls;
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.busStationForm.getRawValue();
    return !_.isEqual(this.initialFormValue, currentFormValue);
  }

  closeDialog(): void {
    if (this.hasFormChanged()) {
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
    if (this.defaultFlagService.isDefault(this.busStation)) return;

    const control = this.busStationForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];
    this.busStationImageFile = file;

    if (file) {
      this.readAndSetImage(file);
    }
  }

  private readAndSetImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      this.busStationImage = blobUrl;
      this.busStationForm.patchValue({ imageId: 'new' });
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.busStationImage = '';
    this.busStationForm.patchValue({ imageId: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.busStationImage = files[0].link;
      this.busStationForm.patchValue({ imageId: files[0]._id });
    });
  }

  async pasteImageFromClipboard(): Promise<void> {
    try {
      const items = await navigator.clipboard.read();

      for (const item of items) {
        // Kiểm tra có file image không
        if (
          item.types.includes('image/png') ||
          item.types.includes('image/jpeg') ||
          item.types.includes('image/webp')
        ) {
          const imageBlob = await item
            .getType('image/png')
            .catch(() => item.getType('image/jpeg').catch(() => item.getType('image/webp')));

          if (imageBlob) {
            // Chuyển Blob thành File
            const file = new File([imageBlob], `screenshot-${Date.now()}.png`, { type: imageBlob.type });
            this.busStationImageFile = file;
            this.busStationForm.patchValue({ imageId: 'new' });
            this.readAndSetImage(file);
            toast.success('Hình ảnh đã được paste thành công');
            return;
          }
        }
      }
      toast.error('Vui lòng copy một hình ảnh trước khi paste');
    } catch (error) {
      console.error('Lỗi khi paste image từ clipboard:', error);
      toast.error('Không thể paste hình ảnh. Vui lòng kiểm tra quyền clipboard hoặc thử cách khác');
    }
  }

  onSubmit() {
    if (!this.busStationForm.valid) {
      this.utils.markFormGroupTouched(this.busStationForm);
      return;
    }

    // Check if there are any changes
    if (!this.hasFormChanged()) {
      this.dialogRef.close();
      return;
    }

    let dataTransfer = new DataTransfer();

    // Validate and add busStationImageFile
    if (this.busStationImageFile) {
      dataTransfer.items.add(this.busStationImageFile);
    }
    const files: FileList = dataTransfer.files;

    const { name, busProviceId, imageId, isOffice, isActive, location, detailAddress } = this.busStationForm.getRawValue();
    const data = {
      busStation: {
        ...this.busStation,
        name,
        provinceId: busProviceId,
        imageId,
        isOffice,
        isActive,
        location,
        detailAddress,
      },
      files: files,
    };
    this.dialogRef.close(data);
  }
}
