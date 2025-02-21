import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './pages/options/pages/options/options.component';
import { OptionsValueComponent } from './pages/options/pages/options-value/options-value.component';
import { ManagementComponent } from './management.component';
import { BusTypesComponent } from './pages/bus-types/bus-types.component';
import { BusServicesComponent } from './pages/bus-services/bus-services.component';
import { FilesComponent } from './pages/files-center/files-center.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: '', redirectTo: 'options', pathMatch: 'full' },
      {
        path: 'bus-types',
        component: BusTypesComponent,
      },
      {
        path: 'bus-services',
        component: BusServicesComponent,
      },
      {
        path: 'media-center',
        component: FilesComponent,
      },
      {
        path: 'options',
        component: OptionsComponent,
      },
      {
        path: 'options-value',
        component: OptionsValueComponent,
      },
      { path: '**', redirectTo: 'errors/404' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule { }
