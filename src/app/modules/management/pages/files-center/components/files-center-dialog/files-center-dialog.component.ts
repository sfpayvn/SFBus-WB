import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { File } from '../../model/file-center.model';

export interface DialogData {
  file: File;
}

@Component({
  selector: 'app-files-center-dialog',
  standalone: false,
  templateUrl: './files-center-dialog.component.html',
  styleUrl: './files-center-dialog.component.scss',
})
export class FilesCenterDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<FilesCenterDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  constructor() { }

  ngOnInit(): void { }

  onButtonClick() { }

  downloadFile(link: string) {

  }

  chooseFiles(file: File) {
    console.log("🚀 ~ FilesCenterDialogComponent ~ chooseFiles ~ File:", file)
    this.closeDialog(file)
  }

  closeDialog(file?: File): void {
    this.dialogRef.close(file);
  }
}
