/**
 * HƯỚNG DẪN SETUP ROUTING VỚI ROLE-BASED ACCESS CONTROL
 * 
 * ✓ Chỉ cần thêm moduleKey vào route data
 * ✓ Guard sẽ tự động kiểm tra quyền
 * ✓ Nếu không có quyền → Redirect tới /errors/403
 * ✓ Quyền được quản lý bởi role-permissions.constant.ts
 */

/**
 * ==========================================
 * 1. IMPORT GUARD VÀO APP ROUTING
 * ==========================================
 */

// src/app/app-routing.module.ts
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';

/**
 * ==========================================
 * 2. THÊM MODULEKEY VÀO ROUTE DATA
 * ==========================================
 * 
 * Có 3 cách:
 * A) Sử dụng route.data['moduleKey'] (RECOMMENDED)
 * B) Sử dụng route.data['requiredModule']
 * C) Guard sẽ tự động extract từ path /management/bus-management/...
 */

// CÁCH A: Explicit data (RECOMMENDED - Rõ ràng nhất)
export const managementRoutes = [
  {
    path: 'management',
    component: ManagementComponent,
    canActivate: [RoleAccessGuard],
    children: [
      {
        path: 'bus-management',
        component: BusManagementComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: 'bus-management' }  // ← Thêm dòng này
      },
      {
        path: 'users-management',
        component: UsersManagementComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: 'users-management' }  // ← Thêm dòng này
      },
      {
        path: 'files-management',
        component: FilesCenterComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: 'files-center-management' }  // ← Thêm dòng này
      },
      {
        path: 'bus-management/buses',
        component: BusesListComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: 'bus-management' }  // ← Use parent module key
      },
      {
        path: 'bus-management/schedules',
        component: SchedulesListComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: 'bus-schedule' }  // ← Use specific sub-module key
      },
    ]
  }
];

/**
 * ==========================================
 * 3. DANH SÁCH MODULE KEYS (Từ module-function-keys.ts)
 * ==========================================
 */

// Sử dụng import để tránh typo
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

// Ví dụ với import:
export const routesWithImport = [
  {
    path: 'management',
    canActivate: [RoleAccessGuard],
    children: [
      {
        path: 'bus-management',
        component: BusManagementComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BUS_MANAGEMENT }  // ← Type-safe!
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.USERS_MANAGEMENT }
      },
      {
        path: 'goods',
        component: GoodsComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.GOODS_MANAGEMENT }
      },
      {
        path: 'booking',
        component: BookingComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BOOKING_MANAGEMENT }
      },
    ]
  }
];

/**
 * ==========================================
 * 4. CÁCH GUARD HOẠT ĐỘNG
 * ==========================================
 * 
 * Step 1: User truy cập /management/bus-management
 * Step 2: Guard được kích hoạt (canActivate: [RoleAccessGuard])
 * Step 3: Guard lấy moduleKey từ route.data
 * Step 4: Guard kiểm tra user role có quyền truy cập 'bus-management'?
 * Step 5: Nếu có → Cho phép truy cập
 *         Nếu không → Redirect /errors/403
 * 
 * Priority:
 * 1. route.data['moduleKey'] (nếu có)
 * 2. route.data['requiredModule'] (nếu có)
 * 3. Extract từ path tự động (fallback)
 */

/**
 * ==========================================
 * 5. PERMISSION CHECKING VIA role-permissions.constant.ts
 * ==========================================
 * 
 * Ví dụ: User có role TENANT_OPERATOR
 * 
 * TENANT_OPERATOR được phép truy cập:
 * - bus-management ✓
 * - bus-schedule ✓
 * - users-management ✗ (không trong danh sách modules)
 * 
 * Khi truy cập /management/users-management:
 * → Guard kiểm tra: TENANT_OPERATOR.modules.includes('users-management')?
 * → Kết quả: false
 * → Redirect: /errors/403
 * 
 * Để cho phép TENANT_OPERATOR truy cập users-management:
 * → Thêm MODULE_KEYS.USERS_MANAGEMENT vào TENANT_OPERATOR.modules
 */

/**
 * ==========================================
 * 6. STEP-BY-STEP SETUP (Quick Start)
 * ==========================================
 * 
 * Step 1: Import guard
 * ────────────────────
 * // src/app/app-routing.module.ts
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * 
 * Step 2: Thêm guard vào parent route
 * ────────────────────────────────────
 * const routes = [
 *   {
 *     path: 'management',
 *     canActivate: [RoleAccessGuard],
 *     children: [...]
 *   }
 * ];
 * 
 * Step 3: Thêm moduleKey vào child routes
 * ────────────────────────────────────────
 * {
 *   path: 'bus-management',
 *   component: BusManagementComponent,
 *   canActivate: [RoleAccessGuard],
 *   data: { moduleKey: 'bus-management' }
 * }
 * 
 * Step 4: (Optional) Chỉnh sửa quyền
 * ────────────────────────────────
 * // src/app/core/constants/role-permissions.constant.ts
 * // Thêm/xóa module từ role.modules
 * // Thêm/xóa function từ role.functions[moduleKey]
 * 
 * DONE! ✓
 */

/**
 * ==========================================
 * 7. COMPLETE EXAMPLE - App Routing
 * ==========================================
 */

// src/app/app-routing.module.ts (Full Example)
/*
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
    // Dashboard usually public, no guard needed
  },
  
  {
    path: 'management',
    canActivate: [RoleAccessGuard],
    loadChildren: () => import('./modules/management/management.module').then(m => m.ManagementModule),
    data: { moduleKey: 'management' },
    children: [
      {
        path: 'bus-management',
        component: BusManagementComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BUS_MANAGEMENT }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.USERS_MANAGEMENT }
      },
      {
        path: 'files',
        component: FilesComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.FILES_CENTER_MANAGEMENT }
      },
      {
        path: 'goods',
        component: GoodsComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.GOODS_MANAGEMENT }
      },
      {
        path: 'booking',
        component: BookingComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BOOKING_MANAGEMENT }
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.SUBSCRIPTION_MANAGEMENT }
      },
      {
        path: 'promotions',
        component: PromotionsComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.PROMOTION_MANAGEMENT }
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.PAYMENT_MANAGEMENT }
      },
      {
        path: 'tenants',
        component: TenantsComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.TENANT_MANAGEMENT }
      },
    ]
  },

  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule)
    // Error pages don't need guard
  },

  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
    // Auth pages don't need guard
  },

  { path: '**', redirectTo: '/errors/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/

/**
 * ==========================================
 * 8. REAL-WORLD FLOW
 * ==========================================
 * 
 * Scenario: TENANT user tries to access /management/users-management
 * 
 * ┌─────────────────────────────────────┐
 * │ User navigates to:                  │
 * │ /management/users-management        │
 * └─────────────────────┬───────────────┘
 *                       │
 *                       ▼
 * ┌─────────────────────────────────────┐
 * │ RoleAccessGuard.canActivate()        │
 * │ triggered                           │
 * └─────────────────────┬───────────────┘
 *                       │
 *                       ▼
 * ┌─────────────────────────────────────┐
 * │ Get moduleKey from:                 │
 * │ route.data['moduleKey']             │
 * │ = 'users-management'                │
 * └─────────────────────┬───────────────┘
 *                       │
 *                       ▼
 * ┌─────────────────────────────────────┐
 * │ Check ROLE_PERMISSIONS:             │
 * │ User roles: ['tenant']              │
 * │ TENANT.modules = [                  │
 * │   'bus-management',                 │
 * │   'goods-management',               │
 * │   ... (NO users-management)         │
 * │ ]                                   │
 * └─────────────────────┬───────────────┘
 *                       │
 *                       ▼
 * ┌─────────────────────────────────────┐
 * │ Result: hasAccess = false ✗         │
 * └─────────────────────┬───────────────┘
 *                       │
 *                       ▼
 * ┌─────────────────────────────────────┐
 * │ Redirect to: /errors/403            │
 * │ (Forbidden - Access Denied)         │
 * └─────────────────────────────────────┘
 */

/**
 * ==========================================
 * 9. MODIFYING PERMISSIONS (For Admin)
 * ==========================================
 * 
 * To grant TENANT access to users-management:
 * 
 * File: src/app/core/constants/role-permissions.constant.ts
 * 
 * Before:
 * [ROLE_CONSTANTS.TENANT]: {
 *   modules: [
 *     MODULE_KEYS.BUS_MANAGEMENT,
 *     MODULE_KEYS.GOODS_MANAGEMENT,
 *     // ...
 *   ]
 * }
 * 
 * After:
 * [ROLE_CONSTANTS.TENANT]: {
 *   modules: [
 *     MODULE_KEYS.BUS_MANAGEMENT,
 *     MODULE_KEYS.GOODS_MANAGEMENT,
 *     MODULE_KEYS.USERS_MANAGEMENT,  // ← Added
 *     // ...
 *   ],
 *   functions: {
 *     // ...
 *     [MODULE_KEYS.USERS_MANAGEMENT]: ALL_ACTIONS,  // ← Added
 *   }
 * }
 * 
 * Now TENANT can access /management/users-management ✓
 */

/**
 * ==========================================
 * 10. TROUBLESHOOTING
 * ==========================================
 * 
 * Q: Route isn't protected but I added canActivate
 * A: Make sure guard is imported in routing module
 * 
 * Q: Always getting 403 for a specific module
 * A: Check role-permissions.constant.ts if user role has module in .modules array
 * 
 * Q: Want to make a route public
 * A: Don't add canActivate: [RoleAccessGuard] to that route
 * 
 * Q: moduleKey doesn't match module name
 * A: Check MODULE_KEYS constant values in module-function-keys.ts
 * 
 * Q: Want different behavior instead of 403 redirect
 * A: Modify guard's redirect logic in role-access.guard.ts
 *    Or use RoleAccessService.canAccessModule() in component
 */
