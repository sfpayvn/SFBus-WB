import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusTypesComponent } from './pages/bus-types/bus-types.component';
import { BusServicesComponent } from './pages/bus-services/bus-services.component';
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
import { BusTemplatesComponent } from './pages/bus-templates/bus-templates.component';
import { BusTemplateDetailComponent } from './pages/bus-templates/pages/bus-template-detail/bus-template-detail.component';
import { BusScheduleAutoGeneratorsComponent } from './pages/bus-schedule-autogenerators/bus-schedule-autogenerator.component';
import { BusScheduleAutoGeneratorDetailComponent } from './pages/bus-schedule-autogenerators/pages/bus-schedule-autogenerator-detail/bus-schedule-autogenerator-detail.component';
import { BusManagementComponent } from './bus-management.component';

const routes: Routes = [
  {
    path: '',
    component: BusManagementComponent,
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

    ]
  }, {
    path: 'bus-schedule',
    component: BusManagementComponent,
    children: [
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
        path: 'bus-schedule-autogenerators',
        component: BusScheduleAutoGeneratorsComponent,
      },
      {
        path: 'bus-schedule-autogenerators/bus-schedule-autogenerator-detail',
        component: BusScheduleAutoGeneratorDetailComponent,
      },
    ]
  },
  {
    path: 'bus-design',
    component: BusManagementComponent,
    children: [
      {
        path: 'bus-templates',
        component: BusTemplatesComponent,
      },
      {
        path: 'bus-templates/bus-template-detail',
        component: BusTemplateDetailComponent,
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
        path: 'bus-layout-templates',
        component: BusLayoutTemplatesComponent,
      },
      {
        path: 'bus-layout-templates/bus-layout-template-detail',
        component: BusLayoutTemplateDetailComponent,
      },
    ]
  },
  {
    path: 'bus-design',
    component: BusManagementComponent,
    children: [
      {
        path: 'bus-stations',
        component: BusStationsComponent,
      },
      {
        path: 'bus-provinves',
        component: BusProvincesComponent,
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

    ]
  },
  { path: '**', redirectTo: 'errors/404' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusManagementRoutingModule { }
