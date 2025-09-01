import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { NoAuthGuard } from './auth/no-auth.guard';
import { SetupAccountGuard } from './auth/setup-account.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'setup-account',
    loadChildren: () => import('./modules/setup-account/setup-account.module').then((m) => m.SetupAccountModule),
    canActivate: [SetupAccountGuard],
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
