import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AccountDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountInformationRoutingModule {}
