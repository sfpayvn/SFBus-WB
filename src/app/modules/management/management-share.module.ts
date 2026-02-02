import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementRoutingModule } from './management-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NZModule } from 'src/app/library-modules/nz-module';
import { MaterialModule } from '../material/material-module';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SvgIconComponent } from 'angular-svg-icon';
import { CapCheckDirective } from '@rsApp/shared/directives/cap-check.directive';
import { CalendarEventsComponent } from './components/calendar-events/calendar-events.component';
import { LayoutMatrixComponent } from './components/layout-matrix/layout-matrixs.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TriggerMaskComponent } from './components/trigger-mask/trigger-mask.component';
import { TriggerModalComponent } from './components/trigger-modal/trigger-modal.component';
import { AuthorizedDirective } from "@rsApp/core/directives/authorized.directive";

@NgModule({
  declarations: [
    TableHeaderComponent,
    TableFooterComponent,
    TableActionComponent,
    TriggerModalComponent,
    TriggerMaskComponent,
    LayoutMatrixComponent,
    CalendarEventsComponent,
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
    CapCheckDirective,
    NgxMaskDirective,
    AuthorizedDirective
],
  exports: [
    CommonModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MaterialModule,
    NZModule,
    ClickOutsideDirective,
    CapCheckDirective,
    NgxMaskDirective,
    SvgIconComponent,

    TableHeaderComponent,
    TableFooterComponent,
    TableActionComponent,
    TriggerModalComponent,
    TriggerMaskComponent,
    LayoutMatrixComponent,
    CalendarEventsComponent,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManagementSharedModule {}
