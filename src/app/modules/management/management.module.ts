import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementRoutingModule } from './management-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NZModule } from 'src/app/library-modules/nz-module';
import { MaterialModule } from '../material/material-module';
import { FilesComponent } from './pages/files-center/files-center.component';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { FilesCenterDialogComponent } from './pages/files-center/components/files-center-dialog/files-center-dialog.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CalendarEventsComponent } from './components/calendar-events/calendar-events.component';
import { UserDetailComponent } from './pages/user/pages/user-detail/user-detail.component';
import { CreateEditUserAddressDialogComponent } from './pages/user/component/create-edit-user-address-dialog/create-edit-user-address-dialog.component';
import { UsersComponent } from './pages/user/users.component';
import { LayoutMatrixComponent } from './components/layout-matrix/layout-matrixs.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TriggerMaskComponent } from './components/trigger-mask/trigger-mask.component';
import { TriggerModalComponent } from './components/trigger-modal/trigger-modal.component';

@NgModule({
  declarations: [
    TableHeaderComponent, TableFooterComponent,
    TableActionComponent,
    TriggerModalComponent,
    TriggerMaskComponent,
    LayoutMatrixComponent,

    FilesComponent,
    FilesCenterDialogComponent,

    CalendarEventsComponent,

    UserDetailComponent,
    UsersComponent,
    CreateEditUserAddressDialogComponent,
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
    NgxMaskDirective
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
    NgxMaskDirective,

    CalendarEventsComponent,


    TableHeaderComponent, TableFooterComponent,
    TableActionComponent,
    TriggerModalComponent,
    TriggerMaskComponent,
    LayoutMatrixComponent,
  ],
  providers: [
    provideNgxMask()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class MangementModule { }
