import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { SettingManagementRoutingModule } from './setting-management-routing.module';
import { SettingManagementComponent } from './setting-management.component';

@NgModule({
  declarations: [SettingManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SettingManagementRoutingModule],
  exports: [],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingManagementModule {}
