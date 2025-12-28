import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DefaultSettingRoutingModule } from './default-setting-routing.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { MatDialogModule } from '@angular/material/dialog';
import { DefaultSettingComponent } from './default-setting.component';
import { DefaultSettingDetailDialogComponent } from './component/default-setting-detail-dialog/default-setting-detail-dialog.component';
import { ManagementSharedModule } from '@rsApp/modules/management/management-share.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DefaultSettingComponent, DefaultSettingDetailDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, DefaultSettingRoutingModule, NZModule, MatDialogModule, ManagementSharedModule, QuillModule],
})
export class DefaultSettingModule {}
