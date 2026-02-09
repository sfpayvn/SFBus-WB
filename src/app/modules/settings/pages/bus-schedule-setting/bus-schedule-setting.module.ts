import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BusScheduleSettingRoutingModule } from './bus-schedule-setting-routing.module';
import { MaterialModule } from '@rsApp/library-modules/material-module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuillModule } from 'ngx-quill';
import { BusScheduleSettingComponent } from './bus-schedule-setting.component';

@NgModule({
  declarations: [BusScheduleSettingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BusScheduleSettingRoutingModule,
    MaterialModule,
    NZModule,
    AngularSvgIconModule,
    QuillModule,
  ],
})
export class BusScheduleSettingModule {}
