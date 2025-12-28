import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'theme-setting',
        loadChildren: () => import('./pages/theme-setting/theme-setting.module').then((m) => m.ThemeSettingModule),
      },
      {
        path: 'bus-schedule-setting',
        loadChildren: () => import('./pages/bus-schedule-setting/bus-schedule-setting.module').then((m) => m.BusScheduleSettingModule),
      },
      {
        path: 'organization-setting',
        loadChildren: () => import('./pages/organization-setting/organization-setting.module').then((m) => m.OrganizationSettingModule),
      },
      {
        path: 'default-setting',
        loadChildren: () => import('./pages/default-setting/default-setting.module').then((m) => m.DefaultSettingModule),
      },
      {
        path: '',
        redirectTo: 'theme-setting',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
