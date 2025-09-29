import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { async, combineLatest, tap } from 'rxjs';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { BusRoute } from '../../../bus-management/pages/bus-routes/model/bus-route.model';
import { BusRoutesService } from '../../../bus-management/pages/bus-routes/service/bus-routes.servive';
import { BusSchedule } from '../../../bus-management/pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../../bus-management/pages/bus-schedules/service/bus-schedules.servive';
import { Promotion, Promotion2Create, Promotion2Update } from '../../model/promotion.model';
import { PromotionService } from '../../service/promotion.service';
import { SubscriptionService } from '../../../subscription-management/service/subscription.service';
import { Subscription } from '../../../subscription-management/model/subscription.model';
import { FilesCenterDialogComponent } from '../../../files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from '../../../files-center-management/model/file-center.model';
import { ENV } from 'src/environments/environment.development';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.component.html',
  styleUrl: './promotion-detail.component.scss',
  standalone: false,
})
export class PromotionDetailComponent implements OnInit {
  @ViewChild('pdfContentInvoice', { static: false }) pdfContentInvoice!: ElementRef;
  @ViewChild('pdfContentShippingLabel', { static: false }) pdfContentShippingLabel!: ElementRef;

  mainForm!: FormGroup;

  @Input() promotion!: Promotion;
  @Input() isDialog: boolean = false;

  promotionImageFile!: File;
  promotionImage!: string;

  mode: 'create' | 'update' = 'create';

  promotionStatuses = [
    {
      value: 'active',
      label: 'Đang hoạt động',
    },
    {
      value: 'inactive',
      label: 'Ngừng hoạt động',
    },
    {
      value: 'blocked',
      label: 'Đã chặn',
    },
    {
      value: 'archived',
      label: 'Đã lưu trữ',
    },
  ];

  paidByList = [
    { value: 'sender', label: 'Người gửi' },
    { value: 'customer', label: 'Người nhận' },
  ];

  promotionsDiscountTypes = [
    { value: 'percentage', label: 'Phần trăm (%)' },
    { value: 'fixed', label: 'Số tiền cố định' },
  ];

  searchKeywordBusSchedule: string = '';

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private promotionService: PromotionService,
    private utilsModal: UtilsModal,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    if (this.promotion) {
      this.mode = 'update';
    }
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['promotion']) {
      this.promotion = params['promotion'] ? params['promotion'] : null;
      console.log('🚀 ~ PromotionDetailComponent ~ getQueryParams ~ this.promotion:', this.promotion);
    }
  }

  async initData() {
    this.initForm();
  }

  onSearch(keyword: string) {
    this.searchKeywordBusSchedule = keyword;
  }

  async initForm() {
    const {
      image = '',
      imageId = '',
      name = '',
      code = '',
      description = '',
      discountType = 'percentage',
      discountValue = '',
      expireDate = '',
      status = 'active',
    } = this.promotion || {};

    this.promotionImage = image ?? null;
    this.mainForm = this.fb.group({
      imageId: [imageId, Validators.required],
      name: [name, [Validators.required]],
      code: [code, [Validators.required]],
      description: [description],
      discountType: [discountType, [Validators.required]],
      discountValue: [discountValue, [Validators.required]],
      expireDate: [expireDate, [Validators.required]],
      status: [status, [Validators.required]],
    });
  }

  optionalValidator(validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return null; // Không validate nếu không có giá trị
      }
      return validator(control); // Thực hiện validate khi có giá trị
    };
  }

  backPage() {
    this.location.back();
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    this.promotionImageFile = file;

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
      this.promotionImage = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.promotionImage = '';
    this.mainForm.patchValue({ avatar: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;

      // Nếu .link đã trả về URL đầy đủ thì dùng luôn
      this.promotionImage = files[0].link;
      this.mainForm.patchValue({ imageId: files[0]._id });
    });
  }

  setDefaultValues2Create(data: any) {}

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    const data = this.mainForm.getRawValue();

    this.setDefaultValues2Create(data);

    const Promotion2Create: Promotion2Create = {
      ...data,
    };
    let dataTransfer = new DataTransfer();
    if (this.promotionImageFile) {
      dataTransfer.items.add(this.promotionImageFile);
    }
    const files: FileList = dataTransfer.files;

    let request = [];
    let actionName = 'create';

    if (this.mode == 'update') {
      const Promotion2Update: Promotion2Update = {
        ...Promotion2Create,
        _id: this.promotion._id, // Thêm thuộc tính _id
      };
      actionName = 'update';
      request.push(this.updatePromotion(files, Promotion2Update));
    } else {
      request.push(this.createPromotion(files, Promotion2Create));
    }

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == 'update') {
          const promotionUpdated = {
            ...res[0],
            image: this.promotionImage,
          };

          const updatedState = { ...history.state, promotion: promotionUpdated };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Promotion update successfully');
          return;
        }
        toast.success('Promotion added successfully');
        this.backPage();
      },
      error: (error: any) => this.utils.handleRequestError(error), // Xử lý lỗi
    });
  }

  updatePromotion(files: FileList, Promotion2Update: Promotion2Update) {
    return this.promotionService.processUpdatePromotion(files, Promotion2Update);
  }

  createPromotion(files: FileList, Promotion2Create: Promotion2Create) {
    return this.promotionService.processCreatePromotion(files, Promotion2Create);
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
