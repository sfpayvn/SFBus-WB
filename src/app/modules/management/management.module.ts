import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { ManagementRoutingModule } from './management-routing.module';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NZModule } from 'src/app/library-modules/nz-module';
import { OptionsComponent } from './pages/options/pages/options/options.component';
import { OptionsValueComponent } from './pages/options/pages/options-value/options-value.component';
import { CreateEditOptionDialogComponent } from './pages/options/component/create-edit-option-dialog/create-edit-option-dialog.component';
import { MaterialModule } from '../material/material-module';
import { CreateEditBusTypeDialogComponent } from './pages/bus-types/component/create-edit-bus-type-dialog/create-bus-type-dialog.component';
import { BusTypesComponent } from './pages/bus-types/bus-types.component';
import { CreateEditBusServiceDialogComponent } from './pages/bus-services/component/create-edit-bus-service-dialog/create-bus-service-dialog.component';
import { BusServicesComponent } from './pages/bus-services/bus-services.component';
import { FilesComponent } from './pages/files-center/files-center.component';
import { TriggerModalComponent } from './components/trigger-modal/trigger-modal.component';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { TriggerMaskComponent } from './components/trigger-mask/trigger-mask.component';
import { FilesCenterDialogComponent } from './pages/files-center/components/files-center-dialog/files-center-dialog.component';
import { CreateEditBusProvinceDialogComponent } from './pages/bus-provices/component/create-edit-bus-province-dialog/create-bus-province-dialog.component';
import { BusProvincesComponent } from './pages/bus-provices/bus-provinces.component';
import { BusStationsComponent } from './pages/bus-stations/bus-stations.component';
import { CreateEditBusStationDialogComponent } from './pages/bus-stations/component/create-edit-bus-station-dialog/create-bus-station-dialog.component';
import { BusesComponent } from './pages/buses/buses.component';
import { BusTemplatesComponent } from './pages/bus-templates/bus-templates.component';
import { BusTemplateDetailComponent } from './pages/bus-templates/pages/bus-template-detail/bus-template-detail.component';
import { CreateEditSeatTypeDialogComponent } from './pages/seat-types/component/create-edit-seat-types-dialog/create-seat-type-dialog.component';
import { SeatTypesComponent } from './pages/seat-types/seat-types.component';
import { BusDetailComponent } from './pages/buses/pages/bus-detail/bus-detail.component';
import { BusRoutesComponent } from './pages/bus-routes/bus-routes.component';
import { BusRouteDetailComponent } from './pages/bus-routes/pages/bus-route-detail/bus-route-detail.component';
import { BusSchedulesComponent } from './pages/bus-schedules/bus-schedules.component';
import { BusScheduleDetailComponent } from './pages/bus-schedules/pages/bus-schedule-detail/bus-schedule-detail.component';

@NgModule({
  declarations: [
    TableHeaderComponent, TableFooterComponent,
    TableActionComponent, TooltipComponent,
    TriggerModalComponent,
    TriggerMaskComponent,

    OptionsComponent,
    OptionsValueComponent,
    CreateEditOptionDialogComponent,

    CreateEditBusTypeDialogComponent,
    BusTypesComponent,

    CreateEditBusServiceDialogComponent,
    BusServicesComponent,

    FilesComponent,
    FilesCenterDialogComponent,

    CreateEditBusProvinceDialogComponent,
    BusProvincesComponent,

    CreateEditBusStationDialogComponent,
    BusStationsComponent,

    BusDetailComponent,
    BusesComponent,

    CreateEditSeatTypeDialogComponent,
    SeatTypesComponent,

    BusTemplatesComponent,
    BusTemplateDetailComponent,

    BusRoutesComponent,
    BusRouteDetailComponent,

    BusSchedulesComponent,
    BusScheduleDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManagementRoutingModule,
    AngularSvgIconModule,
    DragDropModule,
    MaterialModule,
    NZModule,
    ClickOutsideDirective,
  ],
  exports: [
    TableHeaderComponent,
    TableFooterComponent,
    TableActionComponent,
    AngularSvgIconModule,
    TooltipComponent,

    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NZModule,
    ClickOutsideDirective
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class MangementModule { }
