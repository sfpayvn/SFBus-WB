import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusType, BusType2Create } from '../../model/bus-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from '@rsApp/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

export interface DialogData {
  title: string;
  busType: BusType;
}

@Component({
  selector: 'app-bus-type-detail-dialog',
  templateUrl: './bus-type-detail-dialog.component.html',
  styleUrl: './bus-type-detail-dialog.component.scss',
  standalone: false,
})
export class BusTypeDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusTypeDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busType: BusType = this.data.busType ?? new BusType2Create();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private utils: Utils, public defaultFlagService: DefaultFlagService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      name: [
        { value: this.busType.name, disabled: this.defaultFlagService.isDefault(this.busType) },
        [Validators.required],
      ],
    });
  }

  get f() {
    return this.form.controls;
  }

  onButtonClick() {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  clearFormValue(controlName: string) {
    if (this.defaultFlagService.isDefault(this.busType)) return;

    const control = this.form.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }
    const { name } = this.form.getRawValue();

    const data = {
      busType: {
        ...this.busType,
        name,
      },
    };
    this.dialogRef.close(data);
  }
}
