import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';
import { PaymentMethodDetailComponent } from './pages/payment-method-detail/payment-method-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodComponent,
  },
  {
    path: 'detail',
    component: PaymentMethodDetailComponent,
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodRoutingModule {}
