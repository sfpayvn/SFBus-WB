import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusSchedule } from '../../model/bus-schedule.model';

export interface DialogData {
  busSchedule: BusSchedule;
  startDate: Date
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

  constructor() { }

  ngOnInit(): void {
    console.log("🚀 ~ BusScheduleDetailDialogComponent ~ ngOnInit ~ data.busSchedule:", this.data)
  }

  onButtonClick() { }

  downloadFile(link: string) {

  }

  chooseFiles(busSchedule: BusSchedule) {
    this.closeDialog(busSchedule)
  }

  closeDialog(busSchedule?: BusSchedule): void {
    this.dialogRef.close(busSchedule);
  }
}
