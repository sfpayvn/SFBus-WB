import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionsComponent } from './pages/options/pages/options/options.component';
import { OptionsValueComponent } from './pages/options/pages/options-value/options-value.component';
import { CreateEditOptionDialogComponent } from './pages/options/component/create-edit-option-dialog/create-edit-option-dialog.component';
import { CreateEditBusTypeDialogComponent } from './pages/bus-types/component/create-edit-bus-type-dialog/create-bus-type-dialog.component';
import { BusTypesComponent } from './pages/bus-types/bus-types.component';
import { CreateEditBusServiceDialogComponent } from './pages/bus-services/component/create-edit-bus-service-dialog/create-bus-service-dialog.component';
import { BusServicesComponent } from './pages/bus-services/bus-services.component';
import { CreateEditBusProvinceDialogComponent } from './pages/bus-provices/component/create-edit-bus-province-dialog/create-bus-province-dialog.component';
import { BusProvincesComponent } from './pages/bus-provices/bus-provinces.component';
import { BusStationsComponent } from './pages/bus-stations/bus-stations.component';
import { CreateEditBusStationDialogComponent } from './pages/bus-stations/component/create-edit-bus-station-dialog/create-bus-station-dialog.component';
import { BusesComponent } from './pages/buses/buses.component';
import { CreateEditSeatTypeDialogComponent } from './pages/seat-types/component/create-edit-seat-types-dialog/create-seat-type-dialog.component';
import { SeatTypesComponent } from './pages/seat-types/seat-types.component';
import { BusDetailComponent } from './pages/buses/pages/bus-detail/bus-detail.component';
import { BusRoutesComponent } from './pages/bus-routes/bus-routes.component';
import { BusRouteDetailComponent } from './pages/bus-routes/pages/bus-route-detail/bus-route-detail.component';
import { BusSchedulesComponent } from './pages/bus-schedules/bus-schedules.component';
import { BusScheduleDetailComponent } from './pages/bus-schedules/pages/bus-schedule-detail/bus-schedule-detail.component';
import { BusLayoutTemplatesComponent } from './pages/bus-layout-templates/bus-layout-templates.component';
import { BusLayoutTemplateDetailComponent } from './pages/bus-layout-templates/pages/bus-layout-template-detail/bus-layout-template-detail.component';
import { BusScheduleTemplatesComponent } from './pages/bus-schedule-templates/bus-schedule-templates.component';
import { BusScheduleTemplateDetailComponent } from './pages/bus-schedule-templates/pages/bus-schedule-template-detail/bus-schedule-template-detail.component';
import { provideNgxMask } from 'ngx-mask';
import { BusTemplatesComponent } from './pages/bus-templates/bus-templates.component';
import { BusTemplateDetailComponent } from './pages/bus-templates/pages/bus-template-detail/bus-template-detail.component';
import { BusScheduleAutoGeneratorsComponent } from './pages/bus-schedule-autogenerators/bus-schedule-autogenerator.component';
import { BusScheduleAutoGeneratorDetailComponent } from './pages/bus-schedule-autogenerators/pages/bus-schedule-autogenerator-detail/bus-schedule-autogenerator-detail.component';
import { BusScheduleDetailDialogComponent } from './pages/bus-schedules/components/bus-schedule-detail-dialog/bus-schedule-detail-dialog.component';
import { BusManagementRoutingModule } from './bus-management-routing.module';
import { MangementModule } from '../../management.module';

@NgModule({
  declarations: [
    OptionsComponent,
    OptionsValueComponent,
    CreateEditOptionDialogComponent,

    CreateEditBusTypeDialogComponent,
    BusTypesComponent,

    CreateEditBusServiceDialogComponent,
    BusServicesComponent,

    CreateEditBusProvinceDialogComponent,
    BusProvincesComponent,

    CreateEditBusStationDialogComponent,
    BusStationsComponent,

    BusDetailComponent,
    BusesComponent,

    BusTemplateDetailComponent,
    BusTemplatesComponent,

    CreateEditSeatTypeDialogComponent,
    SeatTypesComponent,

    BusLayoutTemplatesComponent,
    BusLayoutTemplateDetailComponent,

    BusRoutesComponent,
    BusRouteDetailComponent,

    BusSchedulesComponent,
    BusScheduleDetailComponent,
    BusScheduleDetailDialogComponent,

    BusScheduleTemplatesComponent,
    BusScheduleTemplateDetailComponent,

    BusScheduleAutoGeneratorDetailComponent,
    BusScheduleAutoGeneratorsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusManagementRoutingModule,
    MangementModule,
  ],
  exports: [
  ],
  providers: [
    provideNgxMask()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class BusMangementModule { }
