import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';
import { AccountInfoComponent } from './pages/account-detail/components/account-info/account-info.component';
import { AccountPasswordComponent } from './pages/account-detail/components/account-password/account-password.component';
import { AccountInformationRoutingModule } from './account-information-routing.module';
import { ManagementSharedModule } from '../management/management-share.module';
import { MaterialModule } from '../../library-modules/material-module';
import { FilesCenterManagementModule } from '../management/modules/files-center-management/files-center-management.module';
import { MyTenantSubscriptionListComponent } from './pages/account-detail/components/my-tenant-subscription/my-tenant-subscriptioncomponent';

@NgModule({
  declarations: [
    AccountDetailComponent,
    AccountInfoComponent,
    AccountPasswordComponent,
    MyTenantSubscriptionListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountInformationRoutingModule,
    ManagementSharedModule,
    MaterialModule,
    FilesCenterManagementModule,
  ],
  exports: [],
})
export class AccountInformationModule {}
