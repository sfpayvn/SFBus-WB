import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MangementModule } from '../../management.module';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { CreateEditUserAddressDialogComponent } from './component/create-edit-user-address-dialog/create-edit-user-address-dialog.component';
import { UsersManagementRoutingModule } from './users-management-routing.module';

@NgModule({
  declarations: [
    UsersComponent,

    UserDetailComponent,
    CreateEditUserAddressDialogComponent,
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
