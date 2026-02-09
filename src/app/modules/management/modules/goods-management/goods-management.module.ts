import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { GoodsDetailComponent } from './pages/goods-detail/goods-detail.component';
import { GoodsComponent } from './pages/goods/goods.component';
import { GoodsManagementRoutingModule } from './goods-management-routing.module';
import { GoodsCategoriesComponent } from './pages/goods-categories/goods-categories.component';
import { GoodsCategoryDetailDialogComponent } from './component/goods-category-detail-dialog/goods-category-detail-dialog.component';
import { FilesCenterManagementModule } from '../files-center-management/files-center-management.module';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { ManagementSharedModule } from '../../management-share.module';
import { AppTableColumnComponent } from '@rsApp/modules/management/components/app-table/app-table-column.component';
import { AppTableComponent } from '@rsApp/modules/management/components/app-table/app-table.component';
import { GoodsSearchFormComponent } from './component/goods-search-form/goods-search-form.component';

@NgModule({
  declarations: [
    GoodsDetailComponent,
    GoodsComponent,
    GoodsCategoriesComponent,
    GoodsCategoryDetailDialogComponent,
    GoodsSearchFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoodsManagementRoutingModule,
    ManagementSharedModule,
    FilesCenterManagementModule,
    NZModule,
    AppTableComponent,
    AppTableColumnComponent,
  ],

  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GoodsManagementModule {}
