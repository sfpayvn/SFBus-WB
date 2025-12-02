import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserAddress, UserAddress2Create } from '../../model/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';

export interface DialogData {
  title: string;
  address: UserAddress;
}

@Component({
  selector: 'app-user-address-detail-dialog',
  templateUrl: './user-address-detail-dialog.component.html',
  styleUrl: './user-address-detail-dialog.component.scss',
  standalone: false,
})
export class UserAddressDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<UserAddressDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  address: UserAddress = this.data.address ?? new UserAddress();

  userAddressForm!: FormGroup;

  constructor(private fb: FormBuilder, public utils: Utils) {
    this.initForm();
  }

  ngOnInit(): void {}

  async initForm() {
    const { addressType = '', address = '' } = this.address;
    this.userAddressForm = this.fb.group({
      addressType: [addressType],
      address: [address, [Validators.required]],
    });
  }

  onButtonClick() {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.userAddressForm.valid) {
      this.utils.markFormGroupTouched(this.userAddressForm);
      return;
    }

    const data = this.userAddressForm.getRawValue();

    this.dialogRef.close(data);
  }
}
