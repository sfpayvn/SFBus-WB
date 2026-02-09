import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CapCheckDirective } from '@rsApp/shared/directives/cap-check.directive';

import { NotificationScheduleManagementComponent } from './pages/notification-schedule-management/notification-schedule-management.component';
import { NotificationScheduleService } from './services/notification-schedule.service';
import { MaterialModule } from '@rsApp/library-modules/material-module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { NotificationScheduleRoutingModule } from './notification-schedule-routing.module';
import { ManagementSharedModule } from '@rsApp/modules/management/management-share.module';
import { NotificationScheduleDetailComponent } from './pages/notification-schedule-detail/notification-schedule-detail.component';

@NgModule({
  declarations: [NotificationScheduleManagementComponent, NotificationScheduleDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NZModule,
    CapCheckDirective,
    NotificationScheduleRoutingModule,
    ManagementSharedModule,
  ],
  providers: [NotificationScheduleService],
})
export class NotificationScheduleModule {}
