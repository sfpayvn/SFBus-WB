import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SeatType, SeatType2Create } from '../../model/seat-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { FilesCenterDialogComponent } from '../../../files-center/components/files-center-dialog/files-center-dialog.component';
import { File as FileDto } from '../../../files-center/model/file-center.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';

export interface DialogData {
  title: string;
  seatType: SeatType;
}

@Component({
  selector: 'app-create-seat-type-dialog',
  templateUrl: './create-seat-type-dialog.component.html',
  styleUrl: './create-seat-type-dialog.component.scss',
  standalone: false
})
export class CreateEditSeatTypeDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditSeatTypeDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  seatType: SeatType = this.data.seatType ?? new SeatType2Create();

  seatTypeForm!: FormGroup;

  seatTypeIcon!: string;
  seatTypeIconFile!: File;

  seatTypeBlockIcon!: string;
  seatTypeBlockIconFile!: File;

  seatTypeSelectedIcon!: string;
  seatTypeSelectedIconFile!: File;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private utilsModal: UtilsModal,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.seatTypeIcon = this.seatType.icon;
      this.seatTypeBlockIcon = this.seatType.blockIcon;
      this.seatTypeSelectedIcon = this.seatType.selectedIcon;
    }
    this.initForm();
  }


  private async initForm() {
    this.seatTypeForm = this.fb.group({
      name: [this.seatType.name, [Validators.required]],
      icon: [this.seatType.icon, Validators.required],
      blockIcon: [this.seatType.blockIcon],
      selectedIcon: [this.seatType.selectedIcon],
    });
    this.processIsEnv(this.seatType.isEnv);
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
    const control = this.seatTypeForm.get(controlName);
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
        this.seatTypeIconFile = file;
        break;
      case 'blockIcon':
        this.seatTypeBlockIconFile = file;
        break;
      case 'selectedIcon':
        this.seatTypeSelectedIconFile = file;
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
          this.seatTypeIcon = blobUrl;
          break;
        case 'blockIcon':
          this.seatTypeBlockIcon = blobUrl;
          break;
        case 'selectedIcon':
          this.seatTypeSelectedIcon = blobUrl;
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
        this.seatTypeIcon = '';
        this.seatTypeForm.patchValue({ icon: '' });
        break;
      case 'blockIcon':
        this.seatTypeBlockIcon = '';
        this.seatTypeForm.patchValue({ blockIcon: '' });
        break;
      case 'selectedIcon':
        this.seatTypeSelectedIcon = '';
        this.seatTypeForm.patchValue({ selectedIcon: '' });
        break;

      default:
        break;
    }
  };

  openFilesCenterDialog(type: string) {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.seatTypeIcon = files[0].link;
      this.seatTypeForm.patchValue({ icon: files[0]._id });
    });
  }

  onSubmit() {
    if (!this.seatTypeForm.valid) {
      this.utils.markFormGroupTouched(this.seatTypeForm);
      return;
    }

    const { name } = this.seatTypeForm.getRawValue();

    let dataTransfer = new DataTransfer();

    // Validate and add seatTypeIconFile
    if (this.seatTypeIconFile) {
      dataTransfer.items.add(this.seatTypeIconFile);
    }

    if (!this.seatType.isEnv) {
      // Validate and add seatTypeBlockIconFile
      if (this.seatTypeBlockIconFile) {
        dataTransfer.items.add(this.seatTypeBlockIconFile);
      }

      // Validate and add seatTypeSelectedIconFile
      if (this.seatTypeSelectedIconFile) {
        dataTransfer.items.add(this.seatTypeSelectedIconFile);
      }
    }

    const files: FileList = dataTransfer.files;

    const data = {
      name,
      isEnv: this.seatType.isEnv,
      files: files,
    };
    this.dialogRef.close(data);
  }
}
