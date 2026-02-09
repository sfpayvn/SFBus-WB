import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrganizationSettingRoutingModule } from './organization-setting-routing.module';
import { MaterialModule } from '@rsApp/library-modules/material-module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { OrganizationSettingComponent } from './organization-setting.component';

@NgModule({
  declarations: [OrganizationSettingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OrganizationSettingRoutingModule,
    MaterialModule,
    NZModule,
    AngularSvgIconModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class OrganizationSettingModule {}
