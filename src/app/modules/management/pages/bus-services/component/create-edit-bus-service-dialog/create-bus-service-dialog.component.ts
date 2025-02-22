import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusService, BusService2Create } from '../../model/bus-service.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';

export interface DialogData {
  title: string;
  busType: BusService;
}

@Component({
  selector: 'app-create-bus-service-dialog',
  templateUrl: './create-bus-service-dialog.component.html',
  styleUrl: './create-bus-service-dialog.component.scss',
  standalone: false
})
export class CreateEditBusServiceDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditBusServiceDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busType: BusService = this.data.busType ?? new BusService2Create();


  busServiceForm!: FormGroup;

  busServiceIcon!: string;
  busServiceIconFile!: FileList;

  constructor(
    private fb: FormBuilder,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.initForm();
  }


  private async initForm() {
    this.busServiceForm = this.fb.group({
      name: ['', [Validators.required]],
      icon: ['', Validators.required],
    });
  }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.busServiceIconFile = files;
    if (!files || files.length === 0) return;
    const file = files[0];

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
      this.busServiceIcon = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(file);  // Đọc file dưới dạng ArrayBuffer
  }


  removeFileImage() {
    this.busServiceIcon = '';
    this.busServiceForm.patchValue({ image: '' });
  }

  onSubmit() {
    if (!this.busServiceForm.valid) {
      this.utils.markFormGroupTouched(this.busServiceForm);
      return;
    }
    const { name } = this.busServiceForm.getRawValue();
    const data = {
      name,
      file: this.busServiceIconFile,
    }
    this.dialogRef.close(data);
  }
}
