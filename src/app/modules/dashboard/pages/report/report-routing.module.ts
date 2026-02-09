import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';
import { BookingReportComponent } from './pages/booking-report/booking-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
  },
  {
    path: 'booking',
    component: BookingReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
