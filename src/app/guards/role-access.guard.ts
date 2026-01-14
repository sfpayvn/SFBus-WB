/**
 * Role-Based Access Control Guard
 * 
 * Giải pháp mạnh mẽ để kiểm soát quyền truy cập dựa trên role:
 * 1. Chặn truy cập vào URL/route không được phép
 * 2. Kiểm soát hiển thị component
 * 3. Kiểm soát quyền action (create, update, delete, etc.)
 * 
 * Sử dụng:
 * - Trong routing: canActivate: [RoleAccessGuard]
 * - Trong component: RoleAccessService.hasAccess()
 * - Trên button/element: @RequiredRole hoặc [appAuthorized]
 */

import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ROLE_PERMISSIONS } from '@rsApp/core/constants/role-permissions.constant';
import { CredentialService } from '@rsApp/shared/services/credential.service';

@Injectable({ providedIn: 'root' })
export class RoleAccessGuard implements CanActivate {
  private credentialService = inject(CredentialService);
  private router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const user = await this.credentialService.getCurrentUser();

    if (!user || !user.roles || user.roles.length === 0) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Lấy moduleKey từ route data hoặc extract từ path
    const moduleKey = this.getModuleKey(route);

    if (!moduleKey) {
      // Nếu không có moduleKey, cho phép truy cập (public route)
      return true;
    }

    // Kiểm tra user có quyền truy cập module này không
    const hasAccess = this.hasModuleAccess(user.roles, moduleKey);

    if (!hasAccess) {
      // Redirect tới 403 hoặc 404 tùy theo cấu hình
      this.router.navigate(['/errors/403']);
      return false;
    }

    return true;
  }

  /**
   * Lấy module key từ route
   * Ưu tiên: route.data.moduleKey > route.data.requiredModule > extract từ path
   */
  private getModuleKey(route: ActivatedRouteSnapshot): string | null {
    // Cách 1: Từ route.data
    if (route.data && route.data['moduleKey']) {
      return route.data['moduleKey'];
    }

    if (route.data && route.data['requiredModule']) {
      return route.data['requiredModule'];
    }

    // Cách 2: Extract từ path
    return this.extractModuleKeyFromPath(route);
  }

  /**
   * Extract module key từ route path
   * Ví dụ: /management/bus-management/buses => bus-management
   */
  private extractModuleKeyFromPath(route: ActivatedRouteSnapshot): string | null {
    const fullPath = this.getFullPath(route);
    const parts = fullPath.split('/').filter((p) => p);

    // Tìm management và lấy phần tiếp theo
    const managementIndex = parts.indexOf('management');
    if (managementIndex !== -1 && managementIndex + 1 < parts.length) {
      return parts[managementIndex + 1];
    }

    return null;
  }

  /**
   * Lấy full path từ route hierarchy
   */
  private getFullPath(route: ActivatedRouteSnapshot): string {
    const segments: string[] = [];
    let current: ActivatedRouteSnapshot | null = route;

    while (current) {
      if (current.url.length > 0) {
        segments.unshift(...current.url.map((u) => u.path));
      }
      current = current.parent;
    }

    return '/' + segments.join('/');
  }

  /**
   * Kiểm tra user có quyền truy cập module hay không
   * @param userRoles - List roles của user
   * @param moduleKey - Module key cần check
   * @returns true nếu user có ít nhất 1 role có quyền truy cập module
   */
  private hasModuleAccess(userRoles: string[], moduleKey: string): boolean {
    return userRoles.some((role) => {
      const rolePermission = (ROLE_PERMISSIONS as any)[role];
      if (!rolePermission) return false;
      return rolePermission.modules.includes(moduleKey);
    });
  }
}
