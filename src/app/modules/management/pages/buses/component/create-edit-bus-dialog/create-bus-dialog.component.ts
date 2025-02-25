import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bus2Create } from '../../model/bus.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';

export interface DialogData {
  title: string;
  busProvince: Bus2Create;
}

@Component({
  selector: 'app-create-bus-dialog',
  templateUrl: './create-bus-dialog.component.html',
  styleUrl: './create-bus-dialog.component.scss',
  standalone: false
})
export class CreateEditBusDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditBusDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busProvince: Bus2Create = this.data.busProvince ?? new Bus2Create();


  busProvinceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private async initForm() {
    console.log("🚀 ~ CreateEditBusDialogComponent ~ initForm ~ this.busProvince:", this.busProvince)
    this.busProvinceForm = this.fb.group({
      name: [this.busProvince.name, [Validators.required]],
    });
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
    const data = {
      ...this.busProvince,
      name
    }
    this.dialogRef.close(data);
  }
}
