import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantComponent } from './pages/tenant/tenant.component';
import { TenantDetailComponent } from './pages/tenant-detail/tenant-detail.component';

const routes: Routes = [
  {
    path: 'tenant',
    component: TenantComponent,
  },
  {
    path: 'tenant/detail',
    component: TenantDetailComponent,
  },
  { path: '', redirectTo: 'tenant', pathMatch: 'full' },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantManagementRoutingModule {}
