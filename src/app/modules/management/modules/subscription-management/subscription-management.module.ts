import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { SubscriptionDetailComponent } from './pages/subscription-detail/subscription-detail.component';
import { SubscriptionManagementRoutingModule } from './subscription-management-routing.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';
import { JsonInputComponent } from '@rsApp/shared/components/json-input/json-input.component';
import { ManagementSharedModule } from '../../management-share.module';

@NgModule({
  declarations: [SubscriptionComponent, SubscriptionDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubscriptionManagementRoutingModule,
    ManagementSharedModule,
    FilesCenterManagementModule,
    NZModule,
    JsonInputComponent,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SubscriptionManagementModule {}
