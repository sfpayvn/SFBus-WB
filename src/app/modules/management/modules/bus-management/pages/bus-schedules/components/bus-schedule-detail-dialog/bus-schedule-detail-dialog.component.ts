import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusSchedule } from '../../model/bus-schedule.model';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { BusScheduleDetailComponent } from '../../pages/bus-schedule-detail/bus-schedule-detail.component';

export interface DialogData {
  busSchedule: BusSchedule;
  startDate: Date;
}

@Component({
  selector: 'app-bus-schedule-detail-dialog',
  standalone: false,
  templateUrl: './bus-schedule-detail-dialog.component.html',
  styleUrl: './bus-schedule-detail-dialog.component.scss',
})
export class BusScheduleDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusScheduleDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  isReloadData: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close(this.isReloadData);
  }

  closeDialogWithReloadData(): void {
    this.isReloadData = true;
    this.dialogRef.close(this.isReloadData);
  }

  saveSchedule(): void {
    this.isReloadData = true;
  }
}
