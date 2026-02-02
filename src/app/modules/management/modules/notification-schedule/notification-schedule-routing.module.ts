import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationScheduleManagementComponent } from './pages/notification-schedule-management/notification-schedule-management.component';
import { NotificationScheduleDetailComponent } from './pages/notification-schedule-detail/notification-schedule-detail.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationScheduleManagementComponent,
  },
  {
    path: 'detail/:id',
    component: NotificationScheduleDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationScheduleRoutingModule {}
