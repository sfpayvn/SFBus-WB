import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { combineLatest } from 'rxjs';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { Tenant, Tenant2Create, Tenant2Update } from '../../model/tenant.model';
import { TenantService } from '../../service/tenant.service';
import { SubscriptionService } from '../../../subscription-management/service/subscription.service';
import { Subscription, RegisterToSubscription } from '../../../subscription-management/model/subscription.model';
import { ChooseSubscriptionDialogComponent } from '../../components/choose-subscription-dialog/choose-subscription-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TenantSubscriptionService } from '../../service/tenant-subscription.service';
import { TenantSubscriptionListComponent } from '../../components/tenant-subscription/tenant-subscription-list.component';
import { COMMON_STATUS, COMMON_STATUS_OPTIONS } from '@rsApp/core/constants/status.constants';
import { FilesCenterDialogComponent } from '../../../files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from '../../../files-center-management/model/file-center.model';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss',
  standalone: false,
})
export class TenantDetailComponent implements OnInit {
  @ViewChild('pdfContentInvoice', { static: false }) pdfContentInvoice!: ElementRef;
  @ViewChild('pdfContentShippingLabel', { static: false }) pdfContentShippingLabel!: ElementRef;
  @ViewChild('tenantSubscriptionList', { static: false }) tenantSubscriptionList!: TenantSubscriptionListComponent;

  mainForm!: FormGroup;

  @Input() tenant!: Tenant;
  @Input() isDialog: boolean = false;

  subscriptions: Subscription[] = [];

  defaultImage = 'assets/images/tenant-deail.png';

  mode: 'create' | 'update' = 'create';

  tenantStatuses = COMMON_STATUS_OPTIONS;

  tenantAvartaFile!: File;
  tenantAvarta!: string;

  defaultAvatar = 'assets/icons/user.svg';

  searchKeywordBusSchedule: string = '';

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private tenantService: TenantService,
    private tenantSubscriptionService: TenantSubscriptionService,
    private utilsModal: UtilsModal,
    private loadingService: LoadingService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
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
      logoId = '',
      logo = '',
      name = '',
      code = '',
      phoneNumber = '',
      email = '',
      address = '',
      status = 'active',
      setting = new Tenant().setting,
    } = this.tenant || {};

    this.tenantAvarta = logo ? logo : this.defaultAvatar;
    this.mainForm = this.fb.group({
      logoId: [logoId],
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

  get f() {
    return this.mainForm.controls;
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

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      this.tenantAvarta = file.link;
      this.mainForm.patchValue({ logoId: file._id });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tenantAvartaFile = file;
        this.tenantAvarta = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFileImage() {
    this.tenantAvarta = '';
    this.mainForm.patchValue({ avatar: '' });
  }

  setDefaultValues2Create(data: any) {}

  addNewSubscription() {
    const dialogRef = this.dialog.open(ChooseSubscriptionDialogComponent, {
      data: {
        title: 'Choose Subscription',
        tenantId: this.tenant?._id || '',
      },
      panelClass: 'dialog-large',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const registerToSubscription: RegisterToSubscription = {
          tenantId: this.tenant?._id || '',
          subscriptionId: result._id,
          startDate: new Date(),
          duration: result.duration,
          replaceCurrent: true,
        };
        this.tenantSubscriptionService.registerForTenant(registerToSubscription).subscribe({
          next: (response) => {
            console.log('🚀 ~ TenantDetailComponent ~ addNewSubscription ~ response:', response);
            toast.success('Tenant subscription registered successfully');

            // Refresh data trong tenant subscription list component
            if (this.tenantSubscriptionList) {
              this.tenantSubscriptionList.refreshData();
            }
          },
          error: (error) => this.utils.handleRequestError(error),
        });
      }
    });
  }

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
    if (this.tenantAvartaFile) {
      dataTransfer.items.add(this.tenantAvartaFile);
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
