import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MangementModule } from '../../management.module';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { PromotionDetailComponent } from './pages/promotion-detail/promotion-detail.component';
import { PromotionManagementRoutingModule } from './promotion-management-routing.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';

@NgModule({
  declarations: [PromotionComponent, PromotionDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PromotionManagementRoutingModule,
    MangementModule,
    FilesCenterManagementModule,
    NZModule,
  ],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PromotionManagementModule {}
