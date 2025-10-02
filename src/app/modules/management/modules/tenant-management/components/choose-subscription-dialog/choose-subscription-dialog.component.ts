import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';

export interface DialogData {
  title: string;
  tenantId: string;
}

@Component({
  selector: 'app-choose-subscription-dialog',
  templateUrl: './choose-subscription-dialog.component.html',
  styleUrl: './choose-subscription-dialog.component.scss',
  standalone: false,
})
export class ChooseSubscriptionDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ChooseSubscriptionDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  tenantId: string = this.data.tenantId ?? '';

  plans = [
    { id: 'basic', tier: 'BASIC', price: 0, popular: false, features: ['1 project', 'Community support'] },
    { id: 'standard', tier: 'STANDARD', price: 19, popular: false, features: ['5 projects', 'Email support'] },
    { id: 'premium', tier: 'PREMIUM', price: 29, popular: true, features: ['Unlimited projects', 'Priority support'] },
    { id: 'vip', tier: 'VIP', price: 39, popular: false, features: ['All features', '24/7 support'] },
  ];

  selected: any = this.plans[2]; // mặc định chọn Premium

  seatTypeForm!: FormGroup;

  seatTypeIcon!: string;
  seatTypeIconFile!: File;

  constructor(private fb: FormBuilder, private utils: Utils, private utilsModal: UtilsModal) {}

  ngOnInit(): void {
    if (this.data) {
    }
    this.initForm();
  }

  private async initForm() {}

  onButtonClick() {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  selectPlan(p: any) {
    this.selected = p;
    // TODO: emit/close nếu muốn
    // this.dialogRef.close(p);
  }
}
