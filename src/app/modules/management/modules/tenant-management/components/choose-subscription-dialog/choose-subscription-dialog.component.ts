import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { SubscriptionService } from '../../../subscription-management/service/subscription.service';
import { toast } from 'ngx-sonner';
import { Subscription } from '../../../subscription-management/model/subscription.model';

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

  subscriptions: Subscription[] = [];

  selected: any;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private utilsModal: UtilsModal,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.dialogRef.close();
    }
    this.initData();
  }

  initData(): void {
    this.subscriptionService.findAllAvailable().subscribe((subscriptions) => {
      if (!subscriptions || subscriptions.length === 0) {
        toast.error('No subscriptions available');
        return;
      }
      this.subscriptions = subscriptions;
    });
  }

  onButtonClick() {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  selectPlan(p: any) {
    this.selected = p;
    // TODO: emit/close nếu muốn
    // this.dialogRef.close(p);
  }

  confirmSelection() {
    if (!this.selected) {
      toast.error('Please select a subscription plan');
      return;
    }
    this.dialogRef.close(this.selected);
  }
}
