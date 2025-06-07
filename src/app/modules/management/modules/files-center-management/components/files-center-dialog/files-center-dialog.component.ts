import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileDto } from '../../model/file-center.model';

export interface DialogData {
  file: FileDto;
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

  chooseFiles(file: FileDto) {
    this.closeDialog(file)
  }

  closeDialog(file?: FileDto): void {
    this.dialogRef.close(file);
  }
}
