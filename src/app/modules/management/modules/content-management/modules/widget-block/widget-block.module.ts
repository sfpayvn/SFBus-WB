import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlBuilderComponent } from '@rsApp/shared/components/html-builder/html-builder.component';
import { ManagementSharedModule } from '@rsApp/modules/management/management-share.module';
import { FilesCenterManagementModule } from '../../../files-center-management/files-center-management.module';
import { WidgetBlockDetailComponent } from './pages/widget-block-detail/widget-block-detail.component';
import { WidgetBlockComponent } from './pages/widget-block/widget-block.component';
import { WidgetBlockRoutingModule } from './widget-block-routing.module';

@NgModule({
  declarations: [WidgetBlockComponent, WidgetBlockDetailComponent],
  imports: [
    CommonModule,
    WidgetBlockRoutingModule,
    HtmlBuilderComponent,
    ManagementSharedModule,
    FilesCenterManagementModule,
  ],
})
export class WidgetBlockModule {}
