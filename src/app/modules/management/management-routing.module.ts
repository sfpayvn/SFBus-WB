import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { ModuleBlockGuard } from '@rsApp/guards/module-block.guard';
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    canActivate: [RoleAccessGuard],
    children: [
      {
        path: 'users-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.USERS_MANAGEMENT },
        loadChildren: () =>
          import('./modules/user-management/users-management.module').then((m) => m.UsersManagementModule),
      },
      {
        path: 'files-center-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.FILES_CENTER_MANAGEMENT },
        loadChildren: () =>
          import('./modules/files-center-management/files-center-management.module').then(
            (m) => m.FilesCenterManagementModule,
          ),
      },
      {
        path: 'goods-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.GOODS_MANAGEMENT },
        loadChildren: () =>
          import('./modules/goods-management/goods-management.module').then((m) => m.GoodsManagementModule),
      },
      {
        path: 'bus-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BUS_MANAGEMENT },
        loadChildren: () => import('./modules/bus-management/bus-management.module').then((m) => m.BusManagementModule),
      },
      {
        path: 'tenant-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.TENANT_MANAGEMENT },
        loadChildren: () =>
          import('./modules/tenant-management/tenant-management.module').then((m) => m.TenantManagementModule),
      },
      {
        path: 'subscription-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.SUBSCRIPTION_MANAGEMENT },
        loadChildren: () =>
          import('./modules/subscription-management/subscription-management.module').then(
            (m) => m.SubscriptionManagementModule,
          ),
      },
      {
        path: 'promotion-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.PROMOTION_MANAGEMENT },
        loadChildren: () =>
          import('./modules/promotion-management/promotion-management.module').then((m) => m.PromotionManagementModule),
      },
      {
        path: 'payment-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.PAYMENT_MANAGEMENT },
        loadChildren: () =>
          import('./modules/payment-management/payment-management.module').then((m) => m.PaymentManagementModule),
      },
      {
        path: 'booking-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BOOKING_MANAGEMENT },
        loadChildren: () =>
          import('./modules/booking-management/booking-management.module').then((m) => m.BookingManagementModule),
      },
      {
        path: 'notification-management/notification-schedule',
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.NOTIFICATION_MANAGEMENT },
        loadChildren: () =>
          import('./modules/notification-schedule/notification-schedule.module').then(
            (m) => m.NotificationScheduleModule,
          ),
      },
      {
        path: 'content-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.CONTENT_MANAGEMENT },
        loadChildren: () =>
          import('./modules/content-management/content-management.module').then((m) => m.ContentManagementModule),
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
