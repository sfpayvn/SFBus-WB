/**
 * Role Access Control Service
 *
 * Service toàn diện để kiểm tra quyền của user:
 * - Kiểm tra quyền truy cập module
 * - Kiểm tra quyền thực hiện action (list, create, update, delete, view)
 * - Kiểm tra quyền truy cập chức năng (function keys)
 * - Cache kết quả để tối ưu hiệu năng
 */

import { Injectable, inject, WritableSignal, signal } from '@angular/core';
import { CredentialService } from '@rsApp/shared/services/credential.service';
import { ROLE_PERMISSIONS } from '@rsApp/core/constants/role-permissions.constant';
import { Observable, from, shareReplay, map } from 'rxjs';

export type ActionType = 'list' | 'create' | 'update' | 'delete' | 'view';

export interface RoleAccessCheckResult {
  canAccess: boolean;
  reason?: string; // Lý do không được phép nếu canAccess = false
}

@Injectable({ providedIn: 'root' })
export class RoleAccessService {
  private credentialService = inject(CredentialService);
  private userRolesCache: WritableSignal<string[] | null> = signal(null);
  private permissionCache = new Map<string, boolean>();

  constructor() {
    this.initializeUserRoles();
  }

  /**
   * Khởi tạo user roles từ credential service
   */
  public async initializeUserRoles(): Promise<void> {
    const user = await this.credentialService.getCurrentUser();
    if (user?.roles) {
      this.userRolesCache.set([...user.roles]);
    }
  }

  /**
   * Kiểm tra user có quyền truy cập module hay không (Synchronous)
   * @param moduleKey - Module key cần check
   * @returns true nếu user có quyền truy cập
   *
   * Ví dụ:
   * ```
   * if (this.roleAccessService.canAccessModule(MODULE_KEYS.BUS_MANAGEMENT)) {
   *   // Hiển thị component
   * }
   * ```
   */
  canAccessModule(moduleKey: string): boolean {
    const userRoles = this.userRolesCache();
    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    const cacheKey = `module:${moduleKey}`;
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!;
    }

    const hasAccess = userRoles.some((role) => {
      const rolePermission = (ROLE_PERMISSIONS as any)[role];
      return rolePermission?.modules?.includes(moduleKey);
    });

    this.permissionCache.set(cacheKey, hasAccess);
    return hasAccess;
  }

  /**
   * Kiểm tra user có quyền thực hiện action (create, update, delete, list, view) trên module
   *
   * @param moduleKey - Module key
   * @param action - Action type (list, create, update, delete, view)
   * @returns true nếu user có quyền
   *
   * Ví dụ:
   * ```
   * if (this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete')) {
   *   // Hiển thị nút delete
   * }
   * ```
   */
  canAction(moduleKey: string, action: ActionType): boolean {
    const userRoles = this.userRolesCache();
    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    const cacheKey = `action:${moduleKey}:${action}`;
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!;
    }

    const hasAccess = userRoles.some((role) => {
      const rolePermission = (ROLE_PERMISSIONS as any)[role];
      const moduleFunctions = rolePermission?.functions?.[moduleKey];
      return moduleFunctions?.includes(action);
    });

    this.permissionCache.set(cacheKey, hasAccess);
    return hasAccess;
  }

  /**
   * Kiểm tra user có quyền thực hiện multiple actions
   * @param moduleKey - Module key
   * @param actions - List actions cần check
   * @returns true nếu user có quyền thực hiện TẤT CẢ actions
   *
   * Ví dụ:
   * ```
   * if (this.roleAccessService.canActions(MODULE_KEYS.BUSES, ['create', 'delete'])) {
   *   // Enable form
   * }
   * ```
   */
  canActions(moduleKey: string, actions: ActionType[]): boolean {
    return actions.every((action) => this.canAction(moduleKey, action));
  }

  /**
   * Kiểm tra user có ANY quyền trong list actions
   * @param moduleKey - Module key
   * @param actions - List actions cần check
   * @returns true nếu user có quyền thực hiện ÍT NHẤT 1 action
   *
   * Ví dụ:
   * ```
   * if (this.roleAccessService.canAnyAction(MODULE_KEYS.BUSES, ['create', 'update', 'delete'])) {
   *   // Hiển thị edit section
   * }
   * ```
   */
  canAnyAction(moduleKey: string, actions: ActionType[]): boolean {
    return actions.some((action) => this.canAction(moduleKey, action));
  }

  /**
   * Kiểm tra user có quyền trên module hoặc function
   * @param moduleKey - Module key
   * @param functionKey - Function key (tùy chọn)
   * @param action - Action type (tùy chọn)
   * @returns Kết quả kiểm tra chi tiết
   */
  checkAccess(moduleKey: string, functionKey?: string, action?: ActionType): RoleAccessCheckResult {
    const userRoles = this.userRolesCache();

    if (!userRoles || userRoles.length === 0) {
      return {
        canAccess: false,
        reason: 'User không có role',
      };
    }

    // Kiểm tra module access
    if (!this.canAccessModule(moduleKey)) {
      return {
        canAccess: false,
        reason: `User không có quyền truy cập module: ${moduleKey}`,
      };
    }

    // Nếu có action, kiểm tra action access
    if (action && !this.canAction(moduleKey, action)) {
      return {
        canAccess: false,
        reason: `User không có quyền thực hiện action '${action}' trên module: ${moduleKey}`,
      };
    }

    return { canAccess: true };
  }

  /**
   * Lấy list roles của user hiện tại
   */
  getUserRoles(): string[] {
    return this.userRolesCache() || [];
  }

  /**
   * Kiểm tra user có role nào không
   * @param roleNames - Single role hoặc list roles
   * @returns true nếu user có ít nhất 1 role trong list
   *
   * Ví dụ:
   * ```
   * if (this.roleAccessService.hasRole(['admin', 'tenant'])) {
   *   // User là admin hoặc tenant
   * }
   * ```
   */
  hasRole(roleNames: string | string[]): boolean {
    const userRoles = this.getUserRoles();
    const rolesToCheck = Array.isArray(roleNames) ? roleNames : [roleNames];
    return rolesToCheck.some((role) => userRoles.includes(role));
  }

  /**
   * Kiểm tra user có ALL roles
   * @param roleNames - List roles cần check
   * @returns true nếu user có TẤT CẢ roles
   */
  hasAllRoles(roleNames: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roleNames.every((role) => userRoles.includes(role));
  }

  /**
   * Refresh cache - gọi sau khi update permissions
   */
  refreshCache(): void {
    this.permissionCache.clear();
    this.initializeUserRoles();
  }

  /**
   * Clear toàn bộ cache - gọi khi logout
   */
  clearCache(): void {
    this.permissionCache.clear();
    this.userRolesCache.set(null);
  }

  /**
   * Observable version - để sử dụng trong templates với async pipe
   * @param moduleKey - Module key
   * @returns Observable<boolean>
   */
  canAccessModule$(moduleKey: string): Observable<boolean> {
    return from(this.credentialService.getCurrentUser()).pipe(
      map((user) => {
        if (!user?.roles) return false;
        return user.roles.some((role: string) => {
          const rolePermission = (ROLE_PERMISSIONS as any)[role];
          return rolePermission?.modules?.includes(moduleKey);
        });
      }),
      shareReplay(1),
    );
  }

  /**
   * Observable version cho action check
   * @param moduleKey - Module key
   * @param action - Action type
   * @returns Observable<boolean>
   */
  canAction$(moduleKey: string, action: ActionType): Observable<boolean> {
    return from(this.credentialService.getCurrentUser()).pipe(
      map((user) => {
        if (!user?.roles) return false;
        return user.roles.some((role: string) => {
          const rolePermission = (ROLE_PERMISSIONS as any)[role];
          const moduleFunctions = rolePermission?.functions?.[moduleKey];
          return moduleFunctions?.includes(action);
        });
      }),
      shareReplay(1),
    );
  }
}
