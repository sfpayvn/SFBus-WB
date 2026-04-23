import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusScheduleAutoGenerator } from '../../model/bus-schedule-autogenerator.model';

export interface DialogData {
  busScheduleAutoGenerator: BusScheduleAutoGenerator;
  startDate: Date;
}

@Component({
  selector: 'app-bus-schedule-autogenerators-detail-dialog',
  standalone: false,
  templateUrl: './bus-schedule-autogenerators-detail-dialog.component.html',
  styleUrl: './bus-schedule-autogenerators-detail-dialog.component.scss',
})
export class BusScheduleAutogeneratorsDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusScheduleAutogeneratorsDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  isReloadData: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onButtonClick() {}

  downloadFile(link: string) {}

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
