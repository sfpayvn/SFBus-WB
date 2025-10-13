import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './pages/files-center/files-center.component';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesCenterManagementRoutingModule {}
