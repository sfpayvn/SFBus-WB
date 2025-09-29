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
import { Tenant, Tenant2Create, Tenant2Update } from '../../model/tenant.model';
import { TenantService } from '../../service/tenant.service';
import { SubscriptionService } from '../../../subscription-management/service/subscription.service';
import { Subscription } from '../../../subscription-management/model/subscription.model';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss',
  standalone: false,
})
export class TenantDetailComponent implements OnInit {
  @ViewChild('pdfContentInvoice', { static: false }) pdfContentInvoice!: ElementRef;
  @ViewChild('pdfContentShippingLabel', { static: false }) pdfContentShippingLabel!: ElementRef;

  mainForm!: FormGroup;

  @Input() tenant!: Tenant;
  @Input() isDialog: boolean = false;

  subscriptions: Subscription[] = [];

  tenantImageFile!: File;
  tenantImage!: string;

  defaultImage = 'assets/images/tenant-deail.png';

  mode: 'create' | 'update' = 'create';

  tenantStatuses = [
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

  searchKeywordBusSchedule: string = '';

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private tenantService: TenantService,
    private utilsModal: UtilsModal,
    private loadingService: LoadingService,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    if (this.tenant) {
      this.mode = 'update';
    }
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['tenant']) {
      this.tenant = params['tenant'] ? params['tenant'] : null;
      console.log('🚀 ~ TenantDetailComponent ~ getQueryParams ~ this.tenant:', this.tenant);
    }
  }

  async initData() {
    const findAllSubscription = this.subscriptionService.findAll(); // lấy data to test
    combineLatest([findAllSubscription]).subscribe({
      next: ([subscriptions]) => {
        this.subscriptions = subscriptions;
        console.log('🚀 ~ TenantDetailComponent ~ initData ~ this.subscriptions:', this.subscriptions);
        this.initForm();
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  onSearch(keyword: string) {
    this.searchKeywordBusSchedule = keyword;
  }

  async initForm() {
    const {
      logo = '',
      name = '',
      code = '',
      phoneNumber = '',
      email = '',
      address = '',
      status = 'active',
      setting = new Tenant().setting,
    } = this.tenant || {};

    this.tenantImage = logo ? logo : this.defaultImage;
    this.mainForm = this.fb.group({
      logo: [logo],
      name: [name, [Validators.required]],
      code: [code, [Validators.required]],
      phoneNumber: [phoneNumber, [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
      email: [email, [this.optionalValidator(Validators.email)]],
      address: [address],
      status: [status, [Validators.required]],
      setting: this.fb.group({
        appearance: [setting?.appearance || ''],
        timezone: [setting?.timezone || ''],
      }),
      subscriptionId: [this.tenant?.subscriptionId || ''],
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
    this.tenantImageFile = file;

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
      this.tenantImage = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.tenantImage = '';
    this.mainForm.patchValue({ avatar: '' });
  }

  openFilesCenterDialog() {}

  setDefaultValues2Create(data: any) {}

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    const data = this.mainForm.getRawValue();

    this.setDefaultValues2Create(data);

    const Tenant2Create: Tenant2Create = {
      ...data,
    };
    let dataTransfer = new DataTransfer();
    if (this.tenantImageFile) {
      dataTransfer.items.add(this.tenantImageFile);
    }
    const files: FileList = dataTransfer.files;

    let request = [];
    let actionName = 'create';

    if (this.mode == 'update') {
      const Tenant2Update: Tenant2Update = {
        ...Tenant2Create,
        _id: this.tenant._id, // Thêm thuộc tính _id
      };
      actionName = 'update';
      request.push(this.updateTenant(files, Tenant2Update));
    } else {
      request.push(this.createTenant(files, Tenant2Create));
    }

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == 'update') {
          const updatedState = { ...history.state, tenant: res[0] };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Tenant update successfully');
          return;
        }
        toast.success('Tenant added successfully');
        this.backPage();
      },
      error: (error: any) => this.utils.handleRequestError(error), // Xử lý lỗi
    });
  }

  updateTenant(files: FileList, Tenant2Update: Tenant2Update) {
    return this.tenantService.processUpdateTenant(files, Tenant2Update);
  }

  createTenant(files: FileList, Tenant2Create: Tenant2Create) {
    return this.tenantService.processCreateTenant(files, Tenant2Create);
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
