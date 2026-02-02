import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TenantComponent } from './pages/tenant/tenant.component';
import { TenantDetailComponent } from './pages/tenant-detail/tenant-detail.component';
import { TenantManagementRoutingModule } from './tenant-management-routing.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';
import { TenantSubscriptionListComponent } from './components/tenant-subscription/tenant-subscription-list.component';
import { ChooseSubscriptionDialogComponent } from './components/choose-subscription-dialog/choose-subscription-dialog.component';
import { ManagementSharedModule } from '../../management-share.module';

@NgModule({
  declarations: [
    TenantComponent,
    TenantDetailComponent,
    TenantSubscriptionListComponent,
    ChooseSubscriptionDialogComponent,
  ],
  exports: [TenantSubscriptionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenantManagementRoutingModule,
    ManagementSharedModule,
    FilesCenterManagementModule,
    NZModule,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TenantManagementModule {}
