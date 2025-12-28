import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusScheduleSettingComponent } from './bus-schedule-setting.component';

const routes: Routes = [
  {
    path: '',
    component: BusScheduleSettingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusScheduleSettingRoutingModule {}
