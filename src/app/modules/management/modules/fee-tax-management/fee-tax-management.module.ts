import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { FeeTaxListComponent } from './pages/fee-tax-list/fee-tax-list.component';
import { FeeTaxDetailComponent } from './pages/fee-tax-detail/fee-tax-detail.component';
import { BookingFeeTaxBreakdownComponent } from './components/booking-fee-tax-breakdown.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NZModule,
    FeeTaxListComponent,
    FeeTaxDetailComponent,
    BookingFeeTaxBreakdownComponent,
    RouterModule.forChild([
      {
        path: '',
        component: FeeTaxListComponent,
      },
      {
        path: 'detail',
        component: FeeTaxDetailComponent,
      },
    ]),
  ],
  exports: [BookingFeeTaxBreakdownComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeeTaxManagementModule {}
