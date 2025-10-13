import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GoodsCategory, GoodsCategory2Create } from '../../model/goods-category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { FileDto } from 'src/app/modules/management/modules/files-center-management/model/file-center.model';
import { FilesCenterDialogComponent } from 'src/app/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';

export interface DialogData {
  title: string;
  goodsCategory: GoodsCategory;
}

@Component({
  selector: 'app-goods-category-detail-dialog',
  templateUrl: './goods-category-detail-dialog.component.html',
  styleUrl: './goods-category-detail-dialog.component.scss',
  standalone: false,
})
export class GoodsCategoryDetailDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<GoodsCategoryDetailDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  goodsCategory: GoodsCategory = this.data.goodsCategory ?? new GoodsCategory2Create();

  goodsCategoryForm!: FormGroup;

  goodsCategoryIcon!: string;
  goodsCategoryIconFile!: File;

  constructor(private fb: FormBuilder, private utils: Utils, private utilsModal: UtilsModal) {}

  ngOnInit(): void {
    if (this.data) {
      this.goodsCategoryIcon = this.goodsCategory.icon;
    }
    this.initForm();
  }

  private async initForm() {
    this.goodsCategoryForm = this.fb.group({
      name: [this.goodsCategory.name, [Validators.required]],
      icon: [this.goodsCategory.icon, Validators.required],
    });
  }

  updateValidators = (controlName: string, shouldSet: boolean) => {
    const control = this.goodsCategoryForm.get(controlName);
    if (control) {
      shouldSet ? control.setValidators(Validators.required) : control.clearValidators();
      control.updateValueAndValidity(); // Cập nhật giá trị và trạng thái của validator
    }
  };

  onButtonClick() {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];
    this.goodsCategoryIconFile = file;

    if (file) {
      this.readAndSetImage(file);
    }
  }

  private readAndSetImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      this.goodsCategoryIcon = blobUrl;
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.goodsCategoryIcon = '';
    this.goodsCategoryForm.patchValue({ icon: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.goodsCategoryIcon = files[0].link;
      this.goodsCategoryForm.patchValue({ icon: files[0].link });
    });
  }

  onSubmit() {
    if (!this.goodsCategoryForm.valid) {
      this.utils.markFormGroupTouched(this.goodsCategoryForm);
      return;
    }

    const { name, icon } = this.goodsCategoryForm.getRawValue();

    let dataTransfer = new DataTransfer();

    // Validate and add seatTypeIconFile
    if (this.goodsCategoryIconFile) {
      dataTransfer.items.add(this.goodsCategoryIconFile);
    }
    const files: FileList = dataTransfer.files;

    const data = {
      name,
      icon,
      files: files,
    };
    this.dialogRef.close(data);
  }
}
