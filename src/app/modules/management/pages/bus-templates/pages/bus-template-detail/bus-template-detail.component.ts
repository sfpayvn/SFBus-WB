import { Component, OnInit } from '@angular/core';
import { BusTemplatesService } from '../../service/bus-templates.servive';
import { Location } from '@angular/common'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusSeatType } from '../../../bus-seat-types/model/bus-seat-type.model';
import { BusSeatTypesService } from '../../../bus-seat-types/service/bus-seat-types.servive';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-bus-template-detail',
  templateUrl: './bus-template-detail.component.html',
  styleUrls: ['./bus-template-detail.component.scss'],
  standalone: false
})
export class BusTemplateDetailComponent implements OnInit {

  busTemplateDetailForm!: FormGroup;
  tabs = ['seat layout 1'];
  selectedIndex = 0;

  busSeatTypes: BusSeatType[] = [];
  currentBusSeatTypeId: string = '';

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix
  matrixTempalte: {
    id: string;
    index: number;
    type: string;
    isEditing: boolean;
    isSelected: boolean;
    name: string;
    status: string;
    errorName: string;
    hasError: boolean;
    allowAutoNameEdit: boolean;
  }[][] = []; // Ma trận lưu giá trị, kiểu, trạng thái chỉnh sửa, trạng thái chọn, tên


  holdTimeout: any;

  usedNames: Set<number> = new Set(); // Danh sách lưu trữ các giá trị đã được sử dụng
  originalName: string = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private busTemplatesService: BusTemplatesService,
    private busSeatTypesService: BusSeatTypesService,
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  initData() {
    this.busSeatTypesService.findAll().subscribe((busSeatTypes: BusSeatType[]) => {
      this.busSeatTypes = busSeatTypes;
      this.currentBusSeatTypeId = this.busSeatTypes ? this.busSeatTypes[0]._id : '';
      console.log("🚀 ~ BusTemplateDetailComponent ~ this.busSeatTypesService.findAll ~ busSeatTypes:", busSeatTypes)
    })
  }

  private async initForm() {
    this.busTemplateDetailForm = this.fb.group({
      name: ['', [Validators.required]],
      layouts: this.fb.array([]),
    });
    this.addLayout();
  }

  // Hàm để thêm layout vào layouts FormArray
  async addLayout() {
    const layoutsForMatrixForm = this.busTemplateDetailForm.get('layouts') as FormArray;
    await this.initializeMatrix([], layoutsForMatrixForm, (layouts) => {
      console.log("🚀 ~ BusTemplateDetailComponent ~ awaitthis.initializeMatrix ~ layoutsForMatrixForm:", layoutsForMatrixForm)
      layouts = layoutsForMatrixForm;
      console.log("🚀 ~ BusTemplateDetailComponent ~ awaitthis.initializeMatrix ~ layouts:", layouts)
    });
  }

  async initializeMatrix(seatLayouts: any, layoutsForMatrixForm: any, out: (layoutsForMatrix: any) => void): Promise<void> {
    // if (seatLayouts && seatLayouts.length > 0) {
    //   for (const seatLayout of seatLayouts) {
    //     const layoutForMatrix = {
    //       name: seatLayout.controls.name.value,
    //       seatsLayoutForMatrix: Array.from({ length: this.rows }, (_, i) =>
    //         Array.from({ length: this.cols }, (_, j) => ({
    //           _id: "",
    //           index: i * this.cols + j + 1,
    //           type: "",
    //           name: "",
    //           status: "available",
    //           statusChanged: false,
    //           statusDeselected: false,
    //           isEditing: false,
    //           isSelected: false,
    //           errorName: '',
    //           hasError: false,
    //           allowAutoNameEdit: false,
    //         })),
    //       ),
    //     };
    //     if (seatLayout.seats) {
    //       for (const cell of seatLayout.seats) {
    //         const row = Math.floor((cell.index - 1) / this.cols);
    //         const col = (cell.index - 1) % this.cols;
    //         layoutForMatrix.seatsLayoutForMatrix[row][col] = {
    //           ...cell,
    //           statusChanged: false,
    //           statusDeselected: false,
    //         };
    //       }
    //     }

    //     layoutsForMatrixForm.push(layoutForMatrix);
    //     await out(layoutsForMatrixForm);
    //     return;
    //   }
    // }
    const layoutForMatrix = this.fb.group({
      name: ['Layout 1', [Validators.required]],
      seatsLayoutForMatrix: [Array.from({ length: this.rows }, (_, i) =>
        Array.from({ length: this.cols }, (_, j) => ({
          _id: '',
          index: i * this.cols + j + 1,
          busSeatTypeId: '',
          name: '',
          status: 'available',
          statusChanged: false,
          statusDeselected: false,
          isEditing: false,
          isSelected: false,
          errorName: '',
          hasError: false,
          allowAutoNameEdit: false,
        }))
      )],
    });

    layoutsForMatrixForm.push(layoutForMatrix);
    await out(layoutsForMatrixForm);
  }

  // Truy cập layouts để làm việc
  get layouts(): FormArray {
    return this.busTemplateDetailForm.get('layouts') as FormArray;
  }

  backPage() {
    this.location.back();
  }

  onSubmit() {

  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  selectBusSeatType(busSeatType: string): void {
    this.currentBusSeatTypeId = busSeatType;
  }

  hasError(): boolean {
    const currentMatrix = this.layouts.controls[0].get('seatsLayoutForMatrix')?.value;
    return currentMatrix.some((row: any) => row.some((cell: any) => cell.hasError));
  }

  // Áp dụng kiểu vào ô được chọn, không cho phép bỏ chọn khi đang chỉnh sửa
  applyType(row: number, col: number): void {

    const currentMatrix = this.layouts.controls[0].get('seatsLayoutForMatrix')?.value;
    const cell = currentMatrix[row][col];
    const selectedType = this.busSeatTypes.find((busSeatType) => busSeatType._id === this.currentBusSeatTypeId);

    // Kiểm tra nếu ô đang chỉnh sửa hoặc có lỗi thì không làm gì
    if (cell.isEditing || this.hasError()) return;

    // Nếu ô đã được chọn và loại hiện tại giống với loại của ô, bỏ chọn ô
    if (cell.busSeatTypeId === this.currentBusSeatTypeId) {
      cell.isSelected = false;
      cell.busSeatTypeId = '';
      cell.name = '';
      cell.allowAutoNameEdit = false; // Cập nhật allowAutoNameEdit

      this.usedNames.delete(parseInt(cell.name.slice(1))); // Xóa tên khỏi usedNames
    } else {
      this.updateCellType(cell, selectedType);
    }

    this.layouts.controls[0].get('seatsLayoutForMatrix')?.patchValue(currentMatrix);

    console.log("🚀 ~ BusTemplateDetailComponent ~ applyType ~ this.layouts:", this.layouts)

    // // Nếu ô đang là loại 1 và loại mới là 2 hoặc 3, xóa tên khỏi usedNames
    // // if (cell.busSeatTypeId === 1 && [2, 3].includes(this.currentType)) {
    // //   this.usedNames.delete(parseInt(cell.name.slice(1)));
    // // }

    // // Lưu trạng thái chỉnh sửa hiện tại trước khi áp dụng loại mới
    // currentMatrix.forEach((matrixRow: any, i: any) => matrixRow.forEach((cell: any, j: any) => cell.isEditing && this.saveEdit(i, j)));

    // // Nếu loại hiện tại hợp lệ, áp dụng loại mới cho ô
    // this.updateCellType(cell, selectedType);
  }

  updateCellType(cell: any, selectedType: any): void {
    cell.busSeatTypeId = this.currentBusSeatTypeId; // Cập nhật loại của ô
    cell.isSelected = true; // Đánh dấu ô đã được chọn

    // Cập nhật allowAutoNameEdit theo loại
    cell.allowAutoNameEdit = selectedType?.allowAutoNameEdit || false;

    // Nếu loại là 2 hoặc 3, xóa tên của ô

    const idsIsEnv = this.busSeatTypes
      .filter(item => item.isEnv === true)
      .map(item => item._id);

    //Nếu type bằng env thì xóa bỏ tên
    if (idsIsEnv.includes(this.currentBusSeatTypeId)) {
      this.usedNames.delete(parseInt(cell.name.slice(1)));
      cell.name = '';

    } else if (selectedType?.allowAutoNameEdit) {
      const maxNames = this.rows * this.cols;
      for (let i = 1; i <= maxNames; i++) {
        if (!this.usedNames.has(i)) {
          cell.name = `A${i.toString().padStart(2, '0')}`; // Tạo tên mới cho ô
          this.usedNames.add(i);
          break;
        }
      }
    }

    cell.icon = selectedType.icon; // Cập nhật icon cho ô
  }

  // Hàm focus vào ô đang chỉnh sửa
  focusCell(): void {
    // console.log('🚀 ~ OptionsValueComponent ~ focusCell ~ focusCell:');
    // setTimeout(() => {
    //   if (this.cellInput) {
    //     this.cellInput.nativeElement.focus();
    //   }
    // }, 0);
  }

  // Bắt đầu nhấn chuột
  onMouseDown(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return; // Chỉ thực hiện nếu nhấn chuột trái
    event.preventDefault(); // Ngăn chặn hành động mặc định
    this.holdTimeout = setTimeout(() => {
      // this.toggleStatus(row, col, event); // Thay đổi trạng thái khi nhấn giữ
      this.holdTimeout = null; // Đặt lại holdTimeout
    }, 1000); // Thời gian nhấn giữ là 1000ms
  }

  // Nhả chuột
  onMouseUp(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return; // Chỉ thực hiện nếu nhả chuột trái
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.applyType(row, col); // Thực hiện hành động nhấn
    }
    this.holdTimeout = null; // Đặt lại holdTimeout
  }

  // Di chuột ra khỏi ô
  onMouseLeave(event: MouseEvent): void {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.holdTimeout = null; // Đặt lại holdTimeout
    }
  }

  // Nhấn chuột
  onClick(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return; // Chỉ thực hiện nếu nhấn chuột trái
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.holdTimeout = null; // Đặt lại holdTimeout
      this.applyType(row, col); // Thực hiện hành động nhấn
    }
  }

  getIconByType(busSeatTypeId: string, status: string = 'available'): string {
    const selectedType = this.busSeatTypes.find((busSeatType) => busSeatType._id === busSeatTypeId);
    if (!selectedType?.isEnv && status === 'block') {
      return selectedType?.blockIcon || '';
    }
    return selectedType?.icon || '';
  }

  // Kiểm tra xem ô có đang ở chế độ chỉnh sửa
  isEditing(row: number, col: number): boolean {
    const currentMatrix = this.layouts.controls[0].get('seatsLayoutForMatrix')?.value;
    return currentMatrix[row][col].isEditing;
  }

  // Bắt đầu chỉnh sửa ô khi nhấn chuột phải
  startEdit(row: number, col: number, event: MouseEvent): void {
    // event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    // const cell = this.matrix[row][col];
    // if (cell.busSeatTypeId > 0 && cell.busSeatTypeId !== 2 && cell.busSeatTypeId !== 3) {
    //   this.originalName = cell.name; // Lưu giá trị name hiện tại
    //   cell.isEditing = true; // Bắt đầu chế độ chỉnh sửa
    //   this.focusCell();
    // }
  }

  saveEdit(row: number, col: number): void {
    const currentMatrix = this.layouts.controls[0].get('seatsLayoutForMatrix')?.value;
    const cell = currentMatrix[row][col];
    const newName = cell.name;

    // Kiểm tra định dạng tên (phải bắt đầu bằng 'A' và theo sau là số từ 01 đến 99)
    const nameFormat = /^A\d{2}$/;
    if (!nameFormat.test(newName)) {
      toast.error('Tên không hợp lệ. Tên phải có định dạng A01, A02, ..., A99.');
      cell.hasError = true; // Đánh dấu ô có lỗi
      cell.isEditing = true; // Giữ ô ở chế độ chỉnh sửa
      this.focusCell(); // Focus vào ô lỗi
      return;
    }

    // Kiểm tra nếu tên mới đã được sử dụng và khác với tên hiện tại
    if (newName !== this.originalName && this.usedNames.has(parseInt(newName.slice(1)))) {
      toast.error('Tên này đã được sử dụng. Vui lòng chọn tên khác.');
      cell.hasError = true; // Đánh dấu ô có lỗi
      cell.isEditing = true; // Giữ ô ở chế độ chỉnh sửa
      this.focusCell(); // Focus vào ô lỗi
      return;
    }

    // Xóa tên cũ khỏi danh sách đã sử dụng
    this.usedNames.delete(parseInt(this.originalName.slice(1)));

    // Thêm tên mới vào danh sách đã sử dụng
    this.usedNames.add(parseInt(newName.slice(1)));

    cell.hasError = false; // Xóa đánh dấu lỗi
    cell.isEditing = false; // Kết thúc chế độ chỉnh sửa

    this.layouts.controls[0].get('seatsLayoutForMatrix')?.patchValue(currentMatrix)
  }

  saveSelected(): void {
    // // Ánh xạ dữ liệu từ các ô được chọn trong ma trận 1 sang ma trận 2
    // const selectedCells = this.matrix.flat().filter((cell) => cell.isSelected);

    // selectedCells.forEach((cell) => {
    //   const row = Math.floor((cell.value - 1) / this.cols);
    //   const col = (cell.value - 1) % this.cols;

    //   // Kiểm tra và gán GUID nếu chưa có
    //   if (!cell.id) {
    //     cell.id = "1";
    //   }

    //   this.selectedMatrix[row][col] = {
    //     id: cell.id,
    //     value: cell.value,
    //     type: cell.busSeatTypeId,
    //     name: cell.name,
    //     status: cell.status,
    //   };
    // });

    // this.updateDisplayMatrix();
    // console.log('Selected Cells:', selectedCells);
    // toast.success('Dữ liệu đã được lưu thành công!');
  }


  resetSelected() {
    // this.initializeMatrix();
    // this.usedNames.clear();
  }

}
