import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutRoutingModule } from './content-layout-routing.module';
import { ContentLayoutDetailComponent } from './pages/content-layout-detail/content-layout-detail.component';
import { FilesCenterManagementModule } from '../../../files-center-management/files-center-management.module';
import { ManagementSharedModule } from '@rsApp/modules/management/management-share.module';
import { ContentLayoutComponent } from './pages/content-layout/content-layout.component';

@NgModule({
  declarations: [ContentLayoutComponent, ContentLayoutDetailComponent],
  imports: [CommonModule, ContentLayoutRoutingModule, ManagementSharedModule, FilesCenterManagementModule],
})
export class ContentLayoutModule {}
