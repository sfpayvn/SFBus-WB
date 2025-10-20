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
        loadChildren: () =>
          import('./modules/user-management/users-management.module').then((m) => m.UsersManagementModule),
      },
      {
        path: 'files-center-management',
        loadChildren: () =>
          import('./modules/files-center-management/files-center-management.module').then(
            (m) => m.FilesCenterManagementModule,
          ),
      },
      {
        path: 'goods-management',
        loadChildren: () =>
          import('./modules/goods-management/goods-management.module').then((m) => m.GoodsManagementModule),
      },
      {
        path: 'bus-management',
        loadChildren: () => import('./modules/bus-management/bus-management.module').then((m) => m.BusManagementModule),
      },
      {
        path: 'tenant-management',
        loadChildren: () =>
          import('./modules/tenant-management/tenant-management.module').then((m) => m.TenantManagementModule),
      },
      {
        path: 'subscription-management',
        loadChildren: () =>
          import('./modules/subscription-management/subscription-management.module').then(
            (m) => m.SubscriptionManagementModule,
          ),
      },
      {
        path: 'promotion-management',
        loadChildren: () =>
          import('./modules/promotion-management/promotion-management.module').then((m) => m.PromotionManagementModule),
      },
      {
        path: 'setting-management',
        loadChildren: () =>
          import('./modules/setting-management/setting-management.module').then((m) => m.SettingManagementModule),
      },
      {
        path: 'booking-management',
        loadChildren: () =>
          import('./modules/booking-management/booking-management.module').then((m) => m.BookingManagementModule),
      },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
