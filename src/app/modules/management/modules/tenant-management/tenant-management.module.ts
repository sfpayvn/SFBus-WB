import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MangementModule } from '../../management.module';
import { TenantComponent } from './pages/tenant/tenant.component';
import { TenantDetailComponent } from './pages/tenant-detail/tenant-detail.component';
import { TenantManagementRoutingModule } from './tenant-management-routing.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';
import { TenantSubscriptionListComponent } from './components/tenant-subscription/tenant-subscription-list.component';

@NgModule({
  declarations: [TenantComponent, TenantDetailComponent, TenantSubscriptionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenantManagementRoutingModule,
    MangementModule,
    FilesCenterManagementModule,
    NZModule,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TenantManagementModule {}
