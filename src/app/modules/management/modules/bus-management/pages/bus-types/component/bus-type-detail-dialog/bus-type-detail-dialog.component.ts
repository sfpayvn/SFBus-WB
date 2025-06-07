import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusType, BusType2Create } from '../../model/bus-type.model';

export interface DialogData {
  title: string;
  busType: BusType;
}

@Component({
  selector: 'app-bus-type-detail-dialog',
  templateUrl: './bus-type-detail-dialog.component.html',
  styleUrl: './bus-type-detail-dialog.component.scss',
  standalone: false
})
export class BusTypeDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BusTypeDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busType: BusType = this.data.busType ?? new BusType2Create();

  constructor() { }

  ngOnInit(): void { }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
