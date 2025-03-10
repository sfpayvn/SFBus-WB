import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BusSeatType, BusSeatType2Create } from '../../model/bus-seat-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { FilesCenterDialogComponent } from '../../../files-center/components/files-center-dialog/files-center-dialog.component';
import { File as FileDto } from '../../../files-center/model/file-center.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';

export interface DialogData {
  title: string;
  busSeatType: BusSeatType;
}

@Component({
  selector: 'app-create-bus-seat-type-dialog',
  templateUrl: './create-bus-seat-type-dialog.component.html',
  styleUrl: './create-bus-seat-type-dialog.component.scss',
  standalone: false
})
export class CreateEditBusSeatTypeDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditBusSeatTypeDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busSeatType: BusSeatType = this.data.busSeatType ?? new BusSeatType2Create();

  busSeatTypeForm!: FormGroup;

  busSeatTypeIcon!: string;
  busSeatTypeIconFile!: File;

  busSeatTypeBlockIcon!: string;
  busSeatTypeBlockIconFile!: File;

  busSeatTypeSelectedIcon!: string;
  busSeatTypeSelectedIconFile!: File;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private utilsModal: UtilsModal,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.busSeatTypeIcon = this.busSeatType.icon;
      this.busSeatTypeBlockIcon = this.busSeatType.blockIcon;
      this.busSeatTypeSelectedIcon = this.busSeatType.selectedIcon;
    }
    this.initForm();
  }


  private async initForm() {
    this.busSeatTypeForm = this.fb.group({
      name: [this.busSeatType.name, [Validators.required]],
      icon: [this.busSeatType.icon, Validators.required],
      blockIcon: [this.busSeatType.blockIcon],
      selectedIcon: [this.busSeatType.selectedIcon],
    });
    this.processIsEnv(this.busSeatType.isEnv);
  }

  processIsEnv(isEnv: any) {
    if (!isEnv) {
      this.updateValidators('blockIcon', true);
      this.updateValidators('selectedIcon', true);
    } else {
      this.updateValidators('blockIcon', false);
      this.updateValidators('selectedIcon', false);
    }
  }

  updateValidators = (controlName: string, shouldSet: boolean) => {
    const control = this.busSeatTypeForm.get(controlName);
    if (control) {
      shouldSet ? control.setValidators(Validators.required) : control.clearValidators();
      control.updateValueAndValidity(); // Cập nhật giá trị và trạng thái của validator
    }
  }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any, type: string) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];

    switch (type) {
      case 'icon':
        this.busSeatTypeIconFile = file;
        break;
      case 'blockIcon':
        this.busSeatTypeBlockIconFile = file;
        break;
      case 'selectedIcon':
        this.busSeatTypeSelectedIconFile = file;
        break;

      default:
        break;
    }

    if (file) {
      this.readAndSetImage(file, type);
    }
  }

  private readAndSetImage(file: File, type: string): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);

      switch (type) {
        case 'icon':
          this.busSeatTypeIcon = blobUrl;
          break;
        case 'blockIcon':
          this.busSeatTypeBlockIcon = blobUrl;
          break;
        case 'selectedIcon':
          this.busSeatTypeSelectedIcon = blobUrl;
          break;

        default:
          break;
      }
    };
    reader.readAsArrayBuffer(file);  // Đọc file dưới dạng ArrayBuffer
  }


  removeFileImage(type: string) {

    switch (type) {
      case 'icon':
        this.busSeatTypeIcon = '';
        this.busSeatTypeForm.patchValue({ icon: '' });
        break;
      case 'blockIcon':
        this.busSeatTypeBlockIcon = '';
        this.busSeatTypeForm.patchValue({ blockIcon: '' });
        break;
      case 'selectedIcon':
        this.busSeatTypeSelectedIcon = '';
        this.busSeatTypeForm.patchValue({ selectedIcon: '' });
        break;

      default:
        break;
    }
  };

  openFilesCenterDialog(type: string) {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.busSeatTypeIcon = files[0].link;
      this.busSeatTypeForm.patchValue({ icon: files[0]._id });
    });
  }

  onSubmit() {
    if (!this.busSeatTypeForm.valid) {
      this.utils.markFormGroupTouched(this.busSeatTypeForm);
      return;
    }

    const { name } = this.busSeatTypeForm.getRawValue();

    let dataTransfer = new DataTransfer();

    // Validate and add busSeatTypeIconFile
    if (this.busSeatTypeIconFile) {
      dataTransfer.items.add(this.busSeatTypeIconFile);
    }

    if (!this.busSeatType.isEnv) {
      // Validate and add busSeatTypeBlockIconFile
      if (this.busSeatTypeBlockIconFile) {
        dataTransfer.items.add(this.busSeatTypeBlockIconFile);
      }

      // Validate and add busSeatTypeSelectedIconFile
      if (this.busSeatTypeSelectedIconFile) {
        dataTransfer.items.add(this.busSeatTypeSelectedIconFile);
      }
    }

    const files: FileList = dataTransfer.files;

    const data = {
      name,
      isEnv: this.busSeatType.isEnv,
      files: files,
    };
    this.dialogRef.close(data);
  }
}
