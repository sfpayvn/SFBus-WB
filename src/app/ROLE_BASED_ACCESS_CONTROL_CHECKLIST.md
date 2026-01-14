/**
 * ===================================================================
 * ROLE-BASED ACCESS CONTROL IMPLEMENTATION CHECKLIST
 * ===================================================================
 * 
 * Các file đã tạo:
 * ✓ role-permissions.constant.ts - Định nghĩa quyền cho từng role
 * ✓ role-access.guard.ts - Guard để kiểm tra route access
 * ✓ role-access.service.ts - Service toàn diện cho permission checking
 * ✓ authorized.directive.ts - Directive để ẩn/disable UI elements
 * ✓ required-role.decorator.ts - Decorator cho method protection
 * ✓ error403.component.* - 403 Forbidden error page
 * ✓ ROLE_BASED_ACCESS_CONTROL.guide.ts - Hướng dẫn sử dụng
 * ✓ ROLE_BASED_ACCESS_EXAMPLE.ts - Ví dụ integration
 */

/**
 * ===================================================================
 * STEP 1: IMPORT RoleAccessGuard VÀO APP ROUTING
 * ===================================================================
 * 
 * File: src/app/app-routing.module.ts
 * 
 * Thêm import:
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * 
 * Thêm vào routes cấp top-level (optional, vì tôi đã thêm vào management):
 * {
 *   path: 'management',
 *   canActivate: [RoleAccessGuard],
 *   children: [...]
 * }
 */

/**
 * ===================================================================
 * STEP 2: IMPORT RoleAccessGuard VÀO MANAGEMENT ROUTING (DONE)
 * ===================================================================
 * 
 * File: src/app/modules/management/management-routing.module.ts
 * 
 * Đã thêm:
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * 
 * Thêm RoleAccessGuard vào tất cả routes:
 * canActivate: [ModuleBlockGuard, RoleAccessGuard]
 * 
 * INSTRUCTIONS:
 * 1. Mở file management-routing.module.ts
 * 2. Thêm import: import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * 3. Thêm RoleAccessGuard vào mỗi route canActivate array
 */

/**
 * ===================================================================
 * STEP 3: IMPORT DIRECTIVE VÀO COMPONENT MODULES
 * ===================================================================
 * 
 * Option A: Standalone Component (Recommended)
 * 
 * import { AuthorizedDirective } from '@rsApp/core/directives/authorized.directive';
 * 
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [CommonModule, AuthorizedDirective], // ← Thêm directive
 *   template: `...`
 * })
 * 
 * 
 * Option B: Module-based Component
 * 
 * Tạo directive.module.ts nếu chưa có:
 * 
 * import { NgModule } from '@angular/core';
 * import { AuthorizedDirective } from '@rsApp/core/directives/authorized.directive';
 * 
 * @NgModule({
 *   declarations: [AuthorizedDirective],
 *   exports: [AuthorizedDirective]
 * })
 * export class DirectivesModule { }
 * 
 * 
 * Thêm vào component module:
 * 
 * import { DirectivesModule } from '@rsApp/core/directives/directives.module';
 * 
 * @NgModule({
 *   declarations: [MyComponent],
 *   imports: [DirectivesModule] // ← Thêm directive module
 * })
 * export class MyModule { }
 */

/**
 * ===================================================================
 * STEP 4: SỬ DỤNG SERVICE TRONG COMPONENT
 * ===================================================================
 * 
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
 * 
 * @Component({...})
 * export class MyComponent {
 *   private roleAccessService = inject(RoleAccessService);
 * 
 *   canCreate = false;
 *   canUpdate = false;
 *   canDelete = false;
 * 
 *   ngOnInit() {
 *     this.canCreate = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create');
 *     this.canUpdate = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'update');
 *     this.canDelete = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete');
 *   }
 * }
 */

/**
 * ===================================================================
 * STEP 5: SỬ DỤNG DIRECTIVE TRONG TEMPLATE
 * ===================================================================
 * 
 * <!-- Ẩn nếu không có quyền -->
 * <button *appAuthorized="{ module: 'bus-management', action: 'create' }">
 *   Thêm
 * </button>
 * 
 * <!-- Disable nếu không có quyền -->
 * <button [appAuthorized]="{ module: 'bus-management', action: 'delete', mode: 'disable' }">
 *   Xóa
 * </button>
 */

/**
 * ===================================================================
 * STEP 6: SỬ DỤNG DECORATOR TRÊN METHOD (Advanced)
 * ===================================================================
 * 
 * import { RequiredRole, WithAuthorizationCheck } from '@rsApp/core/decorators/required-role.decorator';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * 
 * @Injectable()
 * export class BusService extends WithAuthorizationCheck {
 *   constructor(protected roleAccessService = inject(RoleAccessService)) {
 *     super();
 *   }
 * 
 *   @RequiredRole({ module: 'bus-management', action: 'create' })
 *   createBus(data: any) {
 *     // Code chỉ chạy nếu có quyền
 *   }
 * }
 */

/**
 * ===================================================================
 * STEP 7: CUSTOMIZE ROLE PERMISSIONS
 * ===================================================================
 * 
 * File: src/app/core/constants/role-permissions.constant.ts
 * 
 * Sửa đổi ROLE_PERMISSIONS object để tùy chỉnh quyền cho từng role
 * 
 * Example:
 * [ROLE_CONSTANTS.TENANT_OPERATOR]: {
 *   modules: [MODULE_KEYS.BUS_SCHEDULE, MODULE_KEYS.BUS_DESIGN],
 *   functions: {
 *     [MODULE_KEYS.BUS_SCHEDULE]: ['list', 'create', 'update'],
 *     [MODULE_KEYS.BUS_DESIGN]: ['list', 'view']
 *   }
 * }
 */

/**
 * ===================================================================
 * TROUBLESHOOTING
 * ===================================================================
 * 
 * Q: Directive không hoạt động?
 * A: Đảm bảo AuthorizedDirective được import trong component
 * 
 * Q: Guard redirect tới /errors/403 nhưng page không tìm thấy?
 * A: Đảm bảo Error403Component được thêm vào error-routing.module.ts
 * 
 * Q: RoleAccessService trả về false khi chắc chắn user có quyền?
 * A: Gọi refreshCache() sau khi update user role
 *    this.roleAccessService.refreshCache();
 * 
 * Q: Decorator @RequiredRole không hoạt động?
 * A: Đảm bảo class extend WithAuthorizationCheck hoặc có 
 *    checkMethodAuthorization method
 * 
 * Q: Permission cache không update?
 * A: Gọi roleAccessService.refreshCache() trong auth service
 *    sau khi login hoặc update user info
 */

/**
 * ===================================================================
 * TESTING CHECKLIST
 * ===================================================================
 * 
 * ✓ Login với role admin → Có access tất cả modules
 * ✓ Login với role tenant → Chỉ có access tenant modules
 * ✓ Login với role tenant-operator → Chỉ có access BUS_SCHEDULE
 * ✓ Truy cập URL không được phép → Redirect /errors/403
 * ✓ Click button không được phép → Button bị disable hoặc ẩn
 * ✓ Gọi method không được phép → Error hoặc return false
 * ✓ Update role → Permission cache update
 * ✓ Logout → Tất cả permission reset
 */

/**
 * ===================================================================
 * FILE TREE - ROLE-BASED ACCESS CONTROL
 * ===================================================================
 * 
 * src/app/
 * ├── core/
 * │   ├── constants/
 * │   │   ├── role-permissions.constant.ts ✓ NEW
 * │   │   ├── roles.constants.ts (existing)
 * │   │   └── module-function-keys.ts (existing)
 * │   ├── services/
 * │   │   ├── role-access.service.ts ✓ NEW
 * │   │   └── theme.service.ts (existing)
 * │   ├── directives/
 * │   │   └── authorized.directive.ts ✓ NEW
 * │   ├── decorators/
 * │   │   └── required-role.decorator.ts ✓ NEW
 * │   └── guides/
 * │       └── ROLE_BASED_ACCESS_CONTROL.guide.ts ✓ NEW
 * ├── guards/
 * │   ├── role-access.guard.ts ✓ NEW
 * │   └── module-block.guard.ts (existing)
 * └── modules/
 *     ├── management/
 *     │   ├── ROLE_BASED_ACCESS_EXAMPLE.ts ✓ NEW
 *     │   └── management-routing.module.ts (cần update - thêm import)
 *     └── error/
 *         └── pages/
 *             └── error403/ ✓ NEW
 *                 ├── error403.component.ts
 *                 ├── error403.component.html
 *                 └── error403.component.css
 */

/**
 * ===================================================================
 * NEXT STEPS
 * ===================================================================
 * 
 * 1. UPDATE management-routing.module.ts
 *    - Thêm import RoleAccessGuard
 *    - Thêm RoleAccessGuard vào canActivate
 * 
 * 2. TEST các scenarios:
 *    - Login với khác roles
 *    - Access routes khác nhau
 *    - Click buttons, check directive
 * 
 * 3. CUSTOMIZE role-permissions.constant.ts
 *    - Điều chỉnh quyền theo business requirements
 * 
 * 4. INTEGRATE vào components
 *    - Sử dụng RoleAccessService trong components
 *    - Thêm AuthorizedDirective trong templates
 * 
 * 5. ADD LOGGING/MONITORING
 *    - Log unauthorized access attempts
 *    - Monitor permission changes
 */
