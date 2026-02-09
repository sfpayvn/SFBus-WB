import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentManagementComponent } from './payment-management.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentManagementComponent,
    children: [
      {
        path: 'payment-method',
        loadChildren: () => import('./modules/payment-method/payment-method.module').then((m) => m.PaymentMethodModule),
      },
      { path: '', redirectTo: 'payment-method', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentManagementRoutingModule {}
