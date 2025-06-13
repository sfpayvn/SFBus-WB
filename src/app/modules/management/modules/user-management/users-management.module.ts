import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MangementModule } from '../../management.module';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserAddressDetailDialogComponent } from './component/user-address-detail-dialog/user-address-detail-dialog.component';
import { UsersManagementRoutingModule } from './users-management-routing.module';

@NgModule({
  declarations: [
    UsersComponent,

    UserDetailComponent,
    UserAddressDetailDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersManagementRoutingModule,
    MangementModule,
  ],
  exports: [

  ],
  providers: [
    provideNgxMask()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class UsersManagementModule { }
