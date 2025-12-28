import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { PaymentManagementRoutingModule } from './payment-management-routing.module';
import { PaymentManagementComponent } from './payment-management.component';

@NgModule({
  declarations: [PaymentManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaymentManagementRoutingModule],
  exports: [],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentManagementModule {}
