import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BusLayoutTemplatesService } from '../../service/bus-layout-templates.servive';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { TranslateService } from '@ngx-translate/core';
import { SeatType } from '../../../seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import {
  BusLayoutTemplate,
  BusLayoutTemplate2Create,
  BusLayoutTemplate2Update,
  Seat,
  BusSeatLayoutTemplate,
} from '../../model/bus-layout-templates.model';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';

@Component({
  selector: 'app-bus-layout-template-detail',
  templateUrl: './bus-layout-template-detail.component.html',
  styleUrls: ['./bus-layout-template-detail.component.scss'],
  standalone: false,
})
export class BusLayoutTemplateDetailComponent implements OnInit {
  @ViewChild('cellInput', { static: false }) cellInput: ElementRef | undefined;

  busLayoutTemplate!: BusLayoutTemplate;

  busTemplateDetailForm!: FormGroup;
  tabs = ['seat layout 1'];
  selectedIndex = 0;

  seatTypes: SeatType[] = [];
  seatTypesCache: Map<string, SeatType | undefined> = new Map();
  currentSeatTypeId: string = '';

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

  usedNames: Set<string> = new Set(); // Danh sách lưu trữ các giá trị đã được sử dụng
  originalName: string = '';

  private initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private busLayoutTemplatesService: BusLayoutTemplatesService,
    private seatTypesService: SeatTypesService,
    private el: ElementRef,
    private renderer: Renderer2,
    private utils: Utils,
    private router: Router,
    public defaultFlagService: DefaultFlagService,
    private utilsModal: UtilsModal,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.busLayoutTemplate = params['busLayoutTemplate'] ? JSON.parse(params['busLayoutTemplate']) : null;
    }
  }

  initData() {
    this.seatTypesService.findAll().subscribe((seatTypes: SeatType[]) => {
      this.seatTypes = seatTypes;
      this.currentSeatTypeId = this.seatTypes ? this.seatTypes[0]._id : '';
      this.initForm();
    });
  }

  private async initForm() {
    const { name = '' } = this.busLayoutTemplate || {};

    this.busTemplateDetailForm = this.fb.group({
      name: [
        { value: name, disabled: this.defaultFlagService.isDefault(this.busLayoutTemplate) },
        [Validators.required],
      ],
      layouts: this.fb.array([]),
    });

    let layoutsForMatrixForm = this.busTemplateDetailForm.get('layouts') as FormArray;

    // nếu có busTemplate initializeLayout để edit
    if (this.busLayoutTemplate) {
      for (const layout of this.busLayoutTemplate.seatLayouts) {
        const layoutForm = await this.initializeLayout(layout);
        layoutsForMatrixForm.push(layoutForm);
      }

      this.selectedIndex = 0;
    } else {
      //initializeLayout để create
      const layout = await this.initializeLayout();
      layoutsForMatrixForm.push(layout);
      this.selectedIndex = 0;
    }

    // Set initialFormValue sau khi form load xong hoàn toàn
    // Deep clone để tránh reference issue với seats array
    this.initialFormValue = JSON.parse(JSON.stringify(this.busTemplateDetailForm.getRawValue()));
  }

  get f() {
    return this.busTemplateDetailForm.controls;
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.busTemplateDetailForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  // Hàm để thêm layout vào layouts FormArray
  async addLayout() {
    const currentMatrix = this.getCurrentLayoutMatrix();
    currentMatrix.forEach((matrixRow: any, i: any) =>
      matrixRow.forEach((cell: any, j: any) => cell.isEditing && this.saveEdit(i, j)),
    );
    // Kiểm tra nếu ô đang chỉnh sửa hoặc có lỗi thì không làm gì
    if (this.hasError()) return;

    let layoutsForMatrixForm = this.busTemplateDetailForm.get('layouts') as FormArray;
    const layout = await this.initializeLayout();
    layoutsForMatrixForm.push(layout);
    this.selectedIndex = layoutsForMatrixForm.controls.length - 1;
  }

  async initializeLayout(layout?: any) {
    const layoutForMatrix = this.fb.group({
      name: [
        { value: layout?.name ?? 'New Layout', disabled: this.defaultFlagService.isDefault(this.busLayoutTemplate) },
        [Validators.required],
      ],
      seats: [await this.initializeMaTrix()],
    });

    if (layout?.seats) {
      const seatsControl = layoutForMatrix.get('seats'); // Use get() directly on the FormGroup
      const seats = seatsControl?.value || null;

      if (!seats) return layoutForMatrix;
      layout.seats.forEach((cell: any) => {
        const row = Math.floor((cell.index - 1) / this.cols);
        const col = (cell.index - 1) % this.cols;

        const currentCellSeatType = this.seatTypes.find((item) => item._id == cell.typeId);

        const icon = currentCellSeatType?.icon;

        if (cell.name) {
          this.usedNames.add(cell.name);
        }

        seats[row][col] = {
          ...cell,
          name: cell.name,
          icon: icon,
          isSelected: currentCellSeatType,
          allowAutoNameEdit: !currentCellSeatType?.isEnv,
        };
      });

      seatsControl?.patchValue(seats); // Call patchValue only once at the end
    }

    return layoutForMatrix;
  }

  async initializeMaTrix() {
    return Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => ({
        _id: '',
        index: i * this.cols + j + 1,
        typeId: '',
        name: '',
        icon: '',
        status: 'available',
        statusChanged: false,
        statusDeselected: false,
        isEditing: false,
        isSelected: false,
        errorName: '',
        hasError: false,
        allowAutoNameEdit: false,
      })),
    );
  }

  // Truy cập layouts để làm việc
  get layouts(): FormArray {
    return this.busTemplateDetailForm.get('layouts') as FormArray;
  }

  backPage() {
    if (this.hasFormChanged()) {
      this.utilsModal
        .openModalConfirm('Lưu ý', 'Bạn có thay đổi chưa lưu, bạn có chắc muốn đóng không?', 'warning')
        .subscribe((result) => {
          if (result) {
            this.location.back();

            return;
          }
        });
    } else {
      this.location.back();
    }
  }

  closeTab({ index }: { index: number }): void {
    this.layouts.controls.splice(index, 1);
  }

  getCurrentLayoutMatrix() {
    return this.layouts.controls[this.selectedIndex].get('seats')?.value;
  }

  selectSeatType(seatType: string): void {
    this.currentSeatTypeId = seatType;
  }

  toggleStatus(row: number, col: number, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const currentMatrix = this.getCurrentLayoutMatrix();
    const cell = currentMatrix[row][col];

    const currentCellSeatType = this.seatTypes.find((item) => item._id == this.currentSeatTypeId);

    if (currentCellSeatType?.isEnv) {
      return;
    }

    // Remove the current status class
    const cellElement = this.el.nativeElement.querySelector(`#cell-${row}-${col}`);
    this.renderer.removeClass(cellElement, `status-${cell.status}`);

    //use for animation
    setTimeout(() => {
      if (cell.status === 'available') {
        cell.status = 'blocked';
      } else if (cell.status === 'blocked') {
        cell.status = 'available';
      }

      // Add the new status class
      this.renderer.addClass(cellElement, `status-${cell.status}`);
    }, 300); // Ensure the revert animation completes before applying the new status
  }

  hasError(): boolean {
    const currentMatrix = this.getCurrentLayoutMatrix();
    return currentMatrix.some((row: any) => row.some((cell: any) => cell.hasError));
  }

  getSeatTypeById(seatTypeId: string): SeatType | undefined {
    if (this.seatTypesCache.has(seatTypeId)) {
      return this.seatTypesCache.get(seatTypeId);
    }
    const seatType = this.seatTypes.find((type) => type._id === seatTypeId);
    this.seatTypesCache.set(seatTypeId, seatType);
    return seatType;
  }

  // Áp dụng kiểu vào ô được chọn, không cho phép bỏ chọn khi đang chỉnh sửa
  applyType(row: number, col: number): void {
    const currentMatrix = this.getCurrentLayoutMatrix();
    const cell = currentMatrix[row][col];
    const selectedType = this.seatTypes.find((seatType) => seatType._id === this.currentSeatTypeId);

    // Lưu trạng thái chỉnh sửa hiện tại trước khi áp dụng loại mới
    currentMatrix.forEach((matrixRow: any, i: any) =>
      matrixRow.forEach((cell: any, j: any) => cell.isEditing && this.saveEdit(i, j)),
    );

    // Kiểm tra nếu ô đang chỉnh sửa hoặc có lỗi thì không làm gì
    if (cell.isEditing || this.hasError()) return;

    // Nếu ô đã được chọn và loại hiện tại giống với loại của ô, bỏ chọn ô
    if (cell.typeId === this.currentSeatTypeId) {
      cell.isSelected = false;
      cell.typeId = '';
      cell.allowAutoNameEdit = false; // Cập nhật allowAutoNameEdit
      this.usedNames.delete(cell.name); // Xóa tên khỏi usedNames
      cell.name = '';
    } else {
      this.updateCellType(cell, selectedType);
    }
  }

  updateCellType(cell: any, selectedType: any): void {
    if (selectedType?.isEnv) {
      cell.status = 'blocked'; // Đặt trạng thái là blocked nếu loại là env
    } else {
      cell.status = 'available'; // Đặt trạng thái là available nếu loại không phải env
    }

    cell.typeId = this.currentSeatTypeId; // Cập nhật loại của ô
    cell.isSelected = true; // Đánh dấu ô đã được chọn

    // Cập nhật allowAutoNameEdit theo loại
    cell.allowAutoNameEdit = !selectedType?.isEnv ? true : false;

    //Nếu type bằng env thì xóa bỏ tên
    if (selectedType.isEnv) {
      this.usedNames.delete(cell.name);
      cell.name = '';
    } else {
      const maxNames = this.rows * this.cols;
      for (let i = 1; i <= maxNames; i++) {
        const firstCharacter = String.fromCharCode(65 + this.selectedIndex);
        const name = `${firstCharacter}${i.toString().padStart(2, '0')}`;
        if (!this.usedNames.has(name)) {
          cell.name = `${firstCharacter}${i.toString().padStart(2, '0')}`; // Tạo tên mới cho ô
          this.usedNames.add(cell.name);
          break;
        }
      }
    }

    cell.icon = selectedType.icon; // Cập nhật icon cho ô
  }

  // Hàm focus vào ô đang chỉnh sửa
  focusCell(): void {
    // console.log('🚀 ~ OptionsValueComponent ~ focusCell ~ focusCell:');
    setTimeout(() => {
      if (this.cellInput) {
        this.cellInput.nativeElement.focus();
      }
    }, 0);
  }

  // Bắt đầu nhấn chuột
  onMouseDown(row: number, col: number, event: MouseEvent): void {
    if (this.defaultFlagService.isDefault(this.busLayoutTemplate)) return;

    if (event.button !== 0) return; // Chỉ thực hiện nếu nhấn chuột trái
    event.preventDefault(); // Ngăn chặn hành động mặc định
    this.holdTimeout = setTimeout(() => {
      this.toggleStatus(row, col, event); // Thay đổi trạng thái khi nhấn giữ
      this.holdTimeout = null; // Đặt lại holdTimeout
    }, 1000); // Thời gian nhấn giữ là 1000ms
  }

  // Nhả chuột
  onMouseUp(row: number, col: number, event: MouseEvent): void {
    if (this.defaultFlagService.isDefault(this.busLayoutTemplate)) return;

    if (event.button !== 0) return; // Chỉ thực hiện nếu nhả chuột trái
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.applyType(row, col); // Thực hiện hành động nhấn
    }
    this.holdTimeout = null; // Đặt lại holdTimeout
  }

  // Di chuột ra khỏi ô
  onMouseLeave(event: MouseEvent): void {
    if (this.defaultFlagService.isDefault(this.busLayoutTemplate)) return;

    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.holdTimeout = null; // Đặt lại holdTimeout
    }
  }

  // Nhấn chuột
  onClick(row: number, col: number, event: MouseEvent): void {
    if (this.defaultFlagService.isDefault(this.busLayoutTemplate)) return;

    if (event.button !== 0) return; // Chỉ thực hiện nếu nhấn chuột trái
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.holdTimeout = null; // Đặt lại holdTimeout
      this.applyType(row, col); // Thực hiện hành động nhấn
    }
  }

  // Kiểm tra xem ô có đang ở chế độ chỉnh sửa
  isEditing(row: number, col: number): boolean {
    const currentMatrix = this.getCurrentLayoutMatrix();
    return currentMatrix[row][col].isEditing;
  }

  // Bắt đầu chỉnh sửa ô khi nhấn chuột phải
  startEdit(row: number, col: number, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const currentMatrix = this.getCurrentLayoutMatrix();
    const cell = currentMatrix[row][col];

    const currentCellSeatType = this.seatTypes.find((item) => item._id == cell.currentSeatTypeId);

    if (currentCellSeatType?.isEnv || cell.typeId === '') {
      return;
    }

    this.originalName = cell.name; // Lưu giá trị name hiện tại
    cell.isEditing = true; // Bắt đầu chế độ chỉnh sửa
    this.focusCell();
  }

  saveEdit(row: number, col: number): void {
    event?.preventDefault();
    const currentMatrix = this.getCurrentLayoutMatrix();
    const cell = currentMatrix[row][col];
    const newName = cell.name;

    // Kiểm tra định dạng tên (phải bắt đầu bằng 'A' và theo sau là số từ 01 đến 99)
    const nameFormat = /^[A-Z]\d{2}$/;
    if (!nameFormat.test(newName)) {
      toast.error(this.translate.instant('messages.seatNameInvalid'));
      cell.hasError = true; // Đánh dấu ô có lỗi
      this.focusCell(); // Focus vào ô lỗi
      return;
    }

    // Kiểm tra nếu tên mới đã được sử dụng và khác với tên hiện tại
    if (newName !== this.originalName && this.usedNames.has(newName)) {
      toast.error(this.translate.instant('messages.seatNameAlreadyUsed'));
      cell.hasError = true; // Đánh dấu ô có lỗi
      this.focusCell(); // Focus vào ô lỗi
      return;
    }

    // Xóa tên cũ khỏi danh sách đã sử dụng
    this.usedNames.delete(this.originalName);

    // Thêm tên mới vào danh sách đã sử dụng
    this.usedNames.add(newName);

    cell.hasError = false; // Xóa đánh dấu lỗi
    cell.isEditing = false; // Kết thúc chế độ chỉnh sửa
  }

  clearFormValue(controlName: string, formControls: any) {
    if (this.defaultFlagService.isDefault(this.busLayoutTemplate)) return;

    const control = formControls.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  async onSubmit() {
    const validLayout = this.processValidLayout();
    if (!validLayout) return;

    // Check if there are any changes
    if (!this.hasFormChanged()) {
      return;
    }

    const data = this.busTemplateDetailForm.getRawValue();

    // Chuyển đổi sang cấu trúc class và lọc những seat có typeId
    const busTemplate2Create = new BusLayoutTemplate2Create();
    busTemplate2Create.name = data.name;

    busTemplate2Create.seatLayouts = data.layouts.map((layout: any) => ({
      ...new BusSeatLayoutTemplate(),
      name: layout.name,
      seats: layout.seats
        .flat()
        .filter((seat: any) => seat.typeId) // Lọc những seat có typeId
        .map((seat: any) => ({
          ...new Seat(),
          _id: seat._id,
          index: seat.index,
          typeId: seat.typeId,
          name: seat.name,
          status: seat.status,
        })),
    }));

    if (this.busLayoutTemplate) {
      const busTemplate2Update = {
        ...busTemplate2Create,
        _id: this.busLayoutTemplate._id, // Thêm thuộc tính _id
      };

      this.updateBusLayoutTemplate(busTemplate2Update);
      return;
    }

    this.createBusLayoutTemplate(busTemplate2Create);
  }

  updateBusLayoutTemplate(busTemplate2Update: BusLayoutTemplate2Update) {
    this.busLayoutTemplatesService.updateBusLayoutTemplate(busTemplate2Update).subscribe({
      next: (res: BusLayoutTemplate) => {
        if (res) {
          this.busLayoutTemplate = res;
          const updatedState = { ...history.state, busLayoutTemplate: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success(this.translate.instant('messages.BusLayoutTemplateUpdated'));

          // Update initialFormValue sau khi save thành công (deep clone)
          this.initialFormValue = JSON.parse(JSON.stringify(this.busTemplateDetailForm.getRawValue()));
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBusLayoutTemplate(busTemplate2Create: BusLayoutTemplate2Create) {
    this.busLayoutTemplatesService.createBusLayoutTemplate(busTemplate2Create).subscribe({
      next: (res: BusLayoutTemplate) => {
        if (res) {
          this.busLayoutTemplate = res;
          const updatedState = { ...history.state, busLayoutTemplate: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.router.navigate([], { queryParams: { id: res._id } });
          toast.success(this.translate.instant('messages.BusLayoutTemplateCreated'));

          // Update initialFormValue sau khi save thành công (deep clone)
          this.initialFormValue = JSON.parse(JSON.stringify(this.busTemplateDetailForm.getRawValue()));
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  async processValidLayout() {
    let hasErrorMatrix = false;
    let indexLayoutHasError = -1;
    await Promise.all(
      this.layouts.controls.map(async (layout: any, index: number) => {
        const seats = layout.get('seats').value;
        if (!seats) {
          return;
        }
        const hasErrorInLayout = seats.some((row: any) => row.some((cell: any) => cell.hasError));

        if (hasErrorInLayout) {
          hasErrorMatrix = true; // Đặt hasErrorMatrix thành true nếu có lỗi
          if (indexLayoutHasError !== 0) {
            indexLayoutHasError = index; // Gán index nếu chưa là 0
          }
        }
      }),
    );

    if (hasErrorMatrix) {
      toast.error(this.translate.instant('messages.seatNameInvalid'));
      this.selectedIndex = indexLayoutHasError;
    }
    return !hasErrorMatrix;
  }

  async resetLayout() {
    this.usedNames.clear();
    this.layouts.controls[this.selectedIndex].get('seats')?.patchValue(await this.initializeMaTrix());
  }
}
