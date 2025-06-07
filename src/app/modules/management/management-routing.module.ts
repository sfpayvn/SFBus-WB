import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: 'users-management',
        loadChildren: () => import('./modules/user-management/users-management.module').then((m) => m.UsersManagementModule),
      },
      {
        path: 'files-center-management',
        loadChildren: () => import('./modules/files-center-management/files-center-management.module').then((m) => m.FilesCenterManagementModule),
      },
      {
        path: 'goods-management',
        loadChildren: () => import('./modules/goods-management/goods-management.module').then((m) => m.GoodsManagementModule),
      },
      {
        path: 'bus-management',
        loadChildren: () => import('./modules/bus-management/bus-management.module').then((m) => m.BusMangementModule),
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
