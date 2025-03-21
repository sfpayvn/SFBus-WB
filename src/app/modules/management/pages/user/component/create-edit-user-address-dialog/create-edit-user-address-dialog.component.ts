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
  selector: 'app-create-edit-user-address-dialog',
  templateUrl: './create-edit-user-address-dialog.component.html',
  styleUrl: './create-edit-user-address-dialog.component.scss',
  standalone: false
})
export class CreateEditUserAddressDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditUserAddressDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  address: UserAddress = this.data.address ?? new UserAddress();

  userAddressForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
  ) {
    this.initForm()
  }

  ngOnInit(): void { }

  async initForm() {
    const { addressType = '', address = '' } = this.address
    this.userAddressForm = this.fb.group({
      addressType: [addressType],
      address: [address, [Validators.required]],
    })
  }

  onButtonClick() { }

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
