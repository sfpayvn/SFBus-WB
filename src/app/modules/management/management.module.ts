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

@NgModule({
  declarations: [
    TableHeaderComponent, TableFooterComponent,
    TableActionComponent, TooltipComponent,
    OptionsComponent,
    OptionsValueComponent,
    CreateEditOptionDialogComponent,
    CreateEditBusTypeDialogComponent,
    BusTypesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManagementRoutingModule,
    AngularSvgIconModule,
    DragDropModule,
    MaterialModule,
    NZModule
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
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class MangementModule { }
