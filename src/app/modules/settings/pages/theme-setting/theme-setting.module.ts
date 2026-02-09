import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeSettingRoutingModule } from './theme-setting-routing.module';
import { MaterialModule } from '@rsApp/library-modules/material-module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilesCenterManagementModule } from '@rsApp/modules/management/modules/files-center-management/files-center-management.module';
import { ThemeSettingComponent } from './theme-setting.component';

@NgModule({
  declarations: [ThemeSettingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ThemeSettingRoutingModule,
    MaterialModule,
    NZModule,
    AngularSvgIconModule,
    FilesCenterManagementModule,
  ],
})
export class ThemeSettingModule {}
