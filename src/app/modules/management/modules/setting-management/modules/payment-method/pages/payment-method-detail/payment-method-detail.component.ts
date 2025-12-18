import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { combineLatest } from 'rxjs';
import { PaymentMethod, PaymentMethod2Create, PaymentMethod2Update } from '../../model/payment-method.model';
import { PaymentMethodService } from '../../service/payment-method.service';
import { FilesCenterDialogComponent } from '@rsApp/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from '@rsApp/modules/management/modules/files-center-management/model/file-center.model';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import {
  COMMON_STATUS_CLASSES,
  COMMON_STATUS_LABELS,
  PAYMENT_METHOD_TYPES,
} from '@rsApp/core/constants/status.constants';

@Component({
  selector: 'app-payment-method-detail',
  templateUrl: './payment-method-detail.component.html',
  styleUrls: ['./payment-method-detail.component.scss'],
  standalone: false,
})
export class PaymentMethodDetailComponent implements OnInit {
  mainForm!: FormGroup;

  @Input() paymentMethod!: PaymentMethod;
  @Input() isDialog: boolean = false;

  paymentMethodImageFile!: File;
  paymentMethodImage!: string;

  mode: 'create' | 'update' = 'create';

  statusClasses = COMMON_STATUS_CLASSES;

  paymentMethodStatuses = Object.entries(COMMON_STATUS_LABELS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  paymentMethodsTypes = Object.entries(PAYMENT_METHOD_TYPES).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  private initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private paymentMethodService: PaymentMethodService,
    private utilsModal: UtilsModal,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    if (this.paymentMethod) {
      this.mode = 'update';
    }
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['paymentMethod']) {
      this.paymentMethod = params['paymentMethod'] ? params['paymentMethod'] : null;
      console.log('🚀 ~ PaymentMethodDetailComponent ~ getQueryParams ~ this.paymentMethod:', this.paymentMethod);
    }
  }

  async initData() {
    this.initForm();
  }

  async initForm() {
    const {
      image = '',
      imageId = '',
      name = '',
      type = 'cash',
      note = '',
      status = 'active',
      isPaymentMethodDefault = false,
    } = this.paymentMethod || {};

    this.paymentMethodImage = image ?? null;
    this.mainForm = this.fb.group({
      imageId: [
        { value: imageId, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        Validators.required,
      ],
      name: [{ value: name, disabled: this.defaultFlagService.isDefault(this.paymentMethod) }, [Validators.required]],
      type: [{ value: type, disabled: this.defaultFlagService.isDefault(this.paymentMethod) }, [Validators.required]],
      note: [{ value: note, disabled: this.defaultFlagService.isDefault(this.paymentMethod) }],
      status: [
        { value: status, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        [Validators.required],
      ],
      isPaymentMethodDefault: [
        { value: isPaymentMethodDefault, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
      ],
    });

    this.initPaymentMethodTypeData(type);
    this.initialFormValue = this.mainForm.getRawValue();
  }

  onTypeChange(type: any) {
    this.initPaymentMethodTypeData(type);
  }

  initPaymentMethodTypeData(type: string) {
    if (type == 'cash') {
      return;
    }

    const banking: any = this.paymentMethod?.banking || {};

    const { token = '', bankName = '', accountNumber = '', accountName = '', providerId = '' } = banking;

    this.mainForm.addControl(
      'accountName',
      new FormControl(
        { value: accountName, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        Validators.required,
      ),
    );
    this.mainForm.addControl(
      'accountNumber',
      new FormControl(
        { value: accountNumber, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        Validators.required,
      ),
    );
    this.mainForm.addControl(
      'bankName',
      new FormControl(
        { value: bankName, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        Validators.required,
      ),
    );
    this.mainForm.addControl(
      'token',
      new FormControl(
        { value: token, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        Validators.required,
      ),
    );
    this.mainForm.addControl(
      'providerId',
      new FormControl(
        { value: providerId, disabled: this.defaultFlagService.isDefault(this.paymentMethod) },
        Validators.required,
      ),
    );
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.mainForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  backPage() {
    if (this.hasFormChanged()) {
      this.utilsModal
        .openModalConfirm('Lưu ý', 'Bạn có thay đổi chưa lưu, bạn có chắc muốn đóng không?', 'warning')
        .subscribe((result: any) => {
          if (result) {
            this.location.back();

            return;
          }
        });
    } else {
      this.location.back();
    }
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    this.paymentMethodImageFile = file;

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
      this.paymentMethodImage = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.paymentMethodImage = '';
    this.mainForm.patchValue({ imageId: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;

      // Nếu .link đã trả về URL đầy đủ thì dùng luôn
      this.paymentMethodImage = files[0].link;
      this.mainForm.patchValue({ imageId: files[0]._id });
    });
  }

  setDefaultValues2Create(data: any) {}

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    // Check if there are any changes
    if (!this.hasFormChanged()) {
      return;
    }

    const data = this.mainForm.getRawValue();

    this.setDefaultValues2Create(data);

    const paymentMethod2Create: PaymentMethod2Create = {
      ...data,
    };

    if (data.type !== 'cash') {
      paymentMethod2Create.banking = {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        token: data.token,
        providerId: data.providerId,
      };
    }

    let dataTransfer = new DataTransfer();
    if (this.paymentMethodImageFile) {
      dataTransfer.items.add(this.paymentMethodImageFile);
    }
    const files: FileList = dataTransfer.files;

    let request = [];
    let actionName = 'create';

    if (this.mode == 'update') {
      const paymentMethod2Update: PaymentMethod2Update = {
        ...paymentMethod2Create,
        _id: this.paymentMethod._id, // Thêm thuộc tính _id
      };
      actionName = 'update';
      request.push(this.updatePaymentMethod(files, paymentMethod2Update));
    } else {
      request.push(this.createPaymentMethod(files, paymentMethod2Create));
    }

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == 'update') {
          const paymentMethodUpdated = {
            ...res[0],
            image: this.paymentMethodImage,
          };

          const updatedState = { ...history.state, paymentMethod: paymentMethodUpdated };
          window.history.replaceState(updatedState, '', window.location.href);
          this.initialFormValue = this.mainForm.getRawValue();
          toast.success('PaymentMethod update successfully');
          return;
        }
        toast.success('PaymentMethod added successfully');
        this.backPage();
      },
      error: (error: any) => this.utils.handleRequestError(error), // Xử lý lỗi
    });
  }

  updatePaymentMethod(files: FileList, PaymentMethod2Update: PaymentMethod2Update) {
    return this.paymentMethodService.processUpdatePaymentMethod(files, PaymentMethod2Update);
  }

  createPaymentMethod(files: FileList, PaymentMethod2Create: PaymentMethod2Create) {
    return this.paymentMethodService.processCreatePaymentMethod(files, PaymentMethod2Create);
  }

  formatTime(date: Date | undefined) {
    if (!date) return;
    date = new Date(date);
    return this.utils.formatTime(date);
  }

  formatDate(date: Date | undefined) {
    if (!date) return;
    return this.utils.formatDate(date);
  }

  clearFormValue(controlName: string) {
    const control = this.mainForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }
}
