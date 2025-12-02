import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './pages/booking/booking.component';
import { BookingDetailComponent } from './pages/booking-detail/booking-detail.component';

const routes: Routes = [
  {
    path: 'booking',
    component: BookingComponent,
  },
  {
    path: 'booking/detail',
    component: BookingDetailComponent,
  },
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingManagementRoutingModule {}
