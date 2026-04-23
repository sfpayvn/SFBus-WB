import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeTaxListComponent } from './pages/fee-tax-list/fee-tax-list.component';
import { FeeTaxDetailComponent } from './pages/fee-tax-detail/fee-tax-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FeeTaxListComponent,
  },
  {
    path: 'detail',
    component: FeeTaxDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeTaxManagementRoutingModule {}
