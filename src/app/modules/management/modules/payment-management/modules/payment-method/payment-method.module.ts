import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';
import { PaymentMethodDetailComponent } from './pages/payment-method-detail/payment-method-detail.component';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { PaymentMethodRoutingModule } from './payment-method-routing.module';
import { ManagementSharedModule } from '@rsApp/modules/management/management-share.module';
import { FilesCenterManagementModule } from '../../../files-center-management/files-center-management.module';

@NgModule({
  declarations: [PaymentMethodComponent, PaymentMethodDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentMethodRoutingModule,
    ManagementSharedModule,
    FilesCenterManagementModule,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentMethodModule {}
