/**
 * APP-LEVEL ROLE ACCESS CONTROL INTEGRATION
 * 
 * Hướng dẫn tích hợp RBAC vào AppModule/main.ts
 */

// ============================================================
// OPTION 1: Standalone App (Angular 14+) - RECOMMENDED
// ============================================================

/**
 * File: src/main.ts
 * 
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import { provideRouter } from '@angular/router';
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * 
 * import { AppComponent } from './app/app.component';
 * import { routes } from './app/app-routing.module';
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * 
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideRouter(routes),
 *     provideHttpClient(
 *       withInterceptors([...]) // Existing interceptors
 *     ),
 *     // Provide RBAC services
 *     RoleAccessService,
 *     RoleAccessGuard,
 *   ]
 * });
 */

// ============================================================
// OPTION 2: Module-based App - Traditional
// ============================================================

/**
 * File: src/app/app.module.ts
 * 
 * import { NgModule } from '@angular/core';
 * import { BrowserModule } from '@angular/platform-browser';
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
 * 
 * import { AppRoutingModule } from './app-routing.module';
 * import { AppComponent } from './app.component';
 * 
 * // Import RBAC services and guards
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * 
 * @NgModule({
 *   declarations: [AppComponent],
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     HttpClientModule,
 *     AppRoutingModule,
 *   ],
 *   providers: [
 *     // RBAC services and guards
 *     RoleAccessGuard,
 *     RoleAccessService,
 *   ],
 *   bootstrap: [AppComponent],
 * })
 * export class AppModule { }
 */

// ============================================================
// INTEGRATION CHECKLIST
// ============================================================

/**
 * ✓ STEP 1: Import RoleAccessGuard & RoleAccessService
 * 
 * ✓ STEP 2: Thêm vào providers (standalone) hoặc providers array (module)
 * 
 * ✓ STEP 3: Thêm RoleAccessGuard vào routes
 *   - Management routing (done)
 *   - Khác routes (optional, chỉ nếu cần)
 * 
 * ✓ STEP 4: Import AuthorizedDirective trong components
 *   - Standalone: imports: [AuthorizedDirective]
 *   - Module: imports: [DirectivesModule]
 * 
 * ✓ STEP 5: Update error routing để handle 403
 *   - Thêm Error403Component route
 * 
 * ✓ STEP 6: Inject RoleAccessService vào components
 *   - private roleAccessService = inject(RoleAccessService);
 * 
 * ✓ STEP 7: Sử dụng directive trong templates
 *   - *appAuthorized, [appAuthorized]
 * 
 * ✓ STEP 8: Test với khác roles
 *   - Admin: Full access
 *   - Tenant: Limited modules
 *   - Others: Very limited access
 */

// ============================================================
// INITIALIZATION FLOW
// ============================================================

/**
 * 1. Bootstrap App
 *    ↓
 * 2. APP_INITIALIZER runs AuthService.init()
 *    ↓
 * 3. User data loaded (roles)
 *    ↓
 * 4. MenuService.reloadPagesAndExpand() (filter menu by role)
 *    ↓
 * 5. Navigate to /dashboard
 *    ↓
 * 6. RoleAccessGuard checks route permission
 *    ↓
 * 7. Component loads, RoleAccessService initialized with user roles
 *    ↓
 * 8. Template renders with [appAuthorized] directives
 * 
 * ✓ Full RBAC protection enabled!
 */

// ============================================================
// CACHING STRATEGY
// ============================================================

/**
 * RoleAccessService caches permissions để tối ưu performance:
 * 
 * Cache keys:
 * - module:{moduleKey}
 * - action:{moduleKey}:{action}
 * 
 * Cache invalidation:
 * 1. Automatic khi user roles thay đổi
 * 2. Manual: roleAccessService.refreshCache()
 * 
 * Refresh cache scenarios:
 * - Sau login
 * - Sau logout
 * - Sau update user role
 * - Sau permission change
 */

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Route Level:
 * - Invalid route → RoleAccessGuard returns false → Navigate /errors/403
 * 
 * Component Level:
 * - Method called without permission → Directive hides/disables element
 * - Or: Decorator throws Error hoặc returns false
 * 
 * API Level:
 * - Backend kiểm tra lại quyền (LUÔN phải có)
 * - 403 response → Handle trong HTTP interceptor
 * - 429 response (quota exceeded) → Retry logic
 */

// ============================================================
// MONITORING & LOGGING
// ============================================================

/**
 * Recommendations:
 * 
 * 1. Log unauthorized access attempts:
 *    ```
 *    const result = this.roleAccessService.checkAccess(...);
 *    if (!result.canAccess) {
 *      console.warn('Unauthorized access:', result.reason);
 *      this.logger.log('SECURITY', 'Unauthorized access', result);
 *    }
 *    ```
 * 
 * 2. Monitor permission cache hits/misses:
 *    ```
 *    if (cache.has(key)) {
 *      this.metrics.increment('permission_cache_hit');
 *    } else {
 *      this.metrics.increment('permission_cache_miss');
 *    }
 *    ```
 * 
 * 3. Audit role changes:
 *    ```
 *    onUserRoleChanged(userId, oldRoles, newRoles) {
 *      this.auditLog.record('ROLE_CHANGE', { userId, oldRoles, newRoles });
 *    }
 *    ```
 */

// ============================================================
// DEPENDENCY INJECTION TIPS
// ============================================================

/**
 * Service Hierarchy:
 * 
 * - RoleAccessService (root)
 *   ├── Depends on: CredentialService
 *   ├── Provides: canAccessModule(), canAction(), etc.
 *   └── Used by: Guards, Directives, Components
 * 
 * - RoleAccessGuard (root)
 *   ├── Depends on: RoleAccessService, Router, CredentialService
 *   ├── Used in: Route canActivate arrays
 *   └── Returns: boolean (allow/deny)
 * 
 * - AuthorizedDirective (standalone)
 *   ├── Depends on: RoleAccessService
 *   ├── Used in: Component templates
 *   └── Modifies: DOM (show/hide/disable)
 * 
 * Injection Pattern:
 * ```
 * private roleAccessService = inject(RoleAccessService);
 * private guard = inject(RoleAccessGuard);
 * ```
 */

// ============================================================
// PRODUCTION DEPLOYMENT NOTES
// ============================================================

/**
 * Before going to production:
 * 
 * ✓ Test tất cả roles với tất cả routes/actions
 * ✓ Verify backend cũng kiểm tra quyền
 * ✓ Enable permission cache (performance)
 * ✓ Setup monitoring cho unauthorized attempts
 * ✓ Implement audit logging
 * ✓ Test logout flow (cache clearing)
 * ✓ Test role change scenario
 * ✓ Review ROLE_PERMISSIONS matrix
 * ✓ Setup alerts cho suspicious activities
 * ✓ Document role structure cho team
 * ✓ Create runbook cho permission troubleshooting
 */
