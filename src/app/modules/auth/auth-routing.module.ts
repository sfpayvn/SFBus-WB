import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TwoStepsComponent } from './pages/two-steps/two-steps.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { NoAuthGuard } from '@rsApp/guards/no-auth.guard';
import { SetupAccountGuard } from '@rsApp/guards/setup-account.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },

      {
        path: 'sign-in',
        component: SignInComponent,
        data: { returnUrl: window.location.pathname },
        canActivate: [NoAuthGuard],
      },
      { path: 'sign-up', component: SignUpComponent, canActivate: [NoAuthGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NoAuthGuard] },
      { path: 'verify-otp', component: VerifyOtpComponent, canActivate: [SetupAccountGuard] },
      { path: 'new-password', component: NewPasswordComponent, canActivate: [NoAuthGuard] },
      { path: 'two-steps', component: TwoStepsComponent, canActivate: [NoAuthGuard] },
      { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
