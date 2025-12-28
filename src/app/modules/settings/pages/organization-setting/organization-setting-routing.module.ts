import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationSettingComponent } from './organization-setting.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationSettingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationSettingRoutingModule {}
