import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusTypeDetailDialogComponent } from './pages/bus-types/component/bus-type-detail-dialog/bus-type-detail-dialog.component';
import { BusTypesComponent } from './pages/bus-types/bus-types.component';
import { BusServiceDetailDialogComponent } from './pages/bus-services/component/bus-service-detail-dialog/bus-service-detail-dialog.component';
import { BusServicesComponent } from './pages/bus-services/bus-services.component';
import { BusProvinceDetailDialogComponent } from './pages/bus-provices/component/bus-province-detail-dialog/bus-province-detail-dialog.component';
import { BusProvincesComponent } from './pages/bus-provices/bus-provinces.component';
import { BusStationsComponent } from './pages/bus-stations/bus-stations.component';
import { BusesComponent } from './pages/buses/buses.component';
import { SeatTypesDetailDialogComponent } from './pages/seat-types/component/seat-types-detail-dialog/seat-types-detail-dialog.component';
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
import { BusManagementRoutingModule } from './bus-management-routing.module';
import { MangementModule } from '../../management.module';
import { BusStationDetailDialogComponent } from './pages/bus-stations/component/bus-station-detail-dialog/bus-station-detail-dialog.component';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';
import { BusScheduleDetailDialogComponent } from './pages/bus-schedules/components/bus-schedule-detail-dialog/bus-schedule-detail-dialog.component';
import { BusScheduleAutogeneratorsDetailDialogComponent } from './pages/bus-schedule-autogenerators/components/bus-schedule-autogenerators-detail-dialog/bus-schedule-autogenerators-detail-dialog.component';

@NgModule({
  declarations: [
    BusTypeDetailDialogComponent,
    BusTypesComponent,

    BusServiceDetailDialogComponent,
    BusServicesComponent,

    BusProvinceDetailDialogComponent,
    BusProvincesComponent,

    BusStationDetailDialogComponent,
    BusStationsComponent,

    BusDetailComponent,
    BusesComponent,

    BusTemplateDetailComponent,
    BusTemplatesComponent,

    SeatTypesDetailDialogComponent,
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

    BusScheduleAutogeneratorsDetailDialogComponent,
    BusScheduleAutoGeneratorDetailComponent,
    BusScheduleAutoGeneratorsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusManagementRoutingModule,
    MangementModule,
    FilesCenterManagementModule,
  ],
  exports: [],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusMangementModule {}
