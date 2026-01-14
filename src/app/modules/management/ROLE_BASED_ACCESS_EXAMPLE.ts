/**
 * EXAMPLE: Integration Role-Based Access Guard vào Routing
 * 
 * File: src/app/modules/management/management-routing.module.ts
 * 
 * STEP 1: Import RoleAccessGuard
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * 
 * STEP 2: Thêm RoleAccessGuard vào routes cùng với ModuleBlockGuard
 * (ModuleBlockGuard kiểm tra Module có bị block hay không)
 * (RoleAccessGuard kiểm tra User role có quyền truy cập hay không)
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { ModuleBlockGuard } from '@rsApp/guards/module-block.guard';
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard'; // ← THÊM IMPORT NÀY
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: 'users-management',
        canActivate: [ModuleBlockGuard, RoleAccessGuard], // ← THÊM RoleAccessGuard
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
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}

/**
 * ==========================================
 * EXAMPLE: Component sử dụng RoleAccessService
 * ==========================================
 * 
 * File: src/app/modules/management/modules/bus-management/bus-management.component.ts
 */

// import { Component, inject, OnInit } from '@angular/core';
// import { RoleAccessService } from '@rsApp/core/services/role-access.service';
// import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
// import { AuthorizedDirective } from '@rsApp/core/directives/authorized.directive';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-bus-management',
//   standalone: true,
//   imports: [CommonModule, AuthorizedDirective],
//   templateUrl: './bus-management.component.html',
//   styleUrls: ['./bus-management.component.css']
// })
// export class BusManagementComponent implements OnInit {
//   private roleAccessService = inject(RoleAccessService);

//   // Properties để sử dụng trong template
//   canCreateBus = false;
//   canUpdateBus = false;
//   canDeleteBus = false;
//   canViewBuses = false;

//   ngOnInit() {
//     // Kiểm tra quyền cho từng action
//     this.canCreateBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create');
//     this.canUpdateBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'update');
//     this.canDeleteBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete');
//     this.canViewBuses = this.roleAccessService.canAccessModule(MODULE_KEYS.BUSES);
//   }

//   createBus() {
//     if (!this.canCreateBus) {
//       alert('Bạn không có quyền thêm xe');
//       return;
//     }
//     // Logic tạo xe
//   }

//   updateBus(busId: string) {
//     if (!this.canUpdateBus) {
//       alert('Bạn không có quyền sửa xe');
//       return;
//     }
//     // Logic sửa xe
//   }

//   deleteBus(busId: string) {
//     if (!this.canDeleteBus) {
//       alert('Bạn không có quyền xóa xe');
//       return;
//     }
//     // Logic xóa xe
//   }
// }

/**
 * ==========================================
 * EXAMPLE: Template với Directive
 * ==========================================
 * 
 * File: bus-management.component.html
 * 
 * <div class="bus-management-container">
 *   <!-- Ẩn nút Add nếu user không có quyền create -->
 *   <button 
 *     *appAuthorized="{ module: 'bus-management', action: 'create' }"
 *     (click)="createBus()"
 *     class="btn btn-primary">
 *     <i class="icon-plus"></i> Thêm xe mới
 *   </button>
 * 
 *   <!-- Table danh sách xe -->
 *   <table class="table">
 *     <thead>
 *       <tr>
 *         <th>Tên xe</th>
 *         <th>Loại xe</th>
 *         <th>Biển kiểm soát</th>
 *         <th>Hành động</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       <tr *ngFor="let bus of buses">
 *         <td>{{ bus.name }}</td>
 *         <td>{{ bus.type }}</td>
 *         <td>{{ bus.licensePlate }}</td>
 *         <td class="action-column">
 *           <!-- Disable button update nếu không có quyền -->
 *           <button 
 *             [appAuthorized]="{ 
 *               module: 'bus-management', 
 *               action: 'update', 
 *               mode: 'disable',
 *               fallbackText: 'Bạn không có quyền sửa thông tin xe'
 *             }"
 *             (click)="updateBus(bus.id)"
 *             class="btn btn-sm btn-info">
 *             <i class="icon-edit"></i> Sửa
 *           </button>
 * 
 *           <!-- Ẩn button delete nếu không có quyền -->
 *           <button 
 *             *appAuthorized="{ module: 'bus-management', action: 'delete' }"
 *             (click)="deleteBus(bus.id)"
 *             class="btn btn-sm btn-danger">
 *             <i class="icon-trash"></i> Xóa
 *           </button>
 * 
 *           <!-- Hiển thị nút nếu user có BẤT KỲ quyền edit (create hoặc update hoặc delete) -->
 *           <button 
 *             *appAuthorized="{ 
 *               module: 'bus-management', 
 *               actions: ['create', 'update', 'delete'],
 *               anyOf: true
 *             }"
 *             (click)="openBusDetails(bus.id)"
 *             class="btn btn-sm btn-secondary">
 *             Chi tiết
 *           </button>
 *         </td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div>
 */

/**
 * ==========================================
 * EXAMPLE: Service với @RequiredRole Decorator
 * ==========================================
 * 
 * File: bus.service.ts
 * 
 * import { Injectable, inject } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { RequiredRole, WithAuthorizationCheck } from '@rsApp/core/decorators/required-role.decorator';
 * import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

// @Injectable({ providedIn: 'root' })
// export class BusService extends WithAuthorizationCheck {
//   private http = inject(HttpClient);

//   constructor(protected roleAccessService = inject(RoleAccessService)) {
//     super();
//   }

//   // Decorator sẽ kiểm tra quyền trước khi gọi method
//   @RequiredRole({
//     module: MODULE_KEYS.BUSES,
//     action: 'create',
//     errorMessage: 'Bạn không có quyền tạo xe mới'
//   })
//   createBus(busData: any) {
//     return this.http.post('/api/buses', busData);
//   }

//   @RequiredRole({
//     module: MODULE_KEYS.BUSES,
//     action: 'update'
//   })
//   updateBus(id: string, busData: any) {
//     return this.http.put(`/api/buses/${id}`, busData);
//   }

//   @RequiredRole({
//     module: MODULE_KEYS.BUSES,
//     action: 'delete',
//     throwError: false // Return false thay vì throw error
//   })
//   deleteBus(id: string) {
//     return this.http.delete(`/api/buses/${id}`);
//   }

//   // Kiểm tra ANY quyền (user có create HOẶC update)
//   @RequiredRole({
//     module: MODULE_KEYS.BUSES,
//     actions: ['create', 'update'],
//     anyOf: true,
//     errorMessage: 'Bạn cần quyền tạo hoặc sửa xe'
//   })
//   editBusSettings(id: string, settings: any) {
//     return this.http.patch(`/api/buses/${id}/settings`, settings);
//   }
// }
 */
