import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './pages/options/pages/options/options.component';
import { OptionsValueComponent } from './pages/options/pages/options-value/options-value.component';
import { ManagementComponent } from './management.component';
import { BusTypesComponent } from './pages/bus-types/bus-types.component';
import { BusServicesComponent } from './pages/bus-services/bus-services.component';
import { FilesComponent } from './pages/files-center/files-center.component';
import { BusStationsComponent } from './pages/bus-stations/bus-stations.component';
import { BusProvincesComponent } from './pages/bus-provices/bus-provinces.component';
import { SeatTypesComponent } from './pages/seat-types/seat-types.component';
import { BusesComponent } from './pages/buses/buses.component';
import { BusDetailComponent } from './pages/buses/pages/bus-detail/bus-detail.component';
import { BusRoutesComponent } from './pages/bus-routes/bus-routes.component';
import { BusRouteDetailComponent } from './pages/bus-routes/pages/bus-route-detail/bus-route-detail.component';
import { BusSchedulesComponent } from './pages/bus-schedules/bus-schedules.component';
import { BusScheduleDetailComponent } from './pages/bus-schedules/pages/bus-schedule-detail/bus-schedule-detail.component';
import { BusLayoutTemplatesComponent } from './pages/bus-layout-templates/bus-layout-templates.component';
import { BusLayoutTemplateDetailComponent } from './pages/bus-layout-templates/pages/bus-layout-template-detail/bus-layout-template-detail.component';
import { BusScheduleTemplatesComponent } from './pages/bus-schedule-templates/bus-schedule-templates.component';
import { BusScheduleTemplateDetailComponent } from './pages/bus-schedule-templates/pages/bus-schedule-template-detail/bus-schedule-template-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: '', redirectTo: 'options', pathMatch: 'full' },
      {
        path: 'buses',
        component: BusesComponent,
      },
      {
        path: 'buses/bus-detail',
        component: BusDetailComponent,
      },
      {
        path: 'bus-routes',
        component: BusRoutesComponent,
      },
      {
        path: 'bus-routes/bus-route-detail',
        component: BusRouteDetailComponent,
      },
      {
        path: 'bus-schedules',
        component: BusSchedulesComponent,
      },
      {
        path: 'bus-schedules/bus-schedule-detail',
        component: BusScheduleDetailComponent,
      },
      {
        path: 'bus-schedule-templates',
        component: BusScheduleTemplatesComponent,
      },
      {
        path: 'bus-schedule-templates/bus-schedule-template-detail',
        component: BusScheduleTemplateDetailComponent,
      },
      {
        path: 'bus-provinves',
        component: BusProvincesComponent,
      },
      {
        path: 'bus-stations',
        component: BusStationsComponent,
      },
      {
        path: 'bus-types',
        component: BusTypesComponent,
      },
      {
        path: 'bus-services',
        component: BusServicesComponent,
      },
      {
        path: 'seat-type',
        component: SeatTypesComponent,
      },
      {
        path: 'bus-layout-templates',
        component: BusLayoutTemplatesComponent,
      },
      {
        path: 'bus-layout-templates/bus-layout-template-detail',
        component: BusLayoutTemplateDetailComponent,
      },
      {
        path: 'media-center',
        component: FilesComponent,
      },
      {
        path: 'options',
        component: OptionsComponent,
      },
      {
        path: 'options-value',
        component: OptionsValueComponent,
      },
      { path: '**', redirectTo: 'errors/404' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule { }
