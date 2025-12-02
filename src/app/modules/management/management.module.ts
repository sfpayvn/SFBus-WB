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
import { CapCheckDirective } from '@rsApp/shared/directives/cap-check.directive';
import { RouterOutlet } from '@angular/router';
import { ManagementComponent } from './management.component';

@NgModule({
  declarations: [ManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    ManagementRoutingModule,
    AngularSvgIconModule,
    DragDropModule,
    MaterialModule,
    NZModule,
    ClickOutsideDirective,
    CapCheckDirective,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManagementModule {}
