import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { SetupAccountComponent } from './setup-account.component';

const routes: Routes = [
  {
    path: '',
    component: SetupAccountComponent,
    children: [
      { path: '', redirectTo: 'verify-otp', pathMatch: 'full' },
      { path: 'verify-otp', component: VerifyOtpComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupAccountRoutingModule {}
