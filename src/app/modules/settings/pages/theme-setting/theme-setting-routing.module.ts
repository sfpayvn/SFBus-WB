import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeSettingComponent } from './theme-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ThemeSettingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeSettingRoutingModule {}
