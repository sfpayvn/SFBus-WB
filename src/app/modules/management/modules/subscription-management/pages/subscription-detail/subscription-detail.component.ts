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
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { SubscriptionService } from '../../service/subscription.service';
import { LoadingService } from '@rsApp/shared/services/loading.service';
import { Subscription, Subscription2Create, Subscription2Update } from '../../model/subscription.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrl: './subscription-detail.component.scss',
  standalone: false,
})
export class SubscriptionDetailComponent implements OnInit {
  mainForm!: FormGroup;

  @Input() subscription!: Subscription;
  @Input() isDialog: boolean = false;

  mode: 'create' | 'update' = 'create';

  subscriptionStatuses = [
    {
      value: 'active',
      label: 'Đang hoạt động',
    },
    {
      value: 'inactive',
      label: 'Ngừng hoạt động',
    },
  ];

  durationUnits = [
    {
      value: 'day',
      label: 'Ngày',
    },
    {
      value: 'week',
      label: 'Tuần',
    },
    {
      value: 'month',
      label: 'Tháng',
    },
    {
      value: 'year',
      label: 'Năm',
    },
  ];

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private subscriptionService: SubscriptionService,
    private utilsModal: UtilsModal,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
    if (this.subscription) {
      this.mode = 'update';
    }
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['subscription']) {
      this.subscription = params['subscription'] ? params['subscription'] : null;
      console.log('🚀 ~ SubscriptionDetailComponent ~ getQueryParams ~ this.subscription:', this.subscription);
    }
  }

  async initData() {
    this.initForm();
  }

  async initForm() {
    const {
      name = '',
      price = 0,
      duration = 1,
      durationUnit = 'month',
      limitation = '',
      description = '',
      status = 'active',
    } = this.subscription || {};

    this.mainForm = this.fb.group({
      name: [name, [Validators.required]],
      price: [price, [Validators.required]],
      description: [description],
      duration: [duration, [Validators.required]],
      durationUnit: [durationUnit, [Validators.required]],
      limitation: [JSON.stringify(limitation, null, 2)],
      status: [status, [Validators.required]],
    });
  }

  backPage() {
    this.location.back();
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    const data = this.mainForm.getRawValue();

    const subscription2Create: Subscription2Create = {
      ...data,
    };

    let request = [];
    let actionName = 'create';

    if (this.mode == 'update') {
      const subscription2Update: Subscription2Update = {
        ...subscription2Create,
        _id: this.subscription._id, // Thêm thuộc tính _id
      };
      actionName = 'update';
      request.push(this.updatePromotion(subscription2Update));
    } else {
      request.push(this.createPromotion(subscription2Create));
    }

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == 'update') {
          const subscriptionUpdated = {
            ...res[0],
          };

          const updatedState = { ...history.state, subscription: subscriptionUpdated };
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

  updatePromotion(subscription2Update: Subscription2Update) {
    return this.subscriptionService.updateSubscription(subscription2Update);
  }

  createPromotion(subscription2Create: Subscription2Create) {
    return this.subscriptionService.createSubscription(subscription2Create);
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
