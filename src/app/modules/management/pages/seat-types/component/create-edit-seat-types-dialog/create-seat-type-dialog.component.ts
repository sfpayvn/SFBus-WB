import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SeatType, SeatType2Create } from '../../model/seat-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { FilesCenterDialogComponent } from '../../../files-center/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from '../../../files-center/model/file-center.model';
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

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private utilsModal: UtilsModal,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.seatTypeIcon = this.seatType.iconLink;
    }
    this.initForm();
  }


  private async initForm() {
    this.seatTypeForm = this.fb.group({
      name: [this.seatType.name, [Validators.required]],
      iconId: [this.seatType.iconId, Validators.required],
    });
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

  onFileChange(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];
    this.seatTypeIconFile = file;


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
      this.seatTypeIcon = blobUrl;

    };
    reader.readAsArrayBuffer(file);  // Đọc file dưới dạng ArrayBuffer
  }


  removeFileImage() {
    this.seatTypeIcon = '';
    this.seatTypeForm.patchValue({ iconId: '' });
  };

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.seatTypeIcon = files[0].link;
      this.seatTypeForm.patchValue({ iconId: files[0]._id });
    });
  }

  onSubmit() {
    if (!this.seatTypeForm.valid) {
      this.utils.markFormGroupTouched(this.seatTypeForm);
      return;
    }

    const { name, iconId } = this.seatTypeForm.getRawValue();

    let dataTransfer = new DataTransfer();

    // Validate and add seatTypeIconFile
    if (this.seatTypeIconFile) {
      dataTransfer.items.add(this.seatTypeIconFile);
    }
    const files: FileList = dataTransfer.files;

    const data = {
      name,
      iconId,
      isEnv: this.seatType.isEnv,
      files: files,
    };
    this.dialogRef.close(data);
  }
}
