import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
import { ModuleBlockGuard } from '@rsApp/guards/module-block.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full',
  },
  {
    path: 'client',
    canActivate: [ModuleBlockGuard, RoleAccessGuard],
    data: { moduleKey: MODULE_KEYS.USER_CLIENT },
    component: UsersComponent,
  },
  {
    path: 'driver',
    canActivate: [ModuleBlockGuard, RoleAccessGuard],
    data: { moduleKey: MODULE_KEYS.USER_DRIVER },
    component: UsersComponent,
  },
  {
    path: 'pos',
    canActivate: [ModuleBlockGuard, RoleAccessGuard],
    data: { moduleKey: MODULE_KEYS.USER_POS },
    component: UsersComponent,
  },
  {
    path: 'tenant',
    canActivate: [ModuleBlockGuard, RoleAccessGuard],
    data: { moduleKey: MODULE_KEYS.USER_TENANT },
    component: UsersComponent,
  },
  {
    path: 'tenant-operator',
    canActivate: [ModuleBlockGuard, RoleAccessGuard],
    data: { moduleKey: MODULE_KEYS.USER_TENANT_OPERATOR },
    component: UsersComponent,
  },
  {
    path: 'users/detail',
    component: UserDetailComponent,
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersManagementRoutingModule {}
