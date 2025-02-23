import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { File } from '../../model/file-center.model';
import { AngularSvgIconModule } from 'angular-svg-icon';

export interface DialogData {
  file: File;
}

@Component({
  selector: 'app-view-image-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, CommonModule, AngularSvgIconModule],
  templateUrl: './view-image-dialog.component.html',
  styleUrl: './view-image-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewImageDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ViewImageDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  constructor() { }

  ngOnInit(): void { }

  onButtonClick() { }

  downloadFile(link: string) {

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
