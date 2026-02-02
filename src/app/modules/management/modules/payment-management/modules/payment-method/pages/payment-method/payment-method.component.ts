import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Subscription } from 'rxjs';
import { MaterialDialogComponent } from '@rsApp/shared/components/material-dialog/material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { CapsService } from '@rsApp/shared/services/caps.service';
import { SearchPaymentMethod, PaymentMethod, PaymentMethod2Create } from '../../model/payment-method.model';
import { PaymentMethodService } from '../../service/payment-method.service';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { COMMON_STATUS_CLASSES, COMMON_STATUS_LABELS } from 'src/app/core/constants/status.constants';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  standalone: false,
})
export class PaymentMethodComponent implements OnInit {
  eventSubscription!: Subscription[];

  searchPaymentMethod!: SearchPaymentMethod;

  searchParams = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: {
      key: '',
      value: [],
    },
  };

  isLoadingPaymentMethod: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  filterRoles = [
    { text: 'User', value: 'user' },
    { text: 'Driver', value: 'driver' },
  ];

  totalPage: number = 0;
  totalItem: number = 0;

  statusClasses = COMMON_STATUS_CLASSES;

  paymentMethodStatuses = COMMON_STATUS_LABELS;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private router: Router,
    private paymentMethodService: PaymentMethodService,
    private dialog: MatDialog,
    public capsService: CapsService,
    public defaultFlagService: DefaultFlagService,
  ) {
    console.log('PaymentMethodComponent constructor called!');
    this.eventSubscription = [];
    this.searchPaymentMethod = {
      paymentMethods: [],
      totalItem: 0,
      totalPage: 0,
      pageIdx: 0,
    };
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    this.initListenEvent();
  }

  initListenEvent() {}

  loadData(): void {
    this.loadPaymentMethod();
  }

  loadPaymentMethod() {
    this.isLoadingPaymentMethod = true;
    this.paymentMethodService.searchPaymentMethod(this.searchParams).subscribe({
      next: (res: SearchPaymentMethod) => {
        if (res) {
          this.searchPaymentMethod = res;
          this.totalItem = this.searchPaymentMethod.totalItem;
          this.totalPage = this.searchPaymentMethod.totalPage;
        }
        this.isLoadingPaymentMethod = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingPaymentMethod = false;
      },
    });
  }

  reloadPaymentMethodPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchGoodPage(keyword: any) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadData();
  }

  sortGoodPage(event: any) {
    const sortBy = event as { key: string; value: string };
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadData();
  }

  onCurrentPageDataChange(event: any): void {
    const paymentMethod = event as readonly PaymentMethod[];
    this.searchPaymentMethod.paymentMethods = [...paymentMethod];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchPaymentMethod.paymentMethods;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchPaymentMethod.paymentMethods.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(_id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(_id);
    } else {
      this.setOfCheckedId.delete(_id);
    }
  }

  onItemChecked(_id: string, checked: boolean): void {
    this.updateCheckedSet(_id, checked);
    this.refreshCheckedStatus();
  }

  addPaymentMethod() {
    this.router.navigate(['/management/payment-management/payment-method/detail']);
  }

  editPaymentMethod(paymentMethod: PaymentMethod) {
    this.router.navigate(['/management/payment-management/payment-method/detail'], { state: { paymentMethod } });
  }

  deletePaymentMethod(paymentMethod: PaymentMethod): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete SeatType',
        content:
          'Are you sure you want to delete this seatType? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentMethodService.deletePaymentMethod(paymentMethod._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchPaymentMethod.paymentMethods = this.searchPaymentMethod.paymentMethods.filter(
                (pm) => pm._id !== paymentMethod._id,
              );
              toast.success('PaymentMethod Category deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  cloneData(paymentMethod: PaymentMethod): void {
    delete (paymentMethod as any)._id;

    if (!paymentMethod.banking || Object.keys(paymentMethod.banking).length === 0) {
      delete (paymentMethod as any).banking;
    }

    let paymentMethod2Create = new PaymentMethod2Create();
    paymentMethod2Create = { ...paymentMethod2Create, ...paymentMethod };

    this.paymentMethodService.createPaymentMethod(paymentMethod2Create).subscribe({
      next: (res: PaymentMethod) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    this.utilsModal.viewImage($event, image);
  }
}
