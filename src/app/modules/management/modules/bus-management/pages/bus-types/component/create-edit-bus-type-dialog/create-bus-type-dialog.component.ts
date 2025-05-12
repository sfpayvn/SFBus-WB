import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusType, BusType2Create } from '../../model/bus-type.model';

export interface DialogData {
  title: string;
  busType: BusType;
}

@Component({
  selector: 'app-create-bus-type-dialog',
  templateUrl: './create-bus-type-dialog.component.html',
  styleUrl: './create-bus-type-dialog.component.scss',
  standalone: false
})
export class CreateEditBusTypeDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateEditBusTypeDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  busType: BusType = this.data.busType ?? new BusType2Create();

  constructor() { }

  ngOnInit(): void { }

  onButtonClick() { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
