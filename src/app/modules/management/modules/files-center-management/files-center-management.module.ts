import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { FilesCenterDialogComponent } from './components/files-center-dialog/files-center-dialog.component';
import { FilesComponent } from './pages/files-center/files-center.component';
import { FilesCenterManagementRoutingModule } from './files-center-management-routing.module';
import { ManagementSharedModule } from '../../management-share.module';

@NgModule({
  declarations: [FilesComponent, FilesCenterDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilesCenterManagementRoutingModule, ManagementSharedModule],
  exports: [FilesComponent, FilesCenterDialogComponent],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilesCenterManagementModule {}
