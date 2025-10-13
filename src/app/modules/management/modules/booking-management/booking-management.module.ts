import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MangementModule } from '../../management.module';
import { BookingComponent } from './pages/booking/booking.component';
import { BookingManagementRoutingModule } from './booking-management-routing.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';
import { BookingDetailComponent } from './pages/booking-detail/booking-detail.component';
import { BookingSearchFormComponent } from './components/booking-search-form/booking-search-form.component';
import { ChooseBusSchedule2BookingDialogComponent } from './components/choose-bus-schedule-2-booking-dialog/choose-bus-schedule-2-booking-dialog.component';

@NgModule({
  declarations: [
    BookingComponent,
    BookingDetailComponent,
    BookingSearchFormComponent,
    ChooseBusSchedule2BookingDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookingManagementRoutingModule,
    MangementModule,
    FilesCenterManagementModule,
    NZModule,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BookingManagementModule {}
